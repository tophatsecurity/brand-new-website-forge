import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useSLAConfigurations, SLAFormData } from '@/hooks/useSLAConfigurations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const PRODUCTS = ['DEFAULT', 'DDX', 'SEEKCAP', 'PARAGUARD', 'SECONDLOOK', 'LIGHTFOOT', 'O-RANGE', 'AURORA SENSE'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const SLAAdminPage = () => {
  const { configurations, loading, createConfiguration, updateConfiguration, deleteConfiguration } = useSLAConfigurations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SLAFormData>({
    product_name: 'DEFAULT',
    priority: 'medium',
    first_response_hours: 24,
    resolution_hours: 72,
    business_hours_only: true,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      product_name: 'DEFAULT',
      priority: 'medium',
      first_response_hours: 24,
      resolution_hours: 72,
      business_hours_only: true,
      is_active: true,
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (editingId) {
      await updateConfiguration(editingId, formData);
    } else {
      await createConfiguration(formData);
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (config: any) => {
    setFormData({
      product_name: config.product_name,
      sku: config.sku || undefined,
      priority: config.priority,
      first_response_hours: config.first_response_hours,
      resolution_hours: config.resolution_hours,
      business_hours_only: config.business_hours_only,
      escalation_hours: config.escalation_hours || undefined,
      escalation_contact: config.escalation_contact || undefined,
      is_active: config.is_active,
    });
    setEditingId(config.id);
    setDialogOpen(true);
  };

  const formatHours = (hours: number) => {
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    const remaining = hours % 24;
    return remaining > 0 ? `${days}d ${remaining}h` : `${days}d`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'medium': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <AdminLayout title="SLA Configuration">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Configure Service Level Agreements per product and priority level
          </p>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add SLA Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit' : 'Add'} SLA Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select value={formData.product_name} onValueChange={(v) => setFormData({ ...formData, product_name: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCTS.map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map(p => (
                          <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>SKU (optional - for product-specific overrides)</Label>
                  <Input
                    placeholder="e.g., DDX-PRO"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value || undefined })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Response (hours)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={formData.first_response_hours}
                      onChange={(e) => setFormData({ ...formData, first_response_hours: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Resolution (hours)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={formData.resolution_hours}
                      onChange={(e) => setFormData({ ...formData, resolution_hours: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Escalation After (hours)</Label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Optional"
                      value={formData.escalation_hours || ''}
                      onChange={(e) => setFormData({ ...formData, escalation_hours: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Escalation Contact</Label>
                    <Input
                      placeholder="Email or name"
                      value={formData.escalation_contact || ''}
                      onChange={(e) => setFormData({ ...formData, escalation_contact: e.target.value || undefined })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.business_hours_only}
                      onCheckedChange={(checked) => setFormData({ ...formData, business_hours_only: checked })}
                    />
                    <Label>Business hours only (9-5)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingId ? 'Update' : 'Create'} SLA Rule
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold">{configurations.length}</div>
                  <p className="text-sm text-muted-foreground">Total SLA Rules</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{configurations.filter(c => c.is_active).length}</div>
                  <p className="text-sm text-muted-foreground">Active Rules</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">{new Set(configurations.map(c => c.product_name)).size}</div>
                  <p className="text-sm text-muted-foreground">Products Covered</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {configurations.filter(c => c.priority === 'urgent' && c.is_active).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Urgent Priority Rules</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SLA Table */}
        <Card>
          <CardHeader>
            <CardTitle>SLA Rules</CardTitle>
            <CardDescription>
              Rules are matched by product → SKU → priority. More specific rules take precedence.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>First Response</TableHead>
                    <TableHead>Resolution</TableHead>
                    <TableHead>Business Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configurations.map((config) => (
                    <TableRow key={config.id}>
                      <TableCell className="font-medium">{config.product_name}</TableCell>
                      <TableCell>{config.sku || '—'}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(config.priority)} variant="secondary">
                          {config.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatHours(config.first_response_hours)}</TableCell>
                      <TableCell>{formatHours(config.resolution_hours)}</TableCell>
                      <TableCell>{config.business_hours_only ? 'Yes' : '24/7'}</TableCell>
                      <TableCell>
                        <Badge variant={config.is_active ? 'default' : 'secondary'}>
                          {config.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(config)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete SLA Rule?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove the SLA configuration for {config.product_name} ({config.priority}).
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteConfiguration(config.id)}>
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
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SLAAdminPage;
