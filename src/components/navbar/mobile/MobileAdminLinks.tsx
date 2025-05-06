
import React from 'react';
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  ActivitySquare, 
  Shield, 
  Key, 
  Download 
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface MobileAdminLinksProps {
  onClose: () => void;
}

const MobileAdminLinks: React.FC<MobileAdminLinksProps> = ({ onClose }) => {
  return (
    <>
      <Separator className="my-2" />
      <div className="pt-2 pb-1 font-semibold text-gray-500 dark:text-gray-400">
        Admin
      </div>
      <Link
        to="/admin"
        className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2 flex items-center"
        onClick={onClose}
      >
        <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
      </Link>
      <Link
        to="/admin/users"
        className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2 flex items-center"
        onClick={onClose}
      >
        <Users className="h-4 w-4 mr-2" /> Users
      </Link>
      <Link
        to="/admin/actions"
        className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2 flex items-center"
        onClick={onClose}
      >
        <ActivitySquare className="h-4 w-4 mr-2" /> Actions
      </Link>
      <Link
        to="/admin/permissions"
        className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2 flex items-center"
        onClick={onClose}
      >
        <Shield className="h-4 w-4 mr-2" /> Permissions
      </Link>
      <Link
        to="/admin/licensing"
        className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2 flex items-center"
        onClick={onClose}
      >
        <Key className="h-4 w-4 mr-2" /> Licensing
      </Link>
      <Link
        to="/admin/downloads"
        className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2 flex items-center"
        onClick={onClose}
      >
        <Download className="h-4 w-4 mr-2" /> Downloads
      </Link>
    </>
  );
};

export default MobileAdminLinks;
