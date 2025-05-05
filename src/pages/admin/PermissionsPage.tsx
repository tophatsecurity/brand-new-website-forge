
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";
import { Shield, User, Download, FileText, BadgeHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const roles = [
  { id: "admin", name: "Administrator", description: "Full system access" },
  { id: "manager", name: "Manager", description: "Can manage most system features" },
  { id: "user", name: "Standard User", description: "Basic system access" },
  { id: "support", name: "Support Agent", description: "Can access support features" },
]

const permissions = [
  { id: "users_view", name: "View Users", category: "Users", defaultRoles: ["admin", "manager"] },
  { id: "users_edit", name: "Edit Users", category: "Users", defaultRoles: ["admin"] },
  { id: "downloads_access", name: "Access Downloads", category: "Downloads", defaultRoles: ["admin", "manager", "user"] },
  { id: "downloads_manage", name: "Manage Downloads", category: "Downloads", defaultRoles: ["admin", "manager"] },
  { id: "licensing_view", name: "View Licenses", category: "Licensing", defaultRoles: ["admin", "manager", "user"] },
  { id: "licensing_manage", name: "Manage Licenses", category: "Licensing", defaultRoles: ["admin"] },
  { id: "support_view", name: "View Support Tickets", category: "Support", defaultRoles: ["admin", "manager", "support"] },
  { id: "support_resolve", name: "Resolve Support Tickets", category: "Support", defaultRoles: ["admin", "support"] },
]

type FormValues = {
  roleName: string;
  roleDescription: string;
};

const PermissionsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("roles");
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>(
    roles.reduce((acc, role) => ({
      ...acc,
      [role.id]: permissions
        .filter(p => p.defaultRoles.includes(role.id))
        .map(p => p.id)
    }), {})
  );
  
  const form = useForm<FormValues>({
    defaultValues: {
      roleName: "",
      roleDescription: "",
    },
  });
  
  // Redirect non-admin users
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const handlePermissionToggle = (roleId: string, permissionId: string) => {
    setRolePermissions(prev => {
      const currentPermissions = prev[roleId] || [];
      if (currentPermissions.includes(permissionId)) {
        return {
          ...prev,
          [roleId]: currentPermissions.filter(id => id !== permissionId)
        };
      } else {
        return {
          ...prev,
          [roleId]: [...currentPermissions, permissionId]
        };
      }
    });
    
    toast({
      title: "Permission updated",
      description: `Updated permissions for role.`,
    });
  };

  const onSubmit = (data: FormValues) => {
    // Here you would typically save the new role to your backend
    toast({
      title: "Role created",
      description: `Created new role: ${data.roleName}`,
    });
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Shield className="mr-2 h-6 w-6" />
            <h1 className="text-3xl font-bold">Permission Management</h1>
          </div>
          
          <div className="flex mb-6 space-x-4">
            <Button 
              variant={activeTab === "roles" ? "default" : "outline"}
              onClick={() => setActiveTab("roles")}
            >
              Roles
            </Button>
            <Button 
              variant={activeTab === "matrix" ? "default" : "outline"}
              onClick={() => setActiveTab("matrix")}
            >
              Permission Matrix
            </Button>
            <Button 
              variant={activeTab === "create" ? "default" : "outline"}
              onClick={() => setActiveTab("create")}
            >
              Create New Role
            </Button>
          </div>
          
          {activeTab === "roles" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map(role => (
                <Card key={role.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {role.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Permissions:</p>
                      <ul className="text-sm pl-5 list-disc space-y-1">
                        {permissions
                          .filter(p => rolePermissions[role.id]?.includes(p.id))
                          .map(p => (
                            <li key={p.id}>{p.name}</li>
                          ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {activeTab === "matrix" && (
            <div className="bg-card rounded-lg shadow-md p-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Permission</TableHead>
                    {roles.map(role => (
                      <TableHead key={role.id} className="text-center">{role.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map(permission => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{permission.name}</span>
                          <span className="text-xs text-muted-foreground">{permission.category}</span>
                        </div>
                      </TableCell>
                      {roles.map(role => (
                        <TableCell key={role.id} className="text-center">
                          <Switch
                            checked={rolePermissions[role.id]?.includes(permission.id)}
                            onCheckedChange={() => handlePermissionToggle(role.id, permission.id)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {activeTab === "create" && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Create New Role</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            <Input placeholder="Enter role description" {...field} />
                          </FormControl>
                          <FormDescription>
                            A brief description of this role's purpose.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Default Permissions</h3>
                      <div className="space-y-3">
                        {Object.entries(permissions.reduce((acc, p) => {
                          acc[p.category] = acc[p.category] || [];
                          acc[p.category].push(p);
                          return acc;
                        }, {} as Record<string, typeof permissions>)).map(([category, perms]) => (
                          <div key={category} className="border rounded-md p-3">
                            <h4 className="font-medium mb-2 text-sm">{category}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {perms.map(p => (
                                <div key={p.id} className="flex items-center space-x-2">
                                  <Switch id={`new-role-${p.id}`} />
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
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PermissionsPage;
