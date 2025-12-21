import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Key, 
  Download, 
  Wrench,
  Home,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Package,
  UserPlus,
  Settings,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'CRM', url: '/admin/crm', icon: Building2 },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Onboarding', url: '/admin/onboarding', icon: UserPlus },
  { title: 'Permissions', url: '/admin/permissions', icon: Shield },
  { title: 'Licensing', url: '/admin/licensing', icon: Key },
  { title: 'Catalog', url: '/admin/catalog', icon: Package },
  { title: 'Downloads', url: '/admin/downloads', icon: Download },
  { title: 'Actions', url: '/admin/actions', icon: Wrench },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const userEmail = user?.email || '';
  const userInitials = userEmail
    .split('@')[0]
    .split('.')
    .map(part => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2) || 'U';

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
            <h2 className="font-semibold text-lg text-foreground">Admin Panel</h2>
          )}
        </div>
        <NavLink
          to="/"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          {!collapsed && <span>Back to Site</span>}
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
              <p className="text-xs text-muted-foreground truncate">
                Admin
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation items */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url || 
            (item.url !== '/admin' && location.pathname.startsWith(item.url));
          
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
              {!collapsed && <span className="font-medium">{item.title}</span>}
            </NavLink>
          );
        })}
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

export default AdminSidebar;
