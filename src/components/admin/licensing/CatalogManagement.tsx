import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Package, 
  Calendar, 
  Users,
  Loader2,
  Shield,
  Network,
  Eye,
  Search
} from "lucide-react";
import { useCatalog, type CatalogItem, type CatalogFormData } from "@/hooks/useCatalog";
import { productFeatures } from "./license-data/productOptions";

const productIcons: Record<string, React.ElementType> = {
  'SeekCap': Search,
  'DDX': Network,
  'ParaGuard': Shield,
  'SecondLook': Eye,
};

const CatalogManagement: React.FC = () => {
  const { catalog, loading, addCatalogItem, updateCatalogItem, deleteCatalogItem, toggleActive } = useCatalog();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CatalogFormData>({
    product_name: '',
    description: '',
    demo_duration_days: 14,
    demo_seats: 1,
    demo_features: [],
    is_active: true
  });

  const resetForm = () => {
    setFormData({
      product_name: '',
      description: '',
      demo_duration_days: 14,
      demo_seats: 1,
      demo_features: [],
      is_active: true
    });
    setEditingItem(null);
  };

  const handleEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setFormData({
      product_name: item.product_name,
      description: item.description,
      demo_duration_days: item.demo_duration_days,
      demo_seats: item.demo_seats,
      demo_features: item.demo_features || [],
      is_active: item.is_active
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateCatalogItem(editingItem.id, formData);
        setEditingItem(null);
      } else {
        await addCatalogItem(formData);
        setIsAddOpen(false);
      }
      resetForm();
    } catch (err) {
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCatalogItem(id);
  };

  const handleToggleActive = async (id: string, currentValue: boolean) => {
    await toggleActive(id, !currentValue);
  };

  const renderForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product_name">Product Name</Label>
          <Input
            id="product_name"
            value={formData.product_name}
            onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
            placeholder="e.g., SeekCap"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="demo_duration">Demo Duration (days)</Label>
          <Input
            id="demo_duration"
            type="number"
            min="1"
            value={formData.demo_duration_days}
            onChange={(e) => setFormData(prev => ({ ...prev, demo_duration_days: parseInt(e.target.value) || 14 }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Product description..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="demo_seats">Demo Seats</Label>
          <Input
            id="demo_seats"
            type="number"
            min="1"
            value={formData.demo_seats}
            onChange={(e) => setFormData(prev => ({ ...prev, demo_seats: parseInt(e.target.value) || 1 }))}
          />
        </div>
        <div className="space-y-2 flex items-end">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Active in catalog</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Demo Features</Label>
        <MultiSelect
          options={productFeatures}
          selected={formData.demo_features}
          onChange={(features) => setFormData(prev => ({ ...prev, demo_features: features }))}
          placeholder="Select demo features"
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Product Catalog</h2>
          <p className="text-sm text-muted-foreground">Manage products available for demo licenses</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new product to the license catalog.
              </DialogDescription>
            </DialogHeader>
            {renderForm()}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !formData.product_name}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {catalog.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-muted/50 rounded-lg">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No products in catalog</h3>
            <p className="text-muted-foreground">Add your first product to get started.</p>
          </div>
        ) : (
          catalog.map((item) => {
            const IconComponent = productIcons[item.product_name] || Package;
            return (
              <Card key={item.id} className={!item.is_active ? 'opacity-60' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{item.product_name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={() => handleToggleActive(item.id, item.is_active)}
                      />
                      <Badge variant={item.is_active ? "default" : "secondary"}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="mt-1">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {item.demo_duration_days} days
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {item.demo_seats} seat{item.demo_seats > 1 ? 's' : ''}
                      </div>
                    </div>

                    {item.demo_features && item.demo_features.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.demo_features.map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Dialog open={editingItem?.id === item.id} onOpenChange={(open) => !open && setEditingItem(null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                            <Pencil className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                            <DialogDescription>
                              Update product details.
                            </DialogDescription>
                          </DialogHeader>
                          {renderForm()}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
                            <Button onClick={handleSubmit} disabled={isSubmitting || !formData.product_name}>
                              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {item.product_name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently remove this product from the catalog. Existing licenses will not be affected.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CatalogManagement;
