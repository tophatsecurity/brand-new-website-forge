import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const editUserSchema = z.object({
  first_name: z.string().max(100, 'First name must be less than 100 characters').optional(),
  last_name: z.string().max(100, 'Last name must be less than 100 characters').optional(),
  phone: z.string().max(20, 'Phone must be less than 20 characters').optional(),
  company: z.string().max(100, 'Company must be less than 100 characters').optional(),
  job_title: z.string().max(100, 'Job title must be less than 100 characters').optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string, metadata: EditUserFormValues) => Promise<void>;
  user: any;
}

const EditUserDialog = ({
  open,
  onOpenChange,
  onConfirm,
  user
}: EditUserDialogProps) => {
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      company: '',
      job_title: '',
      notes: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reset form when user changes or dialog opens
  useEffect(() => {
    if (open && user) {
      const metadata = user.user_metadata || {};
      form.reset({
        first_name: metadata.first_name || '',
        last_name: metadata.last_name || '',
        phone: metadata.phone || '',
        company: metadata.company || '',
        job_title: metadata.job_title || '',
        notes: metadata.notes || '',
      });
    }
  }, [open, user, form]);

  const handleSubmit = async (values: EditUserFormValues) => {
    setIsSubmitting(true);
    try {
      await onConfirm(user.id, values);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User Details</DialogTitle>
          <DialogDescription>
            Update profile information for <span className="font-medium">{user?.email}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about this user..." 
                      className="resize-none"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
