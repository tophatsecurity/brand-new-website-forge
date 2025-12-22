
-- Insert example maintenance and support licenses for each software product
INSERT INTO product_licenses (license_key, product_name, tier_id, seats, expiry_date, status, features, addons) VALUES
-- SeekCap Maintenance & Support
('MAINT-SC-2024-001', 'SeekCap', '97a97123-ebbf-41d6-a9dd-c6eb1b85d4b1', 10, '2025-12-31', 'active', ARRAY['priority_support', 'software_updates', 'bug_fixes'], ARRAY['maintenance_renewal']),
('SUPP-SC-2024-001', 'SeekCap', '900b8403-c50e-45e5-8c3e-23ca664bf9bd', 25, '2025-06-30', 'active', ARRAY['24x7_support', 'dedicated_account_manager', 'sla_guarantee'], ARRAY['premium_support', 'emergency_response']),
-- DDX Maintenance & Support
('MAINT-DDX-2024-001', 'DDX', '97a97123-ebbf-41d6-a9dd-c6eb1b85d4b1', 15, '2025-03-15', 'active', ARRAY['priority_support', 'software_updates', 'bug_fixes'], ARRAY['maintenance_renewal']),
('SUPP-DDX-2024-001', 'DDX', '4fa51d36-ec1f-44e5-b0bf-e1b08aaf4a8d', 50, '2025-09-30', 'active', ARRAY['24x7_support', 'on_site_support', 'dedicated_account_manager', 'sla_guarantee'], ARRAY['premium_support', 'training', 'emergency_response']),
-- ParaGuard Maintenance & Support
('MAINT-PG-2024-001', 'ParaGuard', '900b8403-c50e-45e5-8c3e-23ca664bf9bd', 20, '2025-04-30', 'active', ARRAY['priority_support', 'software_updates', 'bug_fixes', 'real_time_alerts'], ARRAY['maintenance_renewal', 'support_upgrade']),
('SUPP-PG-2024-001', 'ParaGuard', '4fa51d36-ec1f-44e5-b0bf-e1b08aaf4a8d', 100, '2025-11-30', 'active', ARRAY['24x7_support', 'on_site_support', 'dedicated_account_manager', 'sla_guarantee'], ARRAY['premium_support', 'emergency_response']),
-- SecondLook Maintenance & Support
('MAINT-SL-2024-001', 'SecondLook', '97a97123-ebbf-41d6-a9dd-c6eb1b85d4b1', 5, '2025-02-28', 'active', ARRAY['priority_support', 'software_updates', 'bug_fixes'], ARRAY['maintenance_renewal']),
('SUPP-SL-2024-001', 'SecondLook', '900b8403-c50e-45e5-8c3e-23ca664bf9bd', 15, '2025-08-15', 'active', ARRAY['24x7_support', 'dedicated_account_manager'], ARRAY['premium_support', 'training']),
-- Lightfoot Maintenance & Support
('MAINT-LF-2024-001', 'Lightfoot', '97a97123-ebbf-41d6-a9dd-c6eb1b85d4b1', 8, '2025-05-31', 'active', ARRAY['priority_support', 'software_updates', 'bug_fixes'], ARRAY['maintenance_renewal']),
('SUPP-LF-2024-001', 'Lightfoot', '4fa51d36-ec1f-44e5-b0bf-e1b08aaf4a8d', 30, '2025-10-15', 'active', ARRAY['24x7_support', 'on_site_support', 'sla_guarantee'], ARRAY['premium_support', 'emergency_response']),
-- O-Range Maintenance & Support
('MAINT-OR-2024-001', 'O-Range', '900b8403-c50e-45e5-8c3e-23ca664bf9bd', 12, '2025-07-31', 'active', ARRAY['priority_support', 'software_updates', 'bug_fixes', 'api_access'], ARRAY['maintenance_renewal', 'support_upgrade']),
('SUPP-OR-2024-001', 'O-Range', '4fa51d36-ec1f-44e5-b0bf-e1b08aaf4a8d', 40, '2025-12-15', 'active', ARRAY['24x7_support', 'dedicated_account_manager', 'sla_guarantee'], ARRAY['premium_support', 'custom_integration']),
-- Aurora Sense Maintenance & Support
('MAINT-AS-2024-001', 'Aurora Sense', '97a97123-ebbf-41d6-a9dd-c6eb1b85d4b1', 6, '2025-01-31', 'active', ARRAY['priority_support', 'software_updates', 'bug_fixes'], ARRAY['maintenance_renewal']),
('SUPP-AS-2024-001', 'Aurora Sense', '4fa51d36-ec1f-44e5-b0bf-e1b08aaf4a8d', 25, '2025-06-15', 'active', ARRAY['24x7_support', 'on_site_support', 'dedicated_account_manager', 'sla_guarantee'], ARRAY['premium_support', 'training', 'emergency_response']);
