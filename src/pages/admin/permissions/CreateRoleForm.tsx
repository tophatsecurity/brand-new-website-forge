
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";

type Permission = {
  id: string;
  name: string;
  category: string;
  defaultRoles: string[];
};

type FormValues = {
  roleName: string;
  roleDescription: string;
};

interface CreateRoleFormProps {
  permissions: Permission[];
  onSubmit: (data: FormValues) => void;
}

const CreateRoleForm: React.FC<CreateRoleFormProps> = ({ permissions, onSubmit }) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  const form = useForm<FormValues>({
    defaultValues: {
      roleName: "",
      roleDescription: "",
    },
  });

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleSubmit = (data: FormValues) => {
    // Include the selected permissions with the form data
    onSubmit({
      ...data,
      // Additional data could be passed here if needed
    });
  };

  const permissionsByCategory = permissions.reduce((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {} as Record<string, typeof permissions>);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Role</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter role name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the display name for the role.
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="roleDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter role description" 
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of this role's purpose.
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <div>
              <h3 className="text-sm font-medium mb-3">Role Permissions</h3>
              <div className="space-y-3">
                {Object.entries(permissionsByCategory).map(([category, perms]) => (
                  <div key={category} className="border rounded-md p-3">
                    <h4 className="font-medium mb-2 text-sm">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {perms.map(p => (
                        <div key={p.id} className="flex items-center space-x-2">
                          <Switch 
                            id={`new-role-${p.id}`}
                            checked={selectedPermissions.includes(p.id)}
                            onCheckedChange={() => handlePermissionToggle(p.id)}
                          />
                          <Label htmlFor={`new-role-${p.id}`}>{p.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button type="submit">Create Role</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateRoleForm;
