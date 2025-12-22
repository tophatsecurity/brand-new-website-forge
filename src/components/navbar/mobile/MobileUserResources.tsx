
import React from 'react';
import { Link } from "react-router-dom";
import { FileText, BookOpen, Download, Ticket, HeadphonesIcon } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface MobileUserResourcesProps {
  onClose: () => void;
}

const MobileUserResources: React.FC<MobileUserResourcesProps> = ({ onClose }) => {
  return (
    <>
      <Separator className="my-2" />
      <div className="pt-2 pb-1 font-semibold text-gray-500 dark:text-gray-400">
        Resources
      </div>
      <Link
        to="/licensing"
        className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2 flex items-center"
        onClick={onClose}
      >
        <FileText className="h-4 w-4 mr-2" /> Licensing
      </Link>
      <Link
        to="/support"
        className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2 flex items-center"
        onClick={onClose}
      >
        <BookOpen className="h-4 w-4 mr-2" /> Knowledge Base
      </Link>
      <Link
        to="/downloads"
        className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2 flex items-center"
        onClick={onClose}
      >
        <Download className="h-4 w-4 mr-2" /> Downloads
      </Link>

      <Separator className="my-2" />
      <div className="pt-2 pb-1 font-semibold text-gray-500 dark:text-gray-400">
        Customer
      </div>
      <Link
        to="/support/tickets"
        className="font-medium text-foreground dark:text-white hover:text-[#cc0c1a] dark:hover:text-[#cc0c1a] py-2 flex items-center"
        onClick={onClose}
      >
        <HeadphonesIcon className="h-4 w-4 mr-2" /> Support
      </Link>
    </>
  );
};

export default MobileUserResources;
