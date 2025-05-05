
import React from 'react';
import { Link } from "react-router-dom";
import { FileText, Download, Settings, User } from 'lucide-react';

type NavLinkProps = {
  name: string;
  href: string;
  onClick?: () => void;
};

export const NavLink: React.FC<NavLinkProps> = ({ name, href, onClick }) => {
  // Determine if it should be a React Router link or regular anchor
  if (href.startsWith('/') && !href.includes('#')) {
    return (
      <Link
        to={href}
        className="text-foreground hover:text-[#cc0c1a] transition-colors duration-200 flex items-center"
        onClick={onClick}
      >
        {name === "Support" && <FileText className="h-4 w-4 mr-1" />}
        {name === "Downloads" && <Download className="h-4 w-4 mr-1" />}
        {name === "Admin" && <Settings className="h-4 w-4 mr-1" />}
        {name === "Profile" && <User className="h-4 w-4 mr-1" />}
        {name}
      </Link>
    );
  }
  
  return (
    <a
      href={href}
      className="text-foreground hover:text-[#cc0c1a] transition-colors duration-200"
      onClick={onClick}
    >
      {name}
    </a>
  );
};

export const getNavLinks = (user: any) => {
  // Base navigation links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Services", href: "/services" },
    { name: "Team", href: "/team" },
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" }
  ];

  // Add links based on user permissions
  if (user) {
    const uMeta = user.user_metadata || {};
    if (uMeta.approved) {
      navLinks.push(
        { name: "Support", href: "/support" },
        { name: "Downloads", href: "/downloads" },
        { name: "Profile", href: "/profile" }
      );
    }
    
    // Add admin link if user is admin
    if (uMeta.role === 'admin') {
      navLinks.push({ name: "Admin", href: "/admin" });
    }
  }

  return navLinks;
};
