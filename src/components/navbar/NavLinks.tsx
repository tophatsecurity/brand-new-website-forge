
import React from 'react';
import { Link } from "react-router-dom";

type NavLinkProps = {
  name: string;
  href: string;
  onClick?: () => void;
  className?: string;
};

export const NavLink: React.FC<NavLinkProps> = ({ name, href, onClick, className = '' }) => {
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

export const getNavLinks = () => {
  // Base navigation links
  return [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Services", href: "/services" },
    { name: "Team", href: "/team" },
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" }
  ];
};
