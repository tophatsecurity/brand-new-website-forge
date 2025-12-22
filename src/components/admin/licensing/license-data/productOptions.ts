
import { type Option } from "@/components/ui/multi-select";

// Product options for select
export const productOptions: Option[] = [
  { value: "SeekCap", label: "SeekCap" },
  { value: "DDX", label: "DDX" },
  { value: "ParaGuard", label: "ParaGuard" },
  { value: "SecondLook", label: "SecondLook" },
  { value: "Lightfoot", label: "Lightfoot" },
  { value: "O-Range", label: "O-Range" },
  { value: "Aurora Sense", label: "Aurora Sense" },
];

// License type options
export const licenseTypeOptions: Option[] = [
  { value: "software", label: "Software License" },
  { value: "maintenance", label: "Maintenance Agreement" },
  { value: "support", label: "Support Contract" },
  { value: "bundle", label: "Product Bundle" },
];

// Product features for multi-select
export const productFeatures: Option[] = [
  { value: "api_access", label: "API Access" },
  { value: "advanced_reporting", label: "Advanced Reporting" },
  { value: "data_export", label: "Data Export" },
  { value: "real_time_alerts", label: "Real-time Alerts" },
  { value: "custom_dashboards", label: "Custom Dashboards" },
  { value: "priority_support", label: "Priority Support" },
  { value: "dedicated_account_manager", label: "Dedicated Account Manager" },
  { value: "sla_guarantee", label: "SLA Guarantee" },
  { value: "24x7_support", label: "24/7 Support" },
  { value: "on_site_support", label: "On-Site Support" },
];

// Product addons for multi-select
export const productAddons: Option[] = [
  { value: "premium_support", label: "Premium Support" },
  { value: "training", label: "Training Sessions" },
  { value: "custom_integration", label: "Custom Integration" },
  { value: "extended_storage", label: "Extended Storage" },
  { value: "ai_features", label: "AI Features" },
  { value: "maintenance_renewal", label: "Maintenance Renewal" },
  { value: "support_upgrade", label: "Support Upgrade" },
  { value: "emergency_response", label: "Emergency Response" },
];
