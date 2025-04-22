
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Form states
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [name, setName] = useState(user?.user_metadata?.name || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // For updating contact info
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const update: any = {};
    if (email !== user?.email) update.email = email;
    if (phone !== user?.phone) update.phone = phone;
    if (name !== user?.user_metadata?.name) {
      update.data = { ...(user?.user_metadata || {}), name };
    }
    try {
      const { data, error } = await supabase.auth.updateUser(update);
      if (error) throw error;
      toast({
        title: "Profile updated",
        description: "Your information has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // For updating password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword("");
      toast({
        title: "Password updated",
        description: "Your password has been changed."
      });
    } catch (error: any) {
      toast({
        title: "Error changing password",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="py-28 px-4">
        <div className="max-w-xl mx-auto bg-card rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">My Profile</h2>
          <form className="space-y-4 mb-8" onSubmit={handleUpdateInfo}>
            <div>
              <label className="block mb-1 font-medium" htmlFor="email">Email</label>
              <Input
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="phone">Phone Number</label>
              <Input
                id="phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                type="tel"
                autoComplete="tel"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="name">Name</label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                type="text"
                autoComplete="name"
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>Update Info</Button>
          </form>
          <form className="space-y-4" onSubmit={handleChangePassword}>
            <div>
              <label className="block mb-1 font-medium" htmlFor="password">New Password</label>
              <Input
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
            <Button type="submit" variant="outline" className="w-full" disabled={loading || password.length < 6}>
              Change Password
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
