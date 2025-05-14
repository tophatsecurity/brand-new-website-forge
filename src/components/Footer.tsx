import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X, Linkedin } from "lucide-react";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thanks for subscribing!",
      description: "You've been added to our newsletter list.",
    });
    setEmail("");
  };

  return (
    <footer className="bg-[#1c1e21] text-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto pt-20 pb-12 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="col-span-1 lg:col-span-1">
            <img 
              src="/lovable-uploads/82d57873-f9d6-47b1-b1d4-cec2b173bb92.png" 
              alt="TopHat Security Logo" 
              className="h-14 mb-4"
            />
            <div className="mb-3">
              <span className="text-2xl font-bold">
                <span className="text-white">TOPHAT</span>
                <span className="text-[#cc0c1a]">|SECURITY</span>
              </span>
            </div>
            <p className="text-white/80 mb-6">
              Protecting businesses from emerging cyber threats with cutting-edge security solutions.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/tophatsecurity1" target="_blank" rel="noopener noreferrer" className="hover:text-[#cc0c1a] transition-colors" aria-label="X (formerly Twitter)">
                <X size={24} />
              </a>
              <a href="https://www.linkedin.com/company/tophatsecurity/" target="_blank" rel="noopener noreferrer" className="hover:text-[#cc0c1a] transition-colors" aria-label="LinkedIn">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="/#about" className="text-white/80 hover:text-[#cc0c1a] transition-colors">About Us</a></li>
              <li><a href="/#services" className="text-white/80 hover:text-[#cc0c1a] transition-colors">Services</a></li>
              <li><a href="/products" className="text-white/80 hover:text-[#cc0c1a] transition-colors">Products</a></li>
              <li><a href="/careers" className="text-white/80 hover:text-[#cc0c1a] transition-colors">Careers</a></li>
              <li><a href="/contact" className="text-white/80 hover:text-[#cc0c1a] transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="text-white/80">
                <a href="mailto:info@tophatsecurity.com" className="text-white/80 hover:text-[#cc0c1a] transition-colors">info@tophatsecurity.com</a>
              </li>
              <li className="text-white/80">
                <a href="mailto:sales@tophatsecurity.com" className="text-white/80 hover:text-[#cc0c1a] transition-colors">sales@tophatsecurity.com</a>
              </li>
              <li className="text-white/80">
                <a href="tel:18009895718" className="text-white/80 hover:text-[#cc0c1a] transition-colors">1-800-989-5718</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-6">Subscribe</h4>
            <p className="text-white/80 mb-4">
              Get the latest news and updates from our team.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-accent dark:bg-gray-800/50 dark:border-gray-700"
              />
              <Button type="submit" className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} TOPHAT|SECURITY. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy-policy" className="text-white/70 hover:text-[#cc0c1a] transition-colors">Privacy Policy</Link>
            <a href="#" className="text-white/70 hover:text-[#cc0c1a] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
