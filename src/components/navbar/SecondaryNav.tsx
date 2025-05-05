
import React from 'react';
import { Link } from "react-router-dom";
import { FileText, Download, LucideIcon, BadgeHelp, Users, Shield, Settings, Wrench, Key, Database } from 'lucide-react';
import { cn } from "@/lib/utils";

type SecondaryNavLinkProps = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const SecondaryNavLink: React.FC<SecondaryNavLinkProps> = ({ name, href, icon: Icon }) => {
  return (
    <Link
      to={href}
      className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2"
    >
      <Icon className="h-4 w-4 mr-1" />
      {name}
    </Link>
  );
};

interface SecondaryNavProps {
  user: any;
  className?: string;
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({ user, className }) => {
  // Only show the secondary nav to approved users
  if (!user?.user_metadata?.approved) {
    return null;
  }

  const isAdmin = user?.user_metadata?.role === 'admin';

  return (
    <div className={cn(
      "w-full bg-muted/50 border-b py-1 px-6 md:px-12 lg:px-24",
      className
    )}>
      <div className="flex items-center justify-start space-x-4 overflow-x-auto">
        <SecondaryNavLink name="Licensing" href="/licensing" icon={FileText} />
        <SecondaryNavLink name="Support" href="/support" icon={BadgeHelp} />
        <SecondaryNavLink name="Downloads" href="/downloads" icon={Download} />
        
        {/* Admin pages - these will be accessible based on ProtectedRoute settings */}
        <SecondaryNavLink name="Users" href="/admin/users" icon={Users} />
        <SecondaryNavLink name="Actions" href="/admin/actions" icon={Wrench} />
        <SecondaryNavLink name="Permissions" href="/admin/permissions" icon={Shield} />
        <SecondaryNavLink name="Downloads Admin" href="/admin/downloads" icon={Database} />
        <SecondaryNavLink name="Licensing Admin" href="/admin/licensing" icon={Key} />
      </div>
    </div>
  );
};

export default SecondaryNav;
