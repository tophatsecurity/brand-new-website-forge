import React, { useState, useEffect } from 'react';
import { format, parseISO, subDays } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  RefreshCw, 
  Eye, 
  Filter,
  User,
  Clock,
  FileText,
  Trash2,
  Edit,
  Plus,
  Download,
  Key,
  Shield
} from "lucide-react";
import { useAuditLog, AuditLogEntry, AuditAction, AuditEntityType } from '@/hooks/useAuditLog';
import { Skeleton } from "@/components/ui/skeleton";

const actionIcons: Record<AuditAction, React.ElementType> = {
  create: Plus,
  update: Edit,
  delete: Trash2,
  view: Eye,
  export: Download,
  bulk_update: Edit,
  bulk_delete: Trash2,
  activate: Key,
  suspend: Shield,
  revoke: Shield,
  login: User,
  logout: User,
  status_change: RefreshCw,
};

const actionColors: Record<AuditAction, string> = {
  create: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  update: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  delete: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  view: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  export: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  bulk_update: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  bulk_delete: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  activate: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  suspend: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  revoke: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  login: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
  logout: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  status_change: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
};

interface AuditLogViewerProps {
  entityType?: AuditEntityType;
  entityId?: string;
  compact?: boolean;
}

const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ 
  entityType: filterEntityType, 
  entityId: filterEntityId,
  compact = false 
}) => {
  const { fetchAuditLogs } = useAuditLog();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>(filterEntityType || 'all');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    const data = await fetchAuditLogs({
      entityType: filterEntityType || (entityFilter !== 'all' ? entityFilter as AuditEntityType : undefined),
      entityId: filterEntityId,
      action: actionFilter !== 'all' ? actionFilter as AuditAction : undefined,
      startDate: subDays(new Date(), 30),
      limit: 100
    });
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, [actionFilter, entityFilter]);

  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      log.user_email?.toLowerCase().includes(search) ||
      log.entity_name?.toLowerCase().includes(search) ||
      log.entity_id?.toLowerCase().includes(search) ||
      log.action.toLowerCase().includes(search)
    );
  });

  const viewDetails = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setDetailsOpen(true);
  };

  const ActionBadge = ({ action }: { action: AuditAction }) => {
    const Icon = actionIcons[action] || FileText;
    return (
      <Badge className={actionColors[action]} variant="outline">
        <Icon className="h-3 w-3 mr-1" />
        {action.replace('_', ' ')}
      </Badge>
    );
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Recent Activity</h4>
          <Button variant="ghost" size="sm" onClick={loadLogs}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
        <ScrollArea className="h-[200px]">
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No activity recorded</p>
          ) : (
            <div className="space-y-2">
              {filteredLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50 text-xs">
                  <div className="flex items-center gap-2">
                    <ActionBadge action={log.action} />
                    <span className="text-muted-foreground truncate max-w-[150px]">
                      {log.entity_name || log.entity_id}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {format(parseISO(log.created_at), 'MMM d, HH:mm')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user, entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {!filterEntityType && (
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Entity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              <SelectItem value="license">Licenses</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="catalog">Catalog</SelectItem>
              <SelectItem value="account">Accounts</SelectItem>
              <SelectItem value="contact">Contacts</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="bulk_delete">Bulk Delete</SelectItem>
            <SelectItem value="activate">Activate</SelectItem>
            <SelectItem value="suspend">Suspend</SelectItem>
            <SelectItem value="revoke">Revoke</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={loadLogs}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No audit logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {format(parseISO(log.created_at), 'MMM d, yyyy HH:mm')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[150px]">
                        {log.user_email || 'System'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ActionBadge action={log.action} />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <Badge variant="outline" className="mr-2">{log.entity_type}</Badge>
                      <span className="text-muted-foreground truncate">
                        {log.entity_name || log.entity_id?.slice(0, 8)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {log.new_values ? Object.keys(log.new_values).join(', ') : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => viewDetails(log)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Time</label>
                  <p>{format(parseISO(selectedLog.created_at), 'PPpp')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User</label>
                  <p>{selectedLog.user_email || 'System'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Action</label>
                  <div className="mt-1"><ActionBadge action={selectedLog.action} /></div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Entity</label>
                  <p>{selectedLog.entity_type} - {selectedLog.entity_name || selectedLog.entity_id}</p>
                </div>
              </div>

              {selectedLog.old_values && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Previous Values</label>
                  <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-auto max-h-32">
                    {JSON.stringify(selectedLog.old_values, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.new_values && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">New Values</label>
                  <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-auto max-h-32">
                    {JSON.stringify(selectedLog.new_values, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Metadata</label>
                  <pre className="mt-1 p-3 bg-muted rounded-md text-xs overflow-auto max-h-32">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                <p>User Agent: {selectedLog.user_agent}</p>
                {selectedLog.ip_address && <p>IP: {selectedLog.ip_address}</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogViewer;
