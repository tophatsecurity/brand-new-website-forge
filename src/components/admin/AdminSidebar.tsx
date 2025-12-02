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
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Permissions', url: '/admin/permissions', icon: Shield },
  { title: 'Licensing', url: '/admin/licensing', icon: Key },
  { title: 'Downloads', url: '/admin/downloads', icon: Download },
  { title: 'Actions', url: '/admin/actions', icon: Wrench },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "bg-card border-r border-border flex flex-col h-full transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <h2 className="font-semibold text-lg text-foreground">Admin Panel</h2>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <nav className="flex-1 p-2 space-y-1">
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

      <div className="p-2 border-t border-border">
        <NavLink
          to="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
            "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          )}
        >
          <Home className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Back to Site</span>}
        </NavLink>
      </div>
    </aside>
  );
}

export default AdminSidebar;
