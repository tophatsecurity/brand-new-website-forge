
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
    <footer className="bg-[#1c1e21] text-white">
      <div className="max-w-7xl mx-auto pt-20 pb-12 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="col-span-1 lg:col-span-1">
            <img 
              src="/lovable-uploads/82d57873-f9d6-47b1-b1d4-cec2b173bb92.png" 
              alt="TopHat Security Logo" 
              className="h-14 mb-4"
            />
            <div className="mb-3">
              <span className="block text-2xl font-bold text-white">TOPHAT</span>
              <span className="block text-lg font-bold text-[#cc0c1a]">SECURITY</span>
            </div>
            <p className="text-white/80 mb-6">
              Protecting businesses from emerging cyber threats with cutting-edge security solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#cc0c1a] transition-colors" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="hover:text-[#cc0c1a] transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" className="hover:text-[#cc0c1a] transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
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
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-accent"
              />
              <Button type="submit" className="bg-[#cc0c1a] hover:bg-[#a80916] text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Tophat Security. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-white/70 hover:text-[#cc0c1a] transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/70 hover:text-[#cc0c1a] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
