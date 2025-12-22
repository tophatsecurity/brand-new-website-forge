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
  LayoutDashboard
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

interface NavSection {
  title: string;
  items: { title: string; url: string; icon: any }[];
  roles?: string[]; // If empty/undefined, show to all
}

const getNavSections = (isAdmin: boolean, userRoles: string[]): NavSection[] => {
  const sections: NavSection[] = [
    {
      title: 'User Features',
      items: [
        { title: 'Licensing', url: '/licensing', icon: FileText },
        { title: 'Credits', url: '/credits', icon: Coins },
        { title: 'Support', url: '/support', icon: BadgeHelp },
        { title: 'Downloads', url: '/downloads', icon: Download },
        { title: 'Feature Requests', url: '/feature-requests', icon: ClipboardList },
      ]
    },
    {
      title: 'Account',
      items: [
        { title: 'Profile', url: '/profile', icon: User },
        { title: 'Settings', url: '/settings', icon: Settings },
      ]
    }
  ];

  // Add program manager section if user has that role
  if (userRoles.includes('program_manager')) {
    sections.push({
      title: 'Program Manager',
      items: [
        { title: 'Manage Requests', url: '/admin/feature-requests', icon: ClipboardList },
      ]
    });
  }

  // Add admin section if user is admin
  if (isAdmin) {
    sections.push({
      title: 'Administration',
      items: [
        { title: 'Admin Dashboard', url: '/admin', icon: LayoutDashboard },
        { title: 'Permissions', url: '/admin/permissions', icon: Shield },
      ]
    });
  }

  return sections;
};

export function UserSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(['User Features', 'Account', 'Program Manager', 'Administration']);
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
    return location.pathname === url || location.pathname.startsWith(url + '/');
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
            <h2 className="font-semibold text-lg text-foreground">My Portal</h2>
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
              <p className="text-xs text-muted-foreground truncate capitalize">
                {userRoles.length > 0 ? userRoles[0] : 'User'}
              </p>
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
                  {section.title}
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

export default UserSidebar;
