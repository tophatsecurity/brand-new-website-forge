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
import { Trash, PencilIcon, Plus, Package, TrendingUp, BarChart3, Users, Upload, FileCheck, Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DownloadTrendsChart } from '@/components/admin/downloads/DownloadTrendsChart';
import { Progress } from '@/components/ui/progress';

type CatalogItem = {
  id: string;
  product_name: string;
};

type Download = {
  id: string;
  product_name: string;
  product_type: string;
  package_format: string | null;
  version: string;
  release_date: string;
  description: string | null;
  file_url: string;
  is_latest: boolean;
  catalog_id: string | null;
  catalog?: CatalogItem | null;
  download_count?: number;
  sha256_hash?: string | null;
  file_size?: number | null;
  release_notes?: string | null;
};

type DownloadStats = {
  download_id: string;
  total_downloads: number;
  unique_users: number;
  last_downloaded_at: string | null;
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    product_name: '',
    product_type: '',
    package_format: '',
    version: '',
    release_date: new Date().toISOString().split('T')[0],
    description: '',
    file_url: '',
    is_latest: false,
    catalog_id: '' as string | null,
    sha256_hash: '' as string | null,
    file_size: null as number | null,
    release_notes: '' as string | null
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

  // Fetch download statistics
  const { data: downloadStats } = useQuery({
    queryKey: ['download-statistics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('download_statistics')
        .select('download_id');
        
      if (error) throw error;
      
      // Count downloads per download_id
      const counts: Record<string, number> = {};
      data?.forEach(stat => {
        counts[stat.download_id] = (counts[stat.download_id] || 0) + 1;
      });
      return counts;
    }
  });

  // Calculate totals
  const totalDownloads = downloadStats ? Object.values(downloadStats).reduce((sum, count) => sum + count, 0) : 0;
  const topDownload = downloads?.reduce((top, dl) => {
    const count = downloadStats?.[dl.id] || 0;
    const topCount = downloadStats?.[top?.id || ''] || 0;
    return count > topCount ? dl : top;
  }, downloads?.[0]);
  const topDownloadCount = topDownload ? (downloadStats?.[topDownload.id] || 0) : 0;

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('product_name', formData.product_name || 'unknown');
      formDataUpload.append('version', formData.version || '1.0.0');

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const response = await fetch(
        `https://saveabkhpaemynlfcgcy.supabase.co/functions/v1/upload-download-file`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataUpload,
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();

      setFormData(prev => ({
        ...prev,
        file_url: result.file_url,
        sha256_hash: result.sha256_hash,
        file_size: result.file_size
      }));

      toast({
        title: "File Uploaded",
        description: `SHA256: ${result.sha256_hash.substring(0, 16)}...`,
      });
    } catch (err: any) {
      console.error('Upload error:', err);
      toast({
        title: "Upload Failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
        package_format: formData.package_format || null,
        version: formData.version,
        release_date: formData.release_date,
        description: formData.description,
        file_url: formData.file_url,
        is_latest: formData.is_latest,
        catalog_id: formData.catalog_id || null,
        sha256_hash: formData.sha256_hash || null,
        file_size: formData.file_size || null,
        release_notes: formData.release_notes || null
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
        package_format: '',
        version: '',
        release_date: new Date().toISOString().split('T')[0],
        description: '',
        file_url: '',
        is_latest: false,
        catalog_id: null,
        sha256_hash: null,
        file_size: null,
        release_notes: null
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
      package_format: download.package_format || '',
      version: download.version,
      release_date: new Date(download.release_date).toISOString().split('T')[0],
      description: download.description || '',
      file_url: download.file_url,
      is_latest: download.is_latest,
      catalog_id: download.catalog_id,
      sha256_hash: download.sha256_hash || null,
      file_size: download.file_size || null,
      release_notes: download.release_notes || null
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingDownload(null);
    setFormData({
      product_name: '',
      product_type: '',
      package_format: '',
      version: '',
      release_date: new Date().toISOString().split('T')[0],
      description: '',
      file_url: '',
      is_latest: false,
      catalog_id: null,
      sha256_hash: null,
      file_size: null,
      release_notes: null
    });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout title="Manage Downloads">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads}</div>
            <p className="text-xs text-muted-foreground">All time downloads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Files</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{downloads?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Products available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{topDownload?.product_name || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">{topDownloadCount} downloads</p>
          </CardContent>
        </Card>
      </div>

      {/* Download Trends Chart */}
      <div className="mb-6">
        <DownloadTrendsChart />
      </div>

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

            <div className="space-y-2">
              <Label htmlFor="package_format">Package Format</Label>
              <Select 
                value={formData.package_format || ''} 
                onValueChange={(value) => setFormData({...formData, package_format: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select package format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exe">EXE (Windows Installer)</SelectItem>
                  <SelectItem value="msi">MSI (Windows Installer)</SelectItem>
                  <SelectItem value="deb">DEB (Debian/Ubuntu)</SelectItem>
                  <SelectItem value="rpm">RPM (Red Hat/CentOS/Fedora)</SelectItem>
                  <SelectItem value="dmg">DMG (macOS)</SelectItem>
                  <SelectItem value="pkg">PKG (macOS)</SelectItem>
                  <SelectItem value="appimage">AppImage (Linux)</SelectItem>
                  <SelectItem value="tar.gz">TAR.GZ (Linux/Unix)</SelectItem>
                  <SelectItem value="zip">ZIP (Cross-platform)</SelectItem>
                  <SelectItem value="ova">OVA (Virtual Appliance)</SelectItem>
                  <SelectItem value="iso">ISO (Disk Image)</SelectItem>
                  <SelectItem value="docker">Docker Image</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
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
            {/* File Upload Section */}
            <div className="space-y-2">
              <Label>Upload File</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <div className="flex flex-col items-center gap-2">
                  {isUploading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Uploading...</p>
                      <Progress value={uploadProgress} className="w-full" />
                    </>
                  ) : formData.file_url ? (
                    <>
                      <FileCheck className="h-8 w-8 text-green-500" />
                      <p className="text-sm text-muted-foreground">File uploaded successfully</p>
                      <label className="cursor-pointer">
                        <span className="text-sm text-primary hover:underline">Replace file</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <label className="cursor-pointer">
                        <span className="text-sm text-primary hover:underline">Click to upload file</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                      </label>
                      <p className="text-xs text-muted-foreground">Or enter URL manually below</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file_url">File URL</Label>
              <Input 
                id="file_url"
                value={formData.file_url}
                onChange={(e) => setFormData({...formData, file_url: e.target.value})}
                placeholder="https://..."
                required
              />
            </div>

            {/* SHA256 Hash Display */}
            {formData.sha256_hash && (
              <div className="space-y-2">
                <Label>SHA256 Hash</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <code className="text-xs break-all flex-1">{formData.sha256_hash}</code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(formData.sha256_hash || '');
                      toast({ title: "Copied", description: "SHA256 hash copied to clipboard" });
                    }}
                  >
                    Copy
                  </Button>
                </div>
                {formData.file_size && (
                  <p className="text-xs text-muted-foreground">
                    File size: {(formData.file_size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="release_notes">Release Notes</Label>
              <Textarea 
                id="release_notes"
                value={formData.release_notes || ''}
                onChange={(e) => setFormData({...formData, release_notes: e.target.value})}
                rows={3}
                placeholder="What's new in this version..."
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
                <TableHead>Format</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Hash</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Loading downloads...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-red-500">
                    Error loading downloads: {(error as Error).message}
                  </TableCell>
                </TableRow>
              ) : downloads && downloads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
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
                    <TableCell>
                      {download.package_format ? (
                        <Badge variant="outline" className="uppercase text-xs">
                          {download.package_format}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell>v{download.version}</TableCell>
                    <TableCell>
                      {download.sha256_hash ? (
                        <div className="flex items-center gap-1">
                          <code className="text-xs text-muted-foreground truncate max-w-[80px]" title={download.sha256_hash}>
                            {download.sha256_hash.substring(0, 8)}...
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => {
                              navigator.clipboard.writeText(download.sha256_hash || '');
                              toast({ title: "Copied", description: "SHA256 hash copied" });
                            }}
                          >
                            <FileCheck className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {downloadStats?.[download.id] || 0}
                      </Badge>
                    </TableCell>
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
