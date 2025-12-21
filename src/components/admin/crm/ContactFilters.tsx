import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Filter, RefreshCw } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface ContactFiltersState {
  status: string;
  leadSource: string;
  industry: string;
  priority: string;
  interactionType: string;
  accountType: string;
  hasEmail: string;
  hasPhone: string;
  tags: string;
}

interface ContactFiltersProps {
  filters: ContactFiltersState;
  onFilterChange: (key: keyof ContactFiltersState, value: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

const ContactFilters = ({ filters, onFilterChange, onClearFilters, activeFilterCount }: ContactFiltersProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex items-center gap-2">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="gap-1 text-muted-foreground">
            <RefreshCw className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      <CollapsibleContent className="mt-3">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 p-4 border rounded-lg bg-muted/30">
          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <Select value={filters.status} onValueChange={(v) => onFilterChange('status', v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="nurturing">Nurturing</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lead Source Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Lead Source</label>
            <Select value={filters.leadSource} onValueChange={(v) => onFilterChange('leadSource', v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Black Hat 2022">Black Hat 2022</SelectItem>
                <SelectItem value="Black Hat 2023">Black Hat 2023</SelectItem>
                <SelectItem value="Black Hat 2024">Black Hat 2024</SelectItem>
                <SelectItem value="RSA Conference">RSA Conference</SelectItem>
                <SelectItem value="DEF CON">DEF CON</SelectItem>
                <SelectItem value="Trade Show">Trade Show</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Cold Outreach">Cold Outreach</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Industry Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Industry</label>
            <Select value={filters.industry} onValueChange={(v) => onFilterChange('industry', v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover max-h-60">
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Financial Services">Financial Services</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Government">Government</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Energy">Energy</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Telecommunications">Telecommunications</SelectItem>
                <SelectItem value="Consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Priority</label>
            <Select value={filters.priority} onValueChange={(v) => onFilterChange('priority', v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interaction Type Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Interaction Type</label>
            <Select value={filters.interactionType} onValueChange={(v) => onFilterChange('interactionType', v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Badge Scan">Badge Scan</SelectItem>
                <SelectItem value="Demo Request">Demo Request</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Phone Call">Phone Call</SelectItem>
                <SelectItem value="Webinar">Webinar</SelectItem>
                <SelectItem value="Download">Download</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Account Type Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Account Type</label>
            <Select value={filters.accountType} onValueChange={(v) => onFilterChange('accountType', v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Has Email Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Has Email</label>
            <Select value={filters.hasEmail} onValueChange={(v) => onFilterChange('hasEmail', v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Has Email</SelectItem>
                <SelectItem value="no">No Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Has Phone Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Has Phone</label>
            <Select value={filters.hasPhone} onValueChange={(v) => onFilterChange('hasPhone', v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Has Phone</SelectItem>
                <SelectItem value="no">No Phone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Tags</label>
            <Select value={filters.tags} onValueChange={(v) => onFilterChange('tags', v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Tags</SelectItem>
                <SelectItem value="hot-lead">Hot Lead</SelectItem>
                <SelectItem value="cold-lead">Cold Lead</SelectItem>
                <SelectItem value="follow-up">Follow Up</SelectItem>
                <SelectItem value="demo-requested">Demo Requested</SelectItem>
                <SelectItem value="pricing-sent">Pricing Sent</SelectItem>
                <SelectItem value="decision-maker">Decision Maker</SelectItem>
                <SelectItem value="technical-contact">Technical Contact</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="smb">SMB</SelectItem>
                <SelectItem value="priority-high">Priority High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(filters).map(([key, value]) => {
              if (value === 'all' || !value) return null;
              return (
                <Badge key={key} variant="secondary" className="gap-1 pr-1">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: {value}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 hover:bg-transparent"
                    onClick={() => onFilterChange(key as keyof ContactFiltersState, 'all')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ContactFilters;
