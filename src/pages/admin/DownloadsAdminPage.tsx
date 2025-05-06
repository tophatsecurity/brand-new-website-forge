import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from 'date-fns';
import { Trash, PencilIcon, Plus } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type Download = {
  id: string;
  product_name: string;
  product_type: string;
  version: string;
  release_date: string;
  description: string | null;
  file_url: string;
  is_latest: boolean;
};

const DownloadsAdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [editingDownload, setEditingDownload] = useState<Download | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    product_name: '',
    product_type: '',
    version: '',
    release_date: new Date().toISOString().split('T')[0],
    description: '',
    file_url: '',
    is_latest: false
  });
  
  // Redirect non-admin users
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Fetch downloads data
  const { data: downloads, isLoading, error } = useQuery({
    queryKey: ['admin-downloads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_downloads')
        .select('*')
        .order('release_date', { ascending: false });
        
      if (error) throw error;
      return data as Download[];
    }
  });

  // Set as latest version
  const handleSetLatest = async (id: string, productName: string, productType: string) => {
    try {
      // First, set all versions of this product to not latest
      const { error: updateError } = await supabase
        .from('product_downloads')
        .update({ is_latest: false })
        .eq('product_name', productName)
        .eq('product_type', productType);
      
      if (updateError) throw updateError;
      
      // Then set this specific version as latest
      const { error: setLatestError } = await supabase
        .from('product_downloads')
        .update({ is_latest: true })
        .eq('id', id);
      
      if (setLatestError) throw setLatestError;
      
      toast({
        title: "Success",
        description: "Latest version updated successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['admin-downloads'] });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  // Handle form submission for create/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDownload) {
        // Update existing download
        const { error } = await supabase
          .from('product_downloads')
          .update({
            product_name: formData.product_name,
            product_type: formData.product_type,
            version: formData.version,
            release_date: formData.release_date,
            description: formData.description,
            file_url: formData.file_url,
            is_latest: formData.is_latest
          })
          .eq('id', editingDownload.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Download updated successfully",
        });
      } else {
        // Create new download
        // Fix: We need to provide all required fields with correct types
        const { error } = await supabase
          .from('product_downloads')
          .insert({
            product_name: formData.product_name,
            product_type: formData.product_type,
            version: formData.version,
            release_date: formData.release_date,
            description: formData.description,
            file_url: formData.file_url,
            is_latest: formData.is_latest
          });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Download created successfully",
        });
      }
      
      // Reset form and close dialog
      setFormData({
        product_name: '',
        product_type: '',
        version: '',
        release_date: new Date().toISOString().split('T')[0],
        description: '',
        file_url: '',
        is_latest: false
      });
      setEditingDownload(null);
      setIsDialogOpen(false);
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['admin-downloads'] });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const { error } = await supabase
        .from('product_downloads')
        .delete()
        .eq('id', deleteId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Download deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['admin-downloads'] });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  // Handle edit click
  const handleEdit = (download: Download) => {
    setEditingDownload(download);
    setFormData({
      product_name: download.product_name,
      product_type: download.product_type,
      version: download.version,
      release_date: new Date(download.release_date).toISOString().split('T')[0],
      description: download.description || '',
      file_url: download.file_url,
      is_latest: download.is_latest
    });
    setIsDialogOpen(true);
  };

  const showButtonInPage = location.pathname !== '/admin/downloads';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Manage Downloads</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              {showButtonInPage && (
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Download
                  </Button>
                </DialogTrigger>
              )}
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingDownload ? "Edit Download" : "Add New Download"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product_name">Product Name</Label>
                      <Input 
                        id="product_name"
                        value={formData.product_name}
                        onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product_type">Product Type</Label>
                      <Input 
                        id="product_type"
                        value={formData.product_type}
                        onChange={(e) => setFormData({...formData, product_type: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="version">Version</Label>
                      <Input 
                        id="version"
                        value={formData.version}
                        onChange={(e) => setFormData({...formData, version: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="release_date">Release Date</Label>
                      <Input 
                        id="release_date"
                        type="date"
                        value={formData.release_date}
                        onChange={(e) => setFormData({...formData, release_date: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file_url">File URL</Label>
                    <Input 
                      id="file_url"
                      value={formData.file_url}
                      onChange={(e) => setFormData({...formData, file_url: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="is_latest"
                      checked={formData.is_latest}
                      onCheckedChange={(checked) => setFormData({...formData, is_latest: checked as boolean})}
                    />
                    <Label htmlFor="is_latest">Mark as latest version</Label>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">
                      {editingDownload ? "Update" : "Add"} Download
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-card rounded-lg shadow-md p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading downloads...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-red-500">
                        Error loading downloads: {(error as Error).message}
                      </TableCell>
                    </TableRow>
                  ) : downloads && downloads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No downloads found. Add your first download.
                      </TableCell>
                    </TableRow>
                  ) : (
                    downloads?.map((download) => (
                      <TableRow key={download.id}>
                        <TableCell>{download.product_name}</TableCell>
                        <TableCell>{download.product_type}</TableCell>
                        <TableCell>v{download.version}</TableCell>
                        <TableCell>{format(parseISO(download.release_date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          {download.is_latest ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Latest</Badge>
                          ) : (
                            <Badge variant="outline" className="hover:bg-gray-100">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-auto p-0 text-xs"
                                onClick={() => handleSetLatest(download.id, download.product_name, download.product_type)}
                              >
                                Set as latest
                              </Button>
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(download)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500"
                              onClick={() => {
                                setDeleteId(download.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this download? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default DownloadsAdminPage;
