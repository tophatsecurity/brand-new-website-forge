
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Delete, DownloadCloud, Edit, Plus } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const productTypes = [
  "Virtual Machine",
  "Physical Hardware",
  "Appliance",
  "SEEKCAP",
  "DDX",
  "ParaGuard",
];

const downloadFormSchema = z.object({
  product_name: z.string().min(1, { message: "Product name is required" }),
  product_type: z.string().min(1, { message: "Product type is required" }),
  version: z.string().min(1, { message: "Version is required" }),
  file_url: z.string().url({ message: "Valid URL is required" }),
  description: z.string().optional(),
  is_latest: z.boolean().default(false),
  release_date: z.string().optional(),
});

type DownloadFormValues = z.infer<typeof downloadFormSchema>;

const DownloadsAdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const form = useForm<DownloadFormValues>({
    resolver: zodResolver(downloadFormSchema),
    defaultValues: {
      product_name: "",
      product_type: "",
      version: "",
      file_url: "",
      description: "",
      is_latest: false,
      release_date: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_downloads")
        .select("*")
        .order("product_name")
        .order("product_type")
        .order("release_date", { ascending: false });

      if (error) {
        throw error;
      }

      setDownloads(data || []);
    } catch (error: any) {
      console.error("Error fetching downloads:", error);
      toast({
        title: "Error loading downloads",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: DownloadFormValues) => {
    try {
      let operation;
      
      if (editId) {
        // Update existing download
        operation = supabase
          .from("product_downloads")
          .update(values)
          .eq("id", editId);
      } else {
        // Create new download
        operation = supabase
          .from("product_downloads")
          .insert([values]);
      }
      
      const { error } = await operation;
      
      if (error) throw error;
      
      toast({
        title: editId ? "Download updated" : "Download created",
        description: `Successfully ${editId ? "updated" : "added"} ${values.product_name} ${values.version}`,
      });
      
      fetchDownloads();
      handleDialogClose();
    } catch (error: any) {
      console.error("Error saving download:", error);
      toast({
        title: "Error saving download",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (download: any) => {
    setEditId(download.id);
    form.reset({
      product_name: download.product_name,
      product_type: download.product_type,
      version: download.version,
      file_url: download.file_url,
      description: download.description || "",
      is_latest: download.is_latest,
      release_date: download.release_date ? new Date(download.release_date).toISOString().split('T')[0] : "",
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this download?")) {
      try {
        const { error } = await supabase
          .from("product_downloads")
          .delete()
          .eq("id", id);
          
        if (error) throw error;
        
        toast({
          title: "Download deleted",
          description: "The download has been removed successfully",
        });
        
        fetchDownloads();
      } catch (error: any) {
        console.error("Error deleting download:", error);
        toast({
          title: "Error deleting download",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditId(null);
    form.reset();
  };

  const handleDialogOpen = () => {
    form.reset({
      product_name: "",
      product_type: "",
      version: "",
      file_url: "",
      description: "",
      is_latest: false,
      release_date: new Date().toISOString().split('T')[0],
    });
    setEditId(null);
    setOpenDialog(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-40 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Downloads</h1>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button onClick={handleDialogOpen} className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" /> Add Download
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editId ? "Edit Download" : "Add New Download"}</DialogTitle>
                  <DialogDescription>
                    {editId 
                      ? "Update the details for this product download." 
                      : "Add a new product download to the system."}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="product_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter product name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="product_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select product type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {productTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="version"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Version</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. 1.0.0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="file_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Download URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://..." />
                          </FormControl>
                          <FormDescription>
                            Direct download link to the file
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Enter a brief description of this release" 
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="release_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Release Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="is_latest"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Latest Version</FormLabel>
                            <FormDescription>
                              Mark this as the latest version of the product
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={handleDialogClose}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editId ? "Save Changes" : "Add Download"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="bg-card rounded-lg shadow-md p-6">
            {loading ? (
              <div className="py-8 text-center">Loading downloads...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Released</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {downloads.map((dl) => (
                      <TableRow key={dl.id}>
                        <TableCell>{dl.product_name}</TableCell>
                        <TableCell>
                          <Badge>{dl.product_type}</Badge>
                        </TableCell>
                        <TableCell>{dl.version}</TableCell>
                        <TableCell>
                          {dl.release_date ? new Date(dl.release_date).toLocaleDateString() : ""}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {dl.description}
                        </TableCell>
                        <TableCell>
                          {dl.is_latest && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                              Latest
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(dl)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(dl.id)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Delete className="h-4 w-4" />
                            </Button>
                            <a
                              href={dl.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600"
                              >
                                <DownloadCloud className="h-4 w-4" />
                              </Button>
                            </a>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {downloads.length === 0 && (
                  <div className="text-center py-8">No downloads available.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DownloadsAdminPage;
