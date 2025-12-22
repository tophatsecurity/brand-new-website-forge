
import React from 'react';
import { 
  Users, 
  Settings, 
  Shield, 
  Download, 
  FileText, 
  BadgeHelp, 
  Wrench, 
  Database, 
  Key,
  LayoutDashboard,
  ActivitySquare,
  Coins,
  Ticket
} from 'lucide-react';

// Map string names to actual imported icon components
const iconMap: Record<string, React.ComponentType<any>> = {
  'Users': Users,
  'Settings': Settings,
  'Shield': Shield,
  'Download': Download,
  'FileText': FileText,
  'BadgeHelp': BadgeHelp,
  'Wrench': Wrench,
  'Database': Database,
  'Key': Key,
  'LayoutDashboard': LayoutDashboard,
  'ActivitySquare': ActivitySquare,
  'Coins': Coins,
  'Ticket': Ticket
};

// Helper to convert icon string to Lucide icon component
export const getIconComponent = (iconName: string): React.ComponentType<any> => {
  return iconMap[iconName] || FileText;  // Default to FileText if icon not found
};

export default iconMap;
