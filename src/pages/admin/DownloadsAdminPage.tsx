import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from 'date-fns';
import { Trash, PencilIcon, Plus, Package } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type CatalogItem = {
  id: string;
  product_name: string;
};

type Download = {
  id: string;
  product_name: string;
  product_type: string;
  version: string;
  release_date: string;
  description: string | null;
  file_url: string;
  is_latest: boolean;
  catalog_id: string | null;
  catalog?: CatalogItem | null;
};

const DownloadsAdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingDownload, setEditingDownload] = useState<Download | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [formData, setFormData] = useState({
    product_name: '',
    product_type: '',
    version: '',
    release_date: new Date().toISOString().split('T')[0],
    description: '',
    file_url: '',
    is_latest: false,
    catalog_id: '' as string | null
  });
  
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Fetch catalog items for dropdown
  useEffect(() => {
    const fetchCatalog = async () => {
      const { data } = await supabase
        .from('license_catalog')
        .select('id, product_name')
        .eq('is_active', true)
        .order('product_name');
      
      if (data) setCatalogItems(data);
    };
    fetchCatalog();
  }, []);

  const { data: downloads, isLoading, error } = useQuery({
    queryKey: ['admin-downloads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_downloads')
        .select(`
          *,
          catalog:license_catalog(id, product_name)
        `)
        .order('release_date', { ascending: false });
        
      if (error) throw error;
      return data as Download[];
    }
  });

  const handleCatalogChange = (catalogId: string) => {
    const selectedCatalog = catalogItems.find(c => c.id === catalogId);
    if (selectedCatalog) {
      setFormData({
        ...formData, 
        catalog_id: catalogId,
        product_name: selectedCatalog.product_name
      });
    } else {
      setFormData({...formData, catalog_id: catalogId === 'none' ? null : catalogId});
    }
  };

  const handleSetLatest = async (id: string, productName: string, productType: string) => {
    try {
      const { error: updateError } = await supabase
        .from('product_downloads')
        .update({ is_latest: false })
        .eq('product_name', productName)
        .eq('product_type', productType);
      
      if (updateError) throw updateError;
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        product_name: formData.product_name,
        product_type: formData.product_type,
        version: formData.version,
        release_date: formData.release_date,
        description: formData.description,
        file_url: formData.file_url,
        is_latest: formData.is_latest,
        catalog_id: formData.catalog_id || null
      };

      if (editingDownload) {
        const { error } = await supabase
          .from('product_downloads')
          .update(submitData)
          .eq('id', editingDownload.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Download updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('product_downloads')
          .insert(submitData);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Download created successfully",
        });
      }
      
      setFormData({
        product_name: '',
        product_type: '',
        version: '',
        release_date: new Date().toISOString().split('T')[0],
        description: '',
        file_url: '',
        is_latest: false,
        catalog_id: null
      });
      setEditingDownload(null);
      setIsDialogOpen(false);
      
      queryClient.invalidateQueries({ queryKey: ['admin-downloads'] });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

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
      
      queryClient.invalidateQueries({ queryKey: ['admin-downloads'] });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const handleEdit = (download: Download) => {
    setEditingDownload(download);
    setFormData({
      product_name: download.product_name,
      product_type: download.product_type,
      version: download.version,
      release_date: new Date(download.release_date).toISOString().split('T')[0],
      description: download.description || '',
      file_url: download.file_url,
      is_latest: download.is_latest,
      catalog_id: download.catalog_id
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingDownload(null);
    setFormData({
      product_name: '',
      product_type: '',
      version: '',
      release_date: new Date().toISOString().split('T')[0],
      description: '',
      file_url: '',
      is_latest: false,
      catalog_id: null
    });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout title="Manage Downloads">
      <div className="flex justify-end mb-4">
        <Button className="flex items-center gap-2" onClick={handleAddNew}>
          <Plus className="h-4 w-4" />
          Add Download
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingDownload ? "Edit Download" : "Add New Download"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="catalog_id">Link to Catalog Product</Label>
              <Select 
                value={formData.catalog_id || 'none'} 
                onValueChange={handleCatalogChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No linked product</SelectItem>
                  {catalogItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.product_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Linking to a catalog product will auto-fill the product name</p>
            </div>
            
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
                <Select 
                  value={formData.product_type} 
                  onValueChange={(value) => setFormData({...formData, product_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                    <SelectItem value="firmware">Firmware</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="tool">Tool</SelectItem>
                    <SelectItem value="sdk">SDK</SelectItem>
                  </SelectContent>
                </Select>
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

      <div className="bg-card rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catalog</TableHead>
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
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading downloads...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-red-500">
                    Error loading downloads: {(error as Error).message}
                  </TableCell>
                </TableRow>
              ) : downloads && downloads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No downloads found. Add your first download.
                  </TableCell>
                </TableRow>
              ) : (
                downloads?.map((download) => (
                  <TableRow key={download.id}>
                    <TableCell>
                      {download.catalog ? (
                        <Badge variant="outline" className="flex items-center gap-1 w-fit">
                          <Package className="h-3 w-3" />
                          {download.catalog.product_name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">Not linked</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{download.product_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{download.product_type}</Badge>
                    </TableCell>
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
    </AdminLayout>
  );
};

export default DownloadsAdminPage;
