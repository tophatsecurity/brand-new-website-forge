
import React from 'react';
import { Link } from "react-router-dom";
import { FileText, Download, LucideIcon, LicenseIcon, BadgeHelp } from 'lucide-react';
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

  return (
    <div className={cn(
      "w-full bg-muted/50 border-b py-1 px-6 md:px-12 lg:px-24",
      className
    )}>
      <div className="flex items-center justify-end space-x-4">
        <SecondaryNavLink name="Licensing" href="/licensing" icon={FileText} />
        <SecondaryNavLink name="Support" href="/support" icon={BadgeHelp} />
        <SecondaryNavLink name="Downloads" href="/downloads" icon={Download} />
      </div>
    </div>
  );
};

export default SecondaryNav;
