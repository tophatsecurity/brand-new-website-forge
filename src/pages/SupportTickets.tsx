import React, { useState, useEffect } from "react";
import UserLayout from "@/components/layouts/UserLayout";
import { useSupportTickets, SupportTicket, TicketComment, TicketPriority } from "@/hooks/useSupportTickets";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, MessageCircle, Clock, CheckCircle, AlertCircle, Search, Send, X } from "lucide-react";
import { format } from "date-fns";

const priorityColors: Record<TicketPriority, string> = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const statusConfig = {
  open: { label: "Open", icon: AlertCircle, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  in_progress: { label: "In Progress", icon: Clock, color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  waiting_customer: { label: "Waiting on You", icon: MessageCircle, color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  waiting_internal: { label: "Under Review", icon: Clock, color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  resolved: { label: "Resolved", icon: CheckCircle, color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  closed: { label: "Closed", icon: CheckCircle, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
};

const SupportTickets = () => {
  const { user } = useAuth();
  const { tickets, loading, createTicket, fetchComments, addComment } = useSupportTickets();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [comments, setComments] = useState<TicketComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filter tickets for current user
  const userTickets = tickets.filter(t => t.requester_id === user?.id);

  // Form state for new ticket
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    priority: "medium" as TicketPriority,
    category: "general",
    product_name: "",
  });
  const [customProgram, setCustomProgram] = useState("");

  const filteredTickets = userTickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) return;
    
    const productName = newTicket.product_name === "Other" ? customProgram : newTicket.product_name;
    
    setSubmitting(true);
    const result = await createTicket({
      subject: newTicket.subject,
      description: newTicket.description,
      priority: newTicket.priority,
      category: newTicket.category,
      product_name: productName || undefined,
    });

    if (result) {
      setNewTicket({
        subject: "",
        description: "",
        priority: "medium",
        category: "general",
        product_name: "",
      });
      setCustomProgram("");
      setIsCreateOpen(false);
    }
    setSubmitting(false);
  };

  const handleViewTicket = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    const ticketComments = await fetchComments(ticket.id);
    // Filter out internal comments for customers
    setComments(ticketComments.filter(c => !c.is_internal));
  };

  const handleAddComment = async () => {
    if (!selectedTicket || !newComment.trim()) return;
    
    setSubmitting(true);
    const result = await addComment(selectedTicket.id, newComment, false);
    if (result) {
      setComments([...comments, result]);
      setNewComment("");
    }
    setSubmitting(false);
  };

  const activeTickets = userTickets.filter(t => !["resolved", "closed"].includes(t.status)).length;
  const resolvedTickets = userTickets.filter(t => ["resolved", "closed"].includes(t.status)).length;

  return (
    <UserLayout title="Support Tickets">
      <div className="space-y-6">
        {/* Header with stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-muted-foreground">Submit and track your support requests</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about your issue..."
                    rows={5}
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={newTicket.priority}
                      onValueChange={(val: TicketPriority) => setNewTicket({ ...newTicket, priority: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={newTicket.category}
                      onValueChange={(val) => setNewTicket({ ...newTicket, category: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="licensing">Licensing</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Related Program</Label>
                  <Select
                    value={newTicket.product_name}
                    onValueChange={(val) => {
                      setNewTicket({ ...newTicket, product_name: val });
                      if (val !== "Other") setCustomProgram("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SeekCap">SeekCap</SelectItem>
                      <SelectItem value="DDX">DDX</SelectItem>
                      <SelectItem value="ParaGuard">ParaGuard</SelectItem>
                      <SelectItem value="SecondLook">SecondLook</SelectItem>
                      <SelectItem value="Lightfoot">Lightfoot</SelectItem>
                      <SelectItem value="O-Range">O-Range</SelectItem>
                      <SelectItem value="Aurora Sense">Aurora Sense</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newTicket.product_name === "Other" && (
                  <div className="space-y-2">
                    <Label htmlFor="customProgram">Specify Program</Label>
                    <Input
                      id="customProgram"
                      placeholder="Enter program name"
                      value={customProgram}
                      onChange={(e) => setCustomProgram(e.target.value)}
                    />
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateTicket} 
                    disabled={submitting || !newTicket.subject.trim() || !newTicket.description.trim()}
                  >
                    {submitting ? "Creating..." : "Create Ticket"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{userTickets.length}</div>
              <p className="text-sm text-muted-foreground">Total Tickets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{activeTickets}</div>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{resolvedTickets}</div>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {userTickets.filter(t => t.status === "waiting_customer").length}
              </div>
              <p className="text-sm text-muted-foreground">Needs Response</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="waiting_customer">Waiting on You</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
              <p className="text-muted-foreground mb-4">
                {userTickets.length === 0 
                  ? "You haven't submitted any support tickets yet."
                  : "No tickets match your current filters."}
              </p>
              {userTickets.length === 0 && (
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Ticket
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => {
              const statusInfo = statusConfig[ticket.status];
              const StatusIcon = statusInfo.icon;
              return (
                <Card 
                  key={ticket.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewTicket(ticket)}
                >
                  <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground">
                            {ticket.ticket_number}
                          </span>
                          <Badge className={priorityColors[ticket.priority]} variant="secondary">
                            {ticket.priority}
                          </Badge>
                          <Badge className={statusInfo.color} variant="secondary">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <h3 className="font-medium truncate">{ticket.subject}</h3>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {ticket.description}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {format(new Date(ticket.created_at), "MMM d, yyyy")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Ticket Detail Dialog */}
        <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
            {selectedTicket && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-muted-foreground">
                      {selectedTicket.ticket_number}
                    </span>
                    <Badge className={priorityColors[selectedTicket.priority]} variant="secondary">
                      {selectedTicket.priority}
                    </Badge>
                    <Badge className={statusConfig[selectedTicket.status].color} variant="secondary">
                      {statusConfig[selectedTicket.status].label}
                    </Badge>
                  </div>
                  <DialogTitle className="text-left">{selectedTicket.subject}</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="conversation" className="flex-1 flex flex-col min-h-0">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="conversation">Conversation</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="conversation" className="flex-1 flex flex-col min-h-0 mt-4">
                    <ScrollArea className="flex-1 pr-4" style={{ maxHeight: "300px" }}>
                      {/* Original description */}
                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">You</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(selectedTicket.created_at), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{selectedTicket.description}</p>
                      </div>

                      {/* Comments */}
                      {comments.map((comment) => {
                        const isOwn = comment.user_id === user?.id;
                        return (
                          <div 
                            key={comment.id} 
                            className={`rounded-lg p-4 mb-4 ${isOwn ? "bg-muted/50" : "bg-primary/5 border border-primary/10"}`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">
                                {isOwn ? "You" : "Support Team"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(comment.created_at), "MMM d, yyyy 'at' h:mm a")}
                              </span>
                              {comment.is_resolution && (
                                <Badge variant="outline" className="text-green-600">Resolution</Badge>
                              )}
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                          </div>
                        );
                      })}
                    </ScrollArea>

                    {/* Reply input */}
                    {!["closed", "resolved"].includes(selectedTicket.status) && (
                      <div className="pt-4 border-t mt-4">
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Type your reply..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={2}
                            className="flex-1"
                          />
                          <Button 
                            onClick={handleAddComment} 
                            disabled={submitting || !newComment.trim()}
                            size="icon"
                            className="h-auto"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {["closed", "resolved"].includes(selectedTicket.status) && (
                      <div className="pt-4 border-t mt-4 text-center text-muted-foreground">
                        This ticket has been {selectedTicket.status}. Create a new ticket if you need further assistance.
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <p className="font-medium capitalize">{selectedTicket.category || "General"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Product:</span>
                        <p className="font-medium">{selectedTicket.product_name || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <p className="font-medium">
                          {format(new Date(selectedTicket.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Updated:</span>
                        <p className="font-medium">
                          {format(new Date(selectedTicket.updated_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      {selectedTicket.resolved_at && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Resolved:</span>
                          <p className="font-medium">
                            {format(new Date(selectedTicket.resolved_at), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      )}
                      {selectedTicket.resolution && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Resolution:</span>
                          <p className="font-medium mt-1 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            {selectedTicket.resolution}
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </UserLayout>
  );
};

export default SupportTickets;
