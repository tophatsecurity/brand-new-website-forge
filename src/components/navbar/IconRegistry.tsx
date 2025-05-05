
import { LucideIcon } from 'lucide-react';
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
  ActivitySquare
} from 'lucide-react';

// Map string names to actual imported icon components
const iconMap: Record<string, LucideIcon> = {
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
  'ActivitySquare': ActivitySquare
};

// Helper to convert icon string to Lucide icon component
export const getIconComponent = (iconName: string): LucideIcon => {
  return iconMap[iconName] || FileText;  // Default to FileText if icon not found
};

export default iconMap;
