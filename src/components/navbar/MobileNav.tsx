
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import MobileMenuContent from './mobile/MobileMenuContent';

interface MobileNavProps {
  user: any;
  signOut: () => Promise<void>;
  isAdmin?: boolean;
  selectedRole?: string | null;
  onRoleChange?: (role: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ 
  user, 
  signOut, 
  isAdmin = false, 
  selectedRole = null, 
  onRoleChange = () => {} 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <div className="md:hidden">
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
        "md:hidden absolute left-0 right-0 bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out overflow-hidden z-50",
        isOpen ? "max-h-screen py-4" : "max-h-0"
      )}>
        {isOpen && (
          <MobileMenuContent
            user={user}
            signOut={signOut}
            isAdmin={isAdmin}
            selectedRole={selectedRole}
            onRoleChange={onRoleChange}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default MobileNav;
