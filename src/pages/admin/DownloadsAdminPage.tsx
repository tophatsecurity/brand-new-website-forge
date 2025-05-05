
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { Database, Pencil, Plus, Trash, Upload, Eye, FileUp, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

// Mock data for downloads
const downloadsMockData = [
  { 
    id: "1", 
    product: "SeekCap", 
    type: "Software", 
    version: "2.1.3", 
    releaseDate: "2025-04-15T00:00:00Z", 
    visibility: "public",
    fileUrl: "/downloads/seekcap-2.1.3.zip",
    fileSize: "42.5 MB",
    platform: "Windows",
    lastDownloaded: "2025-05-01T14:23:00Z",
    downloadCount: 145
  },
  { 
    id: "2", 
    product: "DDX", 
    type: "Documentation", 
    version: "3.0.0", 
    releaseDate: "2025-04-01T00:00:00Z", 
    visibility: "customers",
    fileUrl: "/downloads/ddx-docs-3.0.0.pdf",
    fileSize: "8.2 MB",
    platform: "All",
    lastDownloaded: "2025-05-03T09:15:00Z",
    downloadCount: 87
  },
  { 
    id: "3", 
    product: "ParaGuard", 
    type: "Software", 
    version: "1.5.2", 
    releaseDate: "2025-03-20T00:00:00Z", 
    visibility: "hidden",
    fileUrl: "/downloads/paraguard-1.5.2.zip",
    fileSize: "36.8 MB",
    platform: "Linux",
    lastDownloaded: "2025-04-28T11:42:00Z",
    downloadCount: 64
  },
  { 
    id: "4", 
    product: "SecondLook", 
    type: "Updates", 
    version: "2.3.1", 
    releaseDate: "2025-02-10T00:00:00Z", 
    visibility: "public",
    fileUrl: "/downloads/secondlook-2.3.1-patch.zip",
    fileSize: "18.3 MB",
    platform: "MacOS",
    lastDownloaded: "2025-05-04T17:38:00Z",
    downloadCount: 211
  },
];

type FormValues = {
  product: string;
  type: string;
  version: string;
  platform: string;
  visibility: string;
  fileUrl: string;
};

const DownloadsAdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [downloads, setDownloads] = useState(downloadsMockData);
  
  const form = useForm<FormValues>({
    defaultValues: {
      product: "",
      type: "",
      version: "",
      platform: "",
      visibility: "public",
      fileUrl: "",
    },
  });
  
  // Redirect non-admin users
  if (!user || user.user_metadata?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const onSubmit = (data: FormValues) => {
    const newDownload = {
      id: Math.random().toString(36).substring(2, 9),
      product: data.product,
      type: data.type,
      version: data.version,
      releaseDate: new Date().toISOString(),
      visibility: data.visibility,
      fileUrl: data.fileUrl,
      fileSize: "0 MB", // Would be calculated from actual file
      platform: data.platform,
      lastDownloaded: "",
      downloadCount: 0
    };
    
    setDownloads([newDownload, ...downloads]);
    setOpen(false);
    form.reset();
    
    toast({
      title: "Download added",
      description: `Added ${data.product} version ${data.version} to downloads.`,
    });
  };

  const handleDelete = (id: string) => {
    setDownloads(downloads.filter(d => d.id !== id));
    toast({
      title: "Download removed",
      description: "The download has been removed.",
    });
  };

  const getVisibilityBadge = (visibility: string) => {
    switch(visibility) {
      case 'public':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Public</Badge>;
      case 'customers':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Customers</Badge>;
      case 'hidden':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Hidden</Badge>;
      default:
        return <Badge variant="outline">{visibility}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Database className="mr-2 h-6 w-6" />
              <h1 className="text-3xl font-bold">Downloads Management</h1>
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Download
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[540px]">
                <DialogHeader>
                  <DialogTitle>Add New Download</DialogTitle>
                  <DialogDescription>
                    Upload or link to a new downloadable file for your products.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="product"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="SeekCap">SeekCap</SelectItem>
                                <SelectItem value="DDX">DDX</SelectItem>
                                <SelectItem value="ParaGuard">ParaGuard</SelectItem>
                                <SelectItem value="SecondLook">SecondLook</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Software">Software</SelectItem>
                                <SelectItem value="Documentation">Documentation</SelectItem>
                                <SelectItem value="Updates">Updates</SelectItem>
                                <SelectItem value="Tools">Tools</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="version"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Version</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 2.1.3" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="platform"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Platform</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Windows">Windows</SelectItem>
                                <SelectItem value="MacOS">MacOS</SelectItem>
                                <SelectItem value="Linux">Linux</SelectItem>
                                <SelectItem value="All">All</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="fileUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>File URL</FormLabel>
                          <FormControl>
                            <div className="flex space-x-2">
                              <Input placeholder="Enter file URL or upload" {...field} className="flex-1" />
                              <Button type="button" variant="outline" className="shrink-0">
                                <Upload className="h-4 w-4 mr-1" /> Browse
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <FormLabel>Visibility</FormLabel>
                              <FormDescription>
                                Controls who can download this file
                              </FormDescription>
                            </div>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[150px]">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="customers">Customers Only</SelectItem>
                                <SelectItem value="hidden">Hidden</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={form.handleSubmit(onSubmit)}>Add Download</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Product Downloads</h2>
            <p className="text-muted-foreground mb-6">
              Manage product downloads available to your users.
            </p>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead className="text-right">Downloads</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No downloads available. Add your first download.
                      </TableCell>
                    </TableRow>
                  ) : (
                    downloads.map((download) => (
                      <TableRow key={download.id}>
                        <TableCell className="font-medium">{download.product}</TableCell>
                        <TableCell>{download.type}</TableCell>
                        <TableCell>{download.version}</TableCell>
                        <TableCell>{format(new Date(download.releaseDate), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{download.platform}</TableCell>
                        <TableCell>{getVisibilityBadge(download.visibility)}</TableCell>
                        <TableCell className="text-right">{download.downloadCount}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(download.id)}
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
      <Footer />
    </div>
  );
};

export default DownloadsAdminPage;
