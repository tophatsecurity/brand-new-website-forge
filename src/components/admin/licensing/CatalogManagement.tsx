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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from 'date-fns';
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
  Infinity,
  Tag,
  GitBranch,
  FileText,
  DollarSign,
  Coins
} from "lucide-react";
import { useCatalog, type CatalogItem, type CatalogFormData, type ProductType, type LicenseModel, type SupportLevel, type VersionStage, type PriceTier } from "@/hooks/useCatalog";
import { productFeatures } from "./license-data/productOptions";

const productIcons: Record<string, React.ElementType> = {
  'SEEKCAP': Search,
  'DDX': Network,
  'PARAGUARD': Shield,
  'SECONDLOOK': Eye,
  'LIGHTFOOT': Wrench,
  'O-RANGE': Network,
  'ONBOARD': Briefcase,
  'AURORASENSE': Package,
  'Network Maintenance': Wrench,
  'Security Consulting': Briefcase,
  'Enterprise Bundle': Layers,
  'ICS Probe': Shield,
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
  support_level: 'standard',
  version: '1.0.0',
  version_stage: 'stable',
  release_date: new Date().toISOString(),
  changelog: null,
  credits_included: 0,
  price_tier: 'standard',
  base_price: 0,
  price_per_credit: 0,
  credit_packages: []
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
      support_level: item.support_level,
      version: item.version || '1.0.0',
      version_stage: item.version_stage || 'stable',
      release_date: item.release_date,
      changelog: item.changelog || '',
      credits_included: item.credits_included || 0,
      price_tier: item.price_tier || 'standard',
      base_price: item.base_price || 0,
      price_per_credit: item.price_per_credit || 0,
      credit_packages: item.credit_packages || []
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

  const getVersionStageBadge = (stage: VersionStage) => {
    switch (stage) {
      case 'alpha':
        return <Badge className="bg-red-500 hover:bg-red-600">Alpha</Badge>;
      case 'beta':
        return <Badge className="bg-cyan-500 hover:bg-cyan-600">Beta</Badge>;
      case 'rc':
        return <Badge className="bg-orange-500 hover:bg-orange-600">RC</Badge>;
      case 'stable':
        return <Badge className="bg-green-500 hover:bg-green-600">Stable</Badge>;
      case 'deprecated':
        return <Badge variant="secondary" className="bg-gray-500 hover:bg-gray-600 text-white">Deprecated</Badge>;
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
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="licensing">Licensing</TabsTrigger>
        <TabsTrigger value="pricing">Pricing</TabsTrigger>
        <TabsTrigger value="version">Version</TabsTrigger>
      </TabsList>
      
      <div className="max-h-[50vh] overflow-y-auto pr-2 mt-4">
        <TabsContent value="general" className="space-y-4 mt-0">
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

          <div className="space-y-2">
            <Label>Demo Features</Label>
            <MultiSelect
              options={productFeatures}
              selected={formData.demo_features}
              onChange={(features) => setFormData(prev => ({ ...prev, demo_features: features }))}
              placeholder="Select demo features"
            />
          </div>
        </TabsContent>

        <TabsContent value="licensing" className="space-y-4 mt-0">
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
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4 mt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_tier">Price Tier</Label>
              <Select 
                value={formData.price_tier} 
                onValueChange={(value: PriceTier) => setFormData(prev => ({ ...prev, price_tier: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="base_price">Base Price ($)</Label>
              <Input
                id="base_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.base_price}
                onChange={(e) => setFormData(prev => ({ ...prev, base_price: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credits_included">Credits Included</Label>
              <Input
                id="credits_included"
                type="number"
                min="0"
                value={formData.credits_included}
                onChange={(e) => setFormData(prev => ({ ...prev, credits_included: parseInt(e.target.value) || 0 }))}
              />
              <p className="text-xs text-muted-foreground">Processing units included with base price</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_per_credit">Price Per Credit ($)</Label>
              <Input
                id="price_per_credit"
                type="number"
                min="0"
                step="0.01"
                value={formData.price_per_credit}
                onChange={(e) => setFormData(prev => ({ ...prev, price_per_credit: parseFloat(e.target.value) || 0 }))}
              />
              <p className="text-xs text-muted-foreground">Cost for additional processing units</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="version" className="space-y-4 mt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                placeholder="e.g., 1.0.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version_stage">Version Stage</Label>
              <Select 
                value={formData.version_stage} 
                onValueChange={(value: VersionStage) => setFormData(prev => ({ ...prev, version_stage: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alpha">Alpha</SelectItem>
                  <SelectItem value="beta">Beta</SelectItem>
                  <SelectItem value="rc">Release Candidate</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="changelog">Changelog / Release Notes</Label>
            <Textarea
              id="changelog"
              value={formData.changelog || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, changelog: e.target.value || null }))}
              placeholder="What's new in this version..."
              rows={4}
            />
          </div>
        </TabsContent>
      </div>
    </Tabs>
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
          <DialogContent className="sm:max-w-[600px]">
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
              <TableHead>Version</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Demo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {catalog.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
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
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">{item.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-mono">{item.version}</span>
                        </div>
                        {getVersionStageBadge(item.version_stage)}
                      </div>
                    </TableCell>
                    <TableCell>{getProductTypeBadge(item.product_type)}</TableCell>
                    <TableCell>{getLicenseModelBadge(item.license_model)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="h-3 w-3" />
                          {item.base_price > 0 ? `$${item.base_price}` : 'Free'}
                        </div>
                        {item.credits_included > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Coins className="h-3 w-3" />
                            {item.credits_included} credits
                          </div>
                        )}
                      </div>
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
                          <DialogContent className="sm:max-w-[600px]">
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
