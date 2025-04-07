
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Services", href: "/services" },
    { name: "Products", href: "/products" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 py-4 px-6 md:px-12 lg:px-24",
      scrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/82d57873-f9d6-47b1-b1d4-cec2b173bb92.png" 
              alt="TopHat Security Logo" 
              className="h-14 md:h-16 mr-3"
            />
            <div>
              <span className="block text-2xl font-bold text-[#222]">TOPHAT</span>
              <span className="block text-lg font-bold text-[#cc0c1a]">SECURITY</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            link.href.startsWith('/') && !link.href.includes('#') ? (
              <Link 
                key={link.name} 
                to={link.href} 
                className="text-foreground hover:text-[#cc0c1a] transition-colors duration-200"
              >
                {link.name}
              </Link>
            ) : (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-foreground hover:text-[#cc0c1a] transition-colors duration-200"
              >
                {link.name}
              </a>
            )
          ))}
          <Button variant="default" className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
            Free Consultation
          </Button>
        </div>

        {/* Mobile Navigation Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={cn(
        "md:hidden absolute left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "max-h-96 py-4" : "max-h-0"
      )}>
        <div className="flex flex-col space-y-4 px-6">
          {navLinks.map((link) => (
            link.href.startsWith('/') && !link.href.includes('#') ? (
              <Link 
                key={link.name} 
                to={link.href} 
                className="text-foreground hover:text-[#cc0c1a] py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ) : (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-foreground hover:text-[#cc0c1a] py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            )
          ))}
          <Button variant="default" className="bg-[#cc0c1a] hover:bg-[#a80916] text-white w-full">
            Free Consultation
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
