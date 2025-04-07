
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Shield, Lock } from "lucide-react";

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
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 py-4 px-6 md:px-12 lg:px-24",
      scrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <a href="#" className="flex items-center">
            <img 
              src="/public/lovable-uploads/3d8e6f15-58c0-462a-854f-0f4cacfa0fb5.png" 
              alt="TopHat Security Logo" 
              className="h-10 md:h-12 mr-3"
            />
            <div>
              <span className="block text-2xl font-bold text-[#222]">TOPHAT</span>
              <span className="block text-lg font-bold text-[#cc0c1a]">SECURITY</span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-foreground hover:text-[#cc0c1a] transition-colors duration-200"
            >
              {link.name}
            </a>
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
            <a 
              key={link.name} 
              href={link.href} 
              className="text-foreground hover:text-[#cc0c1a] py-2"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
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
