
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { FileText, Download, LucideIcon, BadgeHelp, Users, Shield, Settings, Wrench, Key, Database } from 'lucide-react';
import { cn } from "@/lib/utils";

type SecondaryNavLinkProps = {
  name: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
};

const SecondaryNavLink: React.FC<SecondaryNavLinkProps> = ({ name, href, icon: Icon, active }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center text-sm font-medium transition-colors px-2 py-1 rounded-md",
        active 
          ? "text-foreground bg-muted/80" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
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
  const location = useLocation();
  
  // Only show the secondary nav to approved users
  if (!user?.user_metadata?.approved) {
    return null;
  }

  // Debug user metadata to see what's available
  console.log("User metadata in SecondaryNav:", user.user_metadata);
  
  // For testing purposes, temporarily force admin to true
  // IMPORTANT: This is just for debugging, remove this in production
  const isAdmin = true; // user?.user_metadata?.role === 'admin';
  console.log("Is admin:", isAdmin);
  
  // Define regular and admin links
  const regularLinks = [
    { name: "Licensing", href: "/licensing", icon: FileText },
    { name: "Support", href: "/support", icon: BadgeHelp },
    { name: "Downloads", href: "/downloads", icon: Download },
  ];
  
  const adminLinks = [
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Actions", href: "/admin/actions", icon: Wrench },
    { name: "Permissions", href: "/admin/permissions", icon: Shield },
    { name: "Downloads Admin", href: "/admin/downloads", icon: Database },
    { name: "Licensing Admin", href: "/admin/licensing", icon: Key },
  ];

  // Include admin links for all users temporarily for debugging
  const links = [...regularLinks, ...adminLinks];

  return (
    <div className={cn(
      "w-full bg-muted/50 border-b py-2 px-6 md:px-12 lg:px-24",
      className
    )}>
      <div className="flex items-center justify-start space-x-2 overflow-x-auto">
        {links.map((link) => (
          <SecondaryNavLink 
            key={link.name} 
            name={link.name} 
            href={link.href} 
            icon={link.icon}
            active={location.pathname === link.href}
          />
        ))}
      </div>
    </div>
  );
};

export default SecondaryNav;
