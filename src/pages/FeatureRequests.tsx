import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import UserLayout from '@/components/layouts/UserLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ThumbsUp, Plus, Lightbulb, Filter } from 'lucide-react';
import { useFeatureRequests, PRODUCT_OPTIONS, STATUS_OPTIONS } from '@/hooks/useFeatureRequests';
import { useAuth } from '@/contexts/AuthContext';
import FeatureRequestScoreboard from '@/components/features/FeatureRequestScoreboard';

const FeatureRequests = () => {
  const { user } = useAuth();
  const [productFilter, setProductFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({ title: '', description: '', product_name: '' });

  const { data: requests, isLoading, createRequest, vote, unvote } = useFeatureRequests(
    productFilter === 'all' ? undefined : productFilter
  );

  const filteredRequests = requests?.filter(req => 
    statusFilter === 'all' || req.status === statusFilter
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.title || !newRequest.description || !newRequest.product_name) return;
    
    await createRequest.mutateAsync(newRequest);
    setNewRequest({ title: '', description: '', product_name: '' });
    setDialogOpen(false);
  };

  const handleVote = (request: any) => {
    if (request.has_voted) {
      unvote.mutate(request.id);
    } else {
      vote.mutate(request.id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    return (
      <Badge className={statusOption?.color || ''} variant="secondary">
        {statusOption?.label || status}
      </Badge>
    );
  };

  return (
    <UserLayout>
      <Helmet>
        <title>Feature Requests | Top Hat Security</title>
        <meta name="description" content="Submit and vote on feature requests for our security products." />
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Feature Requests</h1>
          <p className="text-muted-foreground mt-1">
            Submit ideas and vote on features you'd like to see in our products
          </p>
        </div>

        {user && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Submit Request
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background">
              <DialogHeader>
                <DialogTitle>Submit a Feature Request</DialogTitle>
                <DialogDescription>
                  Share your idea for improving our products
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select 
                    value={newRequest.product_name} 
                    onValueChange={(v) => setNewRequest(p => ({ ...p, product_name: v }))}
                  >
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
                  <Label>Title</Label>
                  <Input 
                    placeholder="Brief title for your request"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest(p => ({ ...p, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Describe the feature and why it would be useful..."
                    rows={4}
                    value={newRequest.description}
                    onChange={(e) => setNewRequest(p => ({ ...p, description: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createRequest.isPending}>
                    {createRequest.isPending ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Scoreboard */}
      <FeatureRequestScoreboard 
        requests={requests || []} 
        userId={user?.id} 
        userEmail={user?.email}
        showUserStats={!!user}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
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
        </div>
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

      {/* Request List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading requests...</div>
      ) : filteredRequests?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No feature requests yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to submit a feature request!
            </p>
            {user && (
              <Button onClick={() => setDialogOpen(true)}>
                Submit Request
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests?.map((request) => (
            <Card key={request.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Vote button */}
                  <div className="flex flex-col items-center">
                    <Button
                      variant={request.has_voted ? 'default' : 'outline'}
                      size="sm"
                      className="h-12 w-12 flex-col gap-0"
                      onClick={() => handleVote(request)}
                      disabled={!user}
                    >
                      <ThumbsUp className={`h-4 w-4 ${request.has_voted ? '' : ''}`} />
                      <span className="text-xs font-bold">{request.vote_count}</span>
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-lg">{request.title}</h3>
                      <div className="flex gap-2 flex-shrink-0">
                        <Badge variant="outline">{request.product_name}</Badge>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{request.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span>Submitted by {request.submitted_by_email || 'Anonymous'}</span>
                      <span>•</span>
                      <span>{new Date(request.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!user && (
        <div className="text-center mt-8 p-4 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            <a href="/login" className="text-primary hover:underline">Sign in</a> to submit requests and vote on features
          </p>
        </div>
      )}
    </UserLayout>
  );
};

export default FeatureRequests;
