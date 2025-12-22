import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import MobileMenuContent from './mobile/MobileMenuContent';
import ThemeToggle from '@/components/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileNavProps {
  user: any;
  signOut: () => Promise<void>;
  isAdmin?: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ 
  user, 
  signOut, 
  isAdmin = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleClose = () => setIsOpen(false);

  // Check if user is approved
  const isApproved = user?.user_metadata?.approved;
  
  return (
    <div className="md:hidden flex items-center space-x-2">
      {user && isApproved && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/licensing')}
          className="gap-1 text-xs px-2"
        >
          <LayoutDashboard className="h-3 w-3" />
          Portal
        </Button>
      )}
      <ThemeToggle />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Navigation Menu */}
      <div className={cn(
        "md:hidden fixed left-0 right-0 bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out overflow-hidden z-50",
        isMobile ? "top-[84px]" : "top-[76px]",
        isOpen ? "max-h-screen py-4" : "max-h-0"
      )}>
        {isOpen && (
          <MobileMenuContent
            user={user}
            signOut={signOut}
            isAdmin={isAdmin}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default MobileNav;
