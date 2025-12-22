import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, ThumbsUp, Plus } from 'lucide-react';
import { useFeatureRequests, PRODUCT_OPTIONS, STATUS_OPTIONS, PRIORITY_OPTIONS, FeatureRequest } from '@/hooks/useFeatureRequests';
import { useSupportTeam } from '@/hooks/useSupportTeam';
import FeatureRequestScoreboard from '@/components/features/FeatureRequestScoreboard';

const FeatureRequestsAdminPage = () => {
  const [productFilter, setProductFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null);
  const [editForm, setEditForm] = useState({ status: '', priority: '', assigned_to: '' });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    product_name: '',
    priority: 'medium',
    submitted_by_email: '',
  });
  const [creating, setCreating] = useState(false);

  const { data: requests, isLoading, updateRequest, deleteRequest, createRequestOnBehalf } = useFeatureRequests();
  const { data: teamMembers } = useSupportTeam();

  const filteredRequests = requests?.filter(req => {
    const matchesProduct = productFilter === 'all' || req.product_name === productFilter;
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesSearch = !searchTerm || 
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesProduct && matchesStatus && matchesSearch;
  });

  const stats = {
    total: requests?.length || 0,
    pending: requests?.filter(r => r.status === 'pending').length || 0,
    inProgress: requests?.filter(r => ['under_review', 'planned', 'in_progress'].includes(r.status)).length || 0,
    completed: requests?.filter(r => r.status === 'completed').length || 0,
  };

  const handleEdit = (request: FeatureRequest) => {
    setSelectedRequest(request);
    setEditForm({
      status: request.status,
      priority: request.priority,
      assigned_to: request.assigned_to || '',
    });
  };

  const handleSave = async () => {
    if (!selectedRequest) return;
    await updateRequest.mutateAsync({
      id: selectedRequest.id,
      status: editForm.status as any,
      priority: editForm.priority as any,
      assigned_to: editForm.assigned_to || null,
    });
    setSelectedRequest(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this request?')) {
      await deleteRequest.mutateAsync(id);
    }
  };

  const handleCreate = async () => {
    if (!createForm.title || !createForm.description || !createForm.product_name) return;
    setCreating(true);
    await createRequestOnBehalf.mutateAsync({
      title: createForm.title,
      description: createForm.description,
      product_name: createForm.product_name,
      priority: createForm.priority as any,
      submitted_by_email: createForm.submitted_by_email || undefined,
    });
    setCreating(false);
    setShowCreateDialog(false);
    setCreateForm({ title: '', description: '', product_name: '', priority: 'medium', submitted_by_email: '' });
  };

  const getStatusBadge = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    return (
      <Badge className={statusOption?.color || ''} variant="secondary">
        {statusOption?.label || status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-slate-500/10 text-slate-500',
      medium: 'bg-blue-500/10 text-blue-500',
      high: 'bg-orange-500/10 text-orange-500',
      critical: 'bg-red-500/10 text-red-500',
    };
    return (
      <Badge className={colors[priority] || ''} variant="secondary">
        {priority}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Feature Requests Management | Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Feature Requests</h1>
            <p className="text-muted-foreground">Manage user feature requests and feedback</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Request
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background">
              <DialogHeader>
                <DialogTitle>Create Feature Request</DialogTitle>
                <DialogDescription>
                  Create a feature request on behalf of a user
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-title">Title</Label>
                  <Input
                    id="create-title"
                    placeholder="Feature request title"
                    value={createForm.title}
                    onChange={(e) => setCreateForm(f => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-description">Description</Label>
                  <Textarea
                    id="create-description"
                    placeholder="Detailed description of the feature request..."
                    rows={4}
                    value={createForm.description}
                    onChange={(e) => setCreateForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select value={createForm.product_name} onValueChange={(v) => setCreateForm(f => ({ ...f, product_name: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {PRODUCT_OPTIONS.map(p => (
                          <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={createForm.priority} onValueChange={(v) => setCreateForm(f => ({ ...f, priority: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {PRIORITY_OPTIONS.map(p => (
                          <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-email">Submitter Email (optional)</Label>
                  <Input
                    id="create-email"
                    type="email"
                    placeholder="user@example.com"
                    value={createForm.submitted_by_email}
                    onChange={(e) => setCreateForm(f => ({ ...f, submitted_by_email: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank if submitting internally
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                  <Button 
                    onClick={handleCreate} 
                    disabled={creating || !createForm.title || !createForm.description || !createForm.product_name}
                  >
                    {creating ? 'Creating...' : 'Create Request'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Scoreboard */}
        <FeatureRequestScoreboard requests={requests || []} />

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search requests..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Product" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Products</SelectItem>
                  {PRODUCT_OPTIONS.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Status</SelectItem>
                  {STATUS_OPTIONS.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Votes</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredRequests?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests?.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <ThumbsUp className="h-3 w-3" />
                          <span className="font-medium">{request.vote_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium truncate max-w-[200px]">{request.title}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {request.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.product_name}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {request.submitted_by_email || 'Anonymous'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(request)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(request.id)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="bg-background">
            <DialogHeader>
              <DialogTitle>Edit Feature Request</DialogTitle>
              <DialogDescription>{selectedRequest?.title}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={editForm.status} onValueChange={(v) => setEditForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {STATUS_OPTIONS.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={editForm.priority} onValueChange={(v) => setEditForm(f => ({ ...f, priority: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {PRIORITY_OPTIONS.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select value={editForm.assigned_to} onValueChange={(v) => setEditForm(f => ({ ...f, assigned_to: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="">Unassigned</SelectItem>
                    {teamMembers?.map(member => (
                      <SelectItem key={member.id} value={member.id}>{member.email}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>Cancel</Button>
                <Button onClick={handleSave} disabled={updateRequest.isPending}>
                  {updateRequest.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default FeatureRequestsAdminPage;
