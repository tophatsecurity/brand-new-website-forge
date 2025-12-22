import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AuditAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'view' 
  | 'export' 
  | 'bulk_update' 
  | 'bulk_delete'
  | 'activate'
  | 'suspend'
  | 'revoke'
  | 'login'
  | 'logout'
  | 'status_change';

export type AuditEntityType = 
  | 'license' 
  | 'user' 
  | 'catalog' 
  | 'account' 
  | 'contact' 
  | 'deal'
  | 'download'
  | 'feature_request'
  | 'onboarding'
  | 'role'
  | 'permission'
  | 'settings';

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action: AuditAction;
  entity_type: AuditEntityType;
  entity_id: string | null;
  entity_name: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

interface LogAuditParams {
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: string;
  entityName?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
}

export const useAuditLog = () => {
  const { user } = useAuth();

  const logAudit = useCallback(async ({
    action,
    entityType,
    entityId,
    entityName,
    oldValues,
    newValues,
    metadata = {}
  }: LogAuditParams) => {
    try {
      const { error } = await supabase
        .from('audit_log')
        .insert({
          user_id: user?.id || null,
          user_email: user?.email || null,
          action,
          entity_type: entityType,
          entity_id: entityId || null,
          entity_name: entityName || null,
          old_values: oldValues || null,
          new_values: newValues || null,
          user_agent: navigator.userAgent,
          metadata
        });

      if (error) {
        console.error('Failed to log audit entry:', error);
      }
    } catch (err) {
      console.error('Audit logging error:', err);
    }
  }, [user]);

  const fetchAuditLogs = useCallback(async (options?: {
    entityType?: AuditEntityType;
    entityId?: string;
    action?: AuditAction;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) => {
    let query = supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false });

    if (options?.entityType) {
      query = query.eq('entity_type', options.entityType);
    }
    if (options?.entityId) {
      query = query.eq('entity_id', options.entityId);
    }
    if (options?.action) {
      query = query.eq('action', options.action);
    }
    if (options?.userId) {
      query = query.eq('user_id', options.userId);
    }
    if (options?.startDate) {
      query = query.gte('created_at', options.startDate.toISOString());
    }
    if (options?.endDate) {
      query = query.lte('created_at', options.endDate.toISOString());
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch audit logs:', error);
      return [];
    }

    return data as AuditLogEntry[];
  }, []);

  return {
    logAudit,
    fetchAuditLogs
  };
};
