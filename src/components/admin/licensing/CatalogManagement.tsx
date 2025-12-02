import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Search,
  Wrench,
  Briefcase,
  Layers,
  RefreshCw,
  Infinity
} from "lucide-react";
import { useCatalog, type CatalogItem, type CatalogFormData, type ProductType, type LicenseModel, type SupportLevel } from "@/hooks/useCatalog";
import { productFeatures } from "./license-data/productOptions";

const productIcons: Record<string, React.ElementType> = {
  'SeekCap': Search,
  'DDX': Network,
  'ParaGuard': Shield,
  'SecondLook': Eye,
  'Network Maintenance': Wrench,
  'Security Consulting': Briefcase,
  'Enterprise Bundle': Layers,
  'ICS Probe': Shield,
  'ORANGE Scada Simulator': Network,
};

const productTypeLabels: Record<ProductType, string> = {
  software: 'Software',
  maintenance: 'Maintenance',
  service: 'Service',
  bundle: 'Bundle'
};

const licenseModelLabels: Record<LicenseModel, string> = {
  perpetual: 'Perpetual',
  subscription: 'Subscription',
  demo: 'Demo Only',
  beta: 'Beta',
  alpha: 'Alpha'
};

const supportLevelLabels: Record<SupportLevel, string> = {
  standard: 'Standard',
  premium: 'Premium',
  enterprise: 'Enterprise'
};

const defaultFormData: CatalogFormData = {
  product_name: '',
  description: '',
  demo_duration_days: 14,
  demo_seats: 1,
  demo_features: [],
  is_active: true,
  product_type: 'software',
  license_model: 'subscription',
  subscription_period_months: 12,
  maintenance_included: false,
  support_level: 'standard'
};

const CatalogManagement: React.FC = () => {
  const { catalog, loading, addCatalogItem, updateCatalogItem, deleteCatalogItem, toggleActive } = useCatalog();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CatalogFormData>(defaultFormData);

  const resetForm = () => {
    setFormData(defaultFormData);
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
      is_active: item.is_active,
      product_type: item.product_type,
      license_model: item.license_model,
      subscription_period_months: item.subscription_period_months,
      maintenance_included: item.maintenance_included,
      support_level: item.support_level
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

  const getLicenseModelBadge = (model: LicenseModel) => {
    switch (model) {
      case 'perpetual':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"><Infinity className="h-3 w-3 mr-1" />Perpetual</Badge>;
      case 'subscription':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"><RefreshCw className="h-3 w-3 mr-1" />Subscription</Badge>;
      case 'demo':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Demo</Badge>;
      case 'beta':
        return <Badge variant="outline" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400">Beta</Badge>;
      case 'alpha':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Alpha</Badge>;
    }
  };

  const getProductTypeBadge = (type: ProductType) => {
    switch (type) {
      case 'software':
        return <Badge variant="secondary">Software</Badge>;
      case 'maintenance':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Maintenance</Badge>;
      case 'service':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">Service</Badge>;
      case 'bundle':
        return <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">Bundle</Badge>;
    }
  };

  const renderForm = () => (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
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
          <Label htmlFor="product_type">Product Type</Label>
          <Select 
            value={formData.product_type} 
            onValueChange={(value: ProductType) => setFormData(prev => ({ ...prev, product_type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="bundle">Bundle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Product description..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="license_model">License Model</Label>
          <Select 
            value={formData.license_model} 
            onValueChange={(value: LicenseModel) => setFormData(prev => ({ ...prev, license_model: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="perpetual">Perpetual</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="demo">Demo Only</SelectItem>
              <SelectItem value="beta">Beta</SelectItem>
              <SelectItem value="alpha">Alpha</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="support_level">Support Level</Label>
          <Select 
            value={formData.support_level} 
            onValueChange={(value: SupportLevel) => setFormData(prev => ({ ...prev, support_level: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.license_model === 'subscription' && (
        <div className="space-y-2">
          <Label htmlFor="subscription_period">Subscription Period (months)</Label>
          <Input
            id="subscription_period"
            type="number"
            min="1"
            value={formData.subscription_period_months || 12}
            onChange={(e) => setFormData(prev => ({ ...prev, subscription_period_months: parseInt(e.target.value) || 12 }))}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
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
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor="is_active">Active in catalog</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="maintenance_included"
            checked={formData.maintenance_included}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, maintenance_included: checked }))}
          />
          <Label htmlFor="maintenance_included">Maintenance included</Label>
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
          <p className="text-sm text-muted-foreground">Manage products available for licenses</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>License Model</TableHead>
              <TableHead>Support</TableHead>
              <TableHead>Demo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {catalog.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No products in catalog</h3>
                  <p className="text-muted-foreground">Add your first product to get started.</p>
                </TableCell>
              </TableRow>
            ) : (
              catalog.map((item) => {
                const IconComponent = productIcons[item.product_name] || Package;
                return (
                  <TableRow key={item.id} className={!item.is_active ? 'opacity-50' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{item.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getProductTypeBadge(item.product_type)}</TableCell>
                    <TableCell>{getLicenseModelBadge(item.license_model)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{item.support_level}</Badge>
                      {item.maintenance_included && (
                        <Badge variant="outline" className="ml-1 text-xs">+Maint</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {item.demo_duration_days}d
                        <Users className="h-3 w-3 ml-1" />
                        {item.demo_seats}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={() => handleToggleActive(item.id, item.is_active)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Dialog open={editingItem?.id === item.id} onOpenChange={(open) => !open && setEditingItem(null)}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                              <DialogDescription>Update product details.</DialogDescription>
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
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete {item.product_name}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove this product from the catalog.
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
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CatalogManagement;
