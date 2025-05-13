
import React from 'react';
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

type NavLinkProps = {
  name: string;
  href: string;
  onClick?: () => void;
  className?: string;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; href: string }[];
};

export const NavLink: React.FC<NavLinkProps> = ({ 
  name, 
  href, 
  onClick, 
  className = '',
  hasDropdown = false,
  dropdownItems = []
}) => {
  if (hasDropdown && dropdownItems.length > 0) {
    return (
      <NavigationMenuItem className="nav-item">
        <NavigationMenuTrigger className={cn("bg-transparent hover:bg-transparent focus:bg-transparent", className)}>
          {name}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[200px] gap-1 p-2 bg-popover border border-border shadow-md rounded-md">
            {dropdownItems.map((item) => (
              <li key={item.name}>
                <NavigationMenuLink asChild>
                  <Link
                    to={item.href}
                    className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    onClick={onClick}
                  >
                    {item.name}
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <Link
      to={href}
      className={`font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] transition-colors duration-200 ${className}`}
      onClick={onClick}
    >
      {name}
    </Link>
  );
};

// Define the type for navigation links
export type NavigationLinkType = {
  name: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; href: string }[];
};

export const getNavLinks = (): NavigationLinkType[] => {
  // Base navigation links - updated to remove About dropdown and add Careers
  return [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" }
  ];
};

// Get primary links for main navbar
export const getPrimaryNavLinks = (): NavigationLinkType[] => {
  const allLinks = getNavLinks();
  return allLinks.slice(0, 5); // First 5 items: Home, Products, Services, About, Careers
};

// Get secondary links for overflow display
export const getSecondaryNavLinks = (): NavigationLinkType[] => {
  const allLinks = getNavLinks();
  return [allLinks[5]]; // Only Contact remains in secondary
};
