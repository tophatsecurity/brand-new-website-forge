import { NavLink, useLocation } from 'react-router-dom';
import { 
  FileText, 
  BadgeHelp, 
  Download, 
  Coins,
  Home,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronDown,
  ClipboardList,
  Settings,
  User,
  Shield,
  LayoutDashboard,
  Users,
  Key,
  Wrench,
  Package,
  UserPlus,
  Building2,
  CreditCard,
  UserCog,
  HeadphonesIcon,
  BadgeCheck,
  Handshake
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from '@/components/ui/badge';

interface NavItem {
  title: string;
  url: string;
  icon: any;
}

interface NavSection {
  title: string;
  items: NavItem[];
  requiredRoles?: string[]; // If empty/undefined, show to all authenticated users
  adminOnly?: boolean;
}

const getNavSections = (isAdmin: boolean, userRoles: string[]): NavSection[] => {
  const sections: NavSection[] = [];

  // Customer section - available to all authenticated users
  sections.push({
    title: 'Customer',
    items: [
      { title: 'Entitlements', url: '/entitlements', icon: Key },
      { title: 'Catalog', url: '/catalog', icon: Package },
      { title: 'Credits', url: '/credits', icon: Coins },
      { title: 'Support', url: '/support/tickets', icon: HeadphonesIcon },
    ]
  });

  // Resources - available to all authenticated users
  sections.push({
    title: 'Resources',
    items: [
      { title: 'Knowledge Base', url: '/support', icon: BadgeHelp },
      { title: 'Downloads', url: '/downloads', icon: Download },
      { title: 'Feature Requests', url: '/feature-requests', icon: ClipboardList },
    ]
  });

  // Account - available to all
  sections.push({
    title: 'Account',
    items: [
      { title: 'Profile', url: '/profile', icon: User },
      { title: 'Settings', url: '/settings', icon: Settings },
    ]
  });

  // Partner section (formerly VAR)
  if (userRoles.includes('var') || userRoles.includes('customer_rep') || isAdmin) {
    sections.push({
      title: 'Partner Portal',
      requiredRoles: ['var', 'customer_rep'],
      items: [
        { title: 'Partner Dashboard', url: '/partner', icon: Handshake },
        { title: 'Deal Registration', url: '/partner/deals', icon: Handshake },
        { title: 'Price Calculator', url: '/partner/calculator', icon: CreditCard },
      ]
    });
  }

  // Program Manager section
  if (userRoles.includes('program_manager') || isAdmin) {
    sections.push({
      title: 'Program Manager',
      requiredRoles: ['program_manager'],
      items: [
        { title: 'Manage Requests', url: '/admin/feature-requests', icon: ClipboardList },
      ]
    });
  }

  // Support role section
  if (userRoles.includes('support') || isAdmin) {
    sections.push({
      title: 'Support Team',
      requiredRoles: ['support'],
      items: [
        { title: 'Ticket Queue', url: '/admin/support-tickets', icon: HeadphonesIcon },
        { title: 'Knowledge Base Admin', url: '/admin/support', icon: BadgeHelp },
      ]
    });
  }

  // Customer Rep / Account Rep section
  if (userRoles.includes('customer_rep') || userRoles.includes('account_rep') || isAdmin) {
    sections.push({
      title: 'Sales & CRM',
      requiredRoles: ['customer_rep', 'account_rep'],
      items: [
        { title: 'CRM', url: '/admin/crm', icon: Building2 },
        { title: 'Customer Onboarding', url: '/admin/onboarding', icon: UserPlus },
        { title: 'Payment Approvals', url: '/admin/payment-approvals', icon: BadgeCheck },
      ]
    });
  }

  // Moderator section
  if (userRoles.includes('moderator') || isAdmin) {
    sections.push({
      title: 'Moderation',
      requiredRoles: ['moderator'],
      items: [
        { title: 'Support Team Mgmt', url: '/admin/support-team', icon: HeadphonesIcon },
      ]
    });
  }

  // Admin section - only for admins
  if (isAdmin) {
    sections.push({
      title: 'Admin Overview',
      adminOnly: true,
      items: [
        { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
      ]
    });

    sections.push({
      title: 'User Management',
      adminOnly: true,
      items: [
        { title: 'Users', url: '/admin/users', icon: Users },
        { title: 'Role Assignment', url: '/admin/roles', icon: UserCog },
        { title: 'Permissions', url: '/admin/permissions', icon: Shield },
      ]
    });

    sections.push({
      title: 'Product Management',
      adminOnly: true,
      items: [
        { title: 'Entitlements', url: '/admin/licensing', icon: Key },
        { title: 'Catalog', url: '/admin/catalog', icon: Package },
        { title: 'Credits Admin', url: '/admin/credits', icon: CreditCard },
        { title: 'Downloads Admin', url: '/admin/downloads', icon: Download },
      ]
    });

    sections.push({
      title: 'System',
      adminOnly: true,
      items: [
        { title: 'Actions', url: '/admin/actions', icon: Wrench },
        { title: 'Admin Settings', url: '/admin/settings', icon: Settings },
      ]
    });
  }

  return sections;
};

export function PortalSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([
    'Portal', 'Account', 'Program Manager', 'Sales & CRM', 'Moderation',
    'Admin Overview', 'User Management', 'Product Management', 'System'
  ]);
  const location = useLocation();
  const { user, signOut, isAdmin, userRoles } = useAuth();

  const userEmail = user?.email || '';
  const userInitials = userEmail
    .split('@')[0]
    .split('.')
    .map(part => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2) || 'U';

  const navSections = getNavSections(isAdmin, userRoles);

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) 
        ? prev.filter(s => s !== title)
        : [...prev, title]
    );
  };

  const isItemActive = (url: string) => {
    if (url === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname === url || location.pathname.startsWith(url + '/');
  };

  // Get primary role display
  const getPrimaryRoleDisplay = () => {
    if (isAdmin) return 'Admin';
    if (userRoles.includes('program_manager')) return 'Program Manager';
    if (userRoles.includes('customer_rep')) return 'Customer Rep';
    if (userRoles.includes('account_rep')) return 'Account Rep';
    if (userRoles.includes('moderator')) return 'Moderator';
    if (userRoles.length > 0) return userRoles[0].replace('_', ' ');
    return 'User';
  };

  return (
    <aside 
      className={cn(
        "bg-card border-r border-border flex flex-col h-full transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header with collapse button and back to site */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          {!collapsed && (
            <h2 className="font-semibold text-lg text-foreground">Portal</h2>
          )}
        </div>
        <NavLink
          to="/"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          {!collapsed && <span>Home</span>}
        </NavLink>
      </div>

      {/* User info at top */}
      <div className="p-3 border-b border-border">
        <div className={cn(
          "flex items-center gap-3",
          collapsed ? "justify-center" : ""
        )}>
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {userEmail}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge 
                  variant={isAdmin ? "default" : "secondary"} 
                  className="text-[10px] px-1.5 py-0 h-4"
                >
                  {getPrimaryRoleDisplay()}
                </Badge>
                {userRoles.length > 1 && !isAdmin && (
                  <span className="text-[10px] text-muted-foreground">
                    +{userRoles.length - 1}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation items with sections */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="mb-2">
            {collapsed ? (
              // Collapsed: just show icons
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = isItemActive(item.url);
                  return (
                    <NavLink
                      key={item.url}
                      to={item.url}
                      title={item.title}
                      className={cn(
                        "flex items-center justify-center p-2.5 rounded-lg transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </NavLink>
                  );
                })}
              </div>
            ) : (
              // Expanded: show collapsible sections
              <Collapsible
                open={openSections.includes(section.title)}
                onOpenChange={() => toggleSection(section.title)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                  <div className="flex items-center gap-2">
                    {section.title}
                    {section.adminOnly && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 border-destructive/50 text-destructive">
                        Admin
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className={cn(
                    "h-3 w-3 transition-transform",
                    openSections.includes(section.title) ? "rotate-180" : ""
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-1 mt-1">
                    {section.items.map((item) => {
                      const isActive = isItemActive(item.url);
                      return (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                            "hover:bg-accent hover:text-accent-foreground",
                            isActive 
                              ? "bg-primary text-primary-foreground" 
                              : "text-muted-foreground"
                          )}
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="font-medium">{item.title}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom section - Sign out only */}
      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          onClick={signOut}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors justify-start",
            "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Sign out</span>}
        </Button>
      </div>
    </aside>
  );
}

export default PortalSidebar;
