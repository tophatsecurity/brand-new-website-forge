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
  Coins,
  ChevronDown,
  ChevronRight,
  Headphones,
  Settings2,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  'AURORA SENSE': Package,
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
  const [searchTerm, setSearchTerm] = useState('');
  const [licenseTypeFilter, setLicenseTypeFilter] = useState<LicenseModel | 'all'>('all');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter catalog based on search and license type
  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch = searchTerm === '' || 
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLicenseType = licenseTypeFilter === 'all' || item.license_model === licenseTypeFilter;
    
    return matchesSearch && matchesLicenseType;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCatalog.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCatalog = filteredCatalog.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, licenseTypeFilter]);

  // Group products by base name (e.g., SEEKCAP, DDX, etc.)
  const groupedProducts = filteredCatalog.reduce((acc, item) => {
    const baseName = item.product_name.toUpperCase();
    if (!acc[baseName]) {
      acc[baseName] = [];
    }
    acc[baseName].push(item);
    return acc;
  }, {} as Record<string, CatalogItem[]>);

  // Sort groups alphabetically
  const sortedGroupNames = Object.keys(groupedProducts).sort();

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const expandAllGroups = () => {
    setExpandedGroups(new Set(sortedGroupNames));
  };

  const collapseAllGroups = () => {
    setExpandedGroups(new Set());
  };

  // Quick add maintenance/support for a product
  const handleQuickAddMaintenance = (productName: string) => {
    setFormData({
      ...defaultFormData,
      product_name: productName,
      description: `${productName} Annual Maintenance & Support`,
      product_type: 'maintenance',
      license_model: 'subscription',
      subscription_period_months: 12,
      maintenance_included: true,
      support_level: 'standard',
    });
    setIsAddOpen(true);
  };

  const handleQuickAddSupport = (productName: string) => {
    setFormData({
      ...defaultFormData,
      product_name: productName,
      description: `${productName} Premium Support Package`,
      product_type: 'service',
      license_model: 'subscription',
      subscription_period_months: 12,
      support_level: 'premium',
    });
    setIsAddOpen(true);
  };

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
      case 'evaluation':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Evaluation</Badge>;
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
      case 'free':
        return <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Free</Badge>;
      case 'evaluation':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Evaluation</Badge>;
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
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="evaluation">Evaluation</SelectItem>
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
                  <SelectItem value="evaluation">Evaluation</SelectItem>
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
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by SKU or name..." 
              className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select 
            value={licenseTypeFilter} 
            onValueChange={(value: LicenseModel | 'all') => setLicenseTypeFilter(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="License Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="perpetual">Perpetual</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="evaluation">Evaluation</SelectItem>
              <SelectItem value="beta">Beta</SelectItem>
              <SelectItem value="alpha">Alpha</SelectItem>
            </SelectContent>
          </Select>
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
      </div>

      {/* View Toggle & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1">
            <Button 
              variant={viewMode === 'flat' ? 'default' : 'ghost'} 
              size="sm" 
              className="h-7 px-3"
              onClick={() => setViewMode('flat')}
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button 
              variant={viewMode === 'grouped' ? 'default' : 'ghost'} 
              size="sm" 
              className="h-7 px-3"
              onClick={() => setViewMode('grouped')}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Grouped
            </Button>
          </div>
          {viewMode === 'grouped' && (
            <>
              <Button variant="outline" size="sm" onClick={expandAllGroups}>
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAllGroups}>
                Collapse All
              </Button>
            </>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {viewMode === 'grouped' ? `${sortedGroupNames.length} product groups • ` : ''}{filteredCatalog.length} items
        </span>
      </div>

      {/* Empty State */}
      {filteredCatalog.length === 0 ? (
        <div className="border rounded-lg p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">
            {catalog.length === 0 ? 'No products in catalog' : 'No matching products'}
          </h3>
          <p className="text-muted-foreground">
            {catalog.length === 0 ? 'Add your first product to get started.' : 'Try adjusting your search or filter.'}
          </p>
        </div>
      ) : viewMode === 'flat' ? (
        /* Flat Table View */
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">SKU</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCatalog.map((item) => {
                const IconComponent = productIcons[item.product_name] || Package;
                return (
                  <TableRow key={item.id} className={!item.is_active ? 'opacity-50' : ''}>
                    <TableCell>
                      {item.sku ? (
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                          {item.sku}
                        </code>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
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
                        <span className="text-sm font-mono">{item.version}</span>
                        {getVersionStageBadge(item.version_stage)}
                      </div>
                    </TableCell>
                    <TableCell>{getProductTypeBadge(item.product_type)}</TableCell>
                    <TableCell>{getLicenseModelBadge(item.license_model)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">
                          {item.base_price > 0 ? `$${item.base_price}` : 'Free'}
                        </span>
                        {item.credits_included > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {item.credits_included} credits
                          </span>
                        )}
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
              })}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select 
                  value={itemsPerPage.toString()} 
                  onValueChange={(value) => { setItemsPerPage(Number(value)); setCurrentPage(1); }}
                >
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground mr-2">
                  {startIndex + 1}-{Math.min(endIndex, filteredCatalog.length)} of {filteredCatalog.length}
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Grouped View */
        <div className="space-y-3">
          {sortedGroupNames.map((groupName) => {
            const items = groupedProducts[groupName];
            const IconComponent = productIcons[groupName] || Package;
            const isExpanded = expandedGroups.has(groupName);
            const hasEvaluation = items.some(i => i.license_model === 'evaluation');
            const hasSubscription = items.some(i => i.license_model === 'subscription');
            const hasPerpetual = items.some(i => i.license_model === 'perpetual');
            const hasMaintenance = items.some(i => i.product_type === 'maintenance');
            const hasService = items.some(i => i.product_type === 'service');
            const hasFree = items.some(i => i.product_type === 'free');
            const hasEvaluation2 = items.some(i => i.product_type === 'evaluation');

            return (
              <Collapsible key={groupName} open={isExpanded} onOpenChange={() => toggleGroup(groupName)}>
                <div className="border rounded-lg bg-card">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                        <IconComponent className="h-5 w-5 text-primary" />
                        <div className="text-left">
                          <h3 className="font-semibold">{groupName}</h3>
                          <p className="text-xs text-muted-foreground">{items.length} variant{items.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasFree && <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Free</Badge>}
                        {hasEvaluation2 && <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Evaluation</Badge>}
                        {hasSubscription && <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Subscription</Badge>}
                        {hasPerpetual && <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Perpetual</Badge>}
                        {hasMaintenance && <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Maintenance</Badge>}
                        {hasService && <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">Service</Badge>}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t">
                      {/* Quick Actions */}
                      <div className="flex items-center gap-2 p-3 bg-muted/30 border-b">
                        <span className="text-xs font-medium text-muted-foreground mr-2">Quick Add:</span>
                        {!hasMaintenance && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={(e) => { e.stopPropagation(); handleQuickAddMaintenance(groupName); }}
                          >
                            <Settings2 className="h-3 w-3 mr-1" />
                            Maintenance
                          </Button>
                        )}
                        {!hasService && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={(e) => { e.stopPropagation(); handleQuickAddSupport(groupName); }}
                          >
                            <Headphones className="h-3 w-3 mr-1" />
                            Support Package
                          </Button>
                        )}
                      </div>
                      {/* Items Table */}
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[140px]">SKU</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Version</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>License</TableHead>
                            <TableHead>Pricing</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item) => (
                            <TableRow key={item.id} className={!item.is_active ? 'opacity-50' : ''}>
                              <TableCell>
                                {item.sku ? (
                                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                                    {item.sku}
                                  </code>
                                ) : (
                                  <span className="text-muted-foreground text-xs">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <p className="text-sm truncate max-w-[200px]">{item.description}</p>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm font-mono">{item.version}</span>
                                  {getVersionStageBadge(item.version_stage)}
                                </div>
                              </TableCell>
                              <TableCell>{getProductTypeBadge(item.product_type)}</TableCell>
                              <TableCell>{getLicenseModelBadge(item.license_model)}</TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm">
                                    {item.base_price > 0 ? `$${item.base_price}` : 'Free'}
                                  </span>
                                  {item.credits_included > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                      {item.credits_included} credits
                                    </span>
                                  )}
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
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CatalogManagement;
