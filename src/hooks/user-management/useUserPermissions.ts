
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserPermissions = (fetchUsers: () => Promise<void>) => {
  const { toast } = useToast();

  const handleGrantPermission = async (userId: string, permission: "admin" | "downloads" | "support") => {
    try {
      const { error } = await supabase.from("user_permissions").insert({
        user_id: userId,
        permission,
        granted_by: null,
      });
      if (error) throw error;
      toast({ title: `Granted ${permission} permission` });
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error granting permission",
        description: error.message || "An error occurred",
        variant: 'destructive',
      });
    }
  };

  const handleRevokePermission = async (permissionId: string) => {
    try {
      const { error } = await supabase.from("user_permissions").delete().eq("id", permissionId);
      if (error) throw error;
      toast({ title: "Permission revoked" });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error revoking permission",
        description: error.message || "An error occurred",
        variant: 'destructive',
      });
    }
  };

  return {
    handleGrantPermission,
    handleRevokePermission
  };
};
