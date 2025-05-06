
import { type Option } from "@/components/ui/multi-select";

// Product options for select
export const productOptions: Option[] = [
  { value: "SeekCap", label: "SeekCap" },
  { value: "DDX", label: "DDX" },
  { value: "ParaGuard", label: "ParaGuard" },
  { value: "SecondLook", label: "SecondLook" },
];

// Product features for multi-select
export const productFeatures: Option[] = [
  { value: "api_access", label: "API Access" },
  { value: "advanced_reporting", label: "Advanced Reporting" },
  { value: "data_export", label: "Data Export" },
  { value: "real_time_alerts", label: "Real-time Alerts" },
  { value: "custom_dashboards", label: "Custom Dashboards" },
];

// Product addons for multi-select
export const productAddons: Option[] = [
  { value: "premium_support", label: "Premium Support" },
  { value: "training", label: "Training Sessions" },
  { value: "custom_integration", label: "Custom Integration" },
  { value: "extended_storage", label: "Extended Storage" },
  { value: "ai_features", label: "AI Features" },
];
