-- Insert demo SKUs for each product with demo-specific parameters
INSERT INTO public.license_catalog (product_name, description, sku, product_type, license_model, demo_duration_days, demo_seats, demo_features, is_active, support_level, version, version_stage, base_price, price_tier)
VALUES
  -- SeekCap Demo
  ('SEEKCAP', 'SeekCap Network Discovery - 14-Day Evaluation License', 'THS-SEEK-DEMO-14', 'software', 'demo', 14, 2, ARRAY['basic_discovery', 'network_mapping'], true, 'standard', '1.0.0', 'stable', 0, 'free'),
  ('SEEKCAP', 'SeekCap Network Discovery - 30-Day Extended Trial', 'THS-SEEK-DEMO-30', 'software', 'demo', 30, 5, ARRAY['basic_discovery', 'network_mapping', 'asset_inventory'], true, 'standard', '1.0.0', 'stable', 0, 'free'),
  
  -- DDX Demo
  ('DDX', 'DDX Deep Packet Analysis - 14-Day Evaluation License', 'THS-DDX-DEMO-14', 'software', 'demo', 14, 2, ARRAY['basic_analysis', 'protocol_decode'], true, 'standard', '1.0.0', 'stable', 0, 'free'),
  ('DDX', 'DDX Deep Packet Analysis - 30-Day Extended Trial', 'THS-DDX-DEMO-30', 'software', 'demo', 30, 5, ARRAY['basic_analysis', 'protocol_decode', 'traffic_analysis'], true, 'standard', '1.0.0', 'stable', 0, 'free'),
  
  -- ParaGuard Demo
  ('PARAGUARD', 'ParaGuard Threat Detection - 14-Day Evaluation License', 'THS-PARA-DEMO-14', 'software', 'demo', 14, 2, ARRAY['threat_detection', 'basic_alerts'], true, 'standard', '1.0.0', 'stable', 0, 'free'),
  ('PARAGUARD', 'ParaGuard Threat Detection - 30-Day Extended Trial', 'THS-PARA-DEMO-30', 'software', 'demo', 30, 5, ARRAY['threat_detection', 'basic_alerts', 'incident_response'], true, 'standard', '1.0.0', 'stable', 0, 'free'),
  
  -- SecondLook Demo
  ('SECONDLOOK', 'SecondLook Memory Forensics - 14-Day Evaluation License', 'THS-SECLK-DEMO-14', 'software', 'demo', 14, 2, ARRAY['memory_analysis', 'basic_forensics'], true, 'standard', '1.0.0', 'stable', 0, 'free'),
  ('SECONDLOOK', 'SecondLook Memory Forensics - 30-Day Extended Trial', 'THS-SECLK-DEMO-30', 'software', 'demo', 30, 5, ARRAY['memory_analysis', 'basic_forensics', 'malware_detection'], true, 'standard', '1.0.0', 'stable', 0, 'free'),
  
  -- Lightfoot Demo
  ('LIGHTFOOT', 'Lightfoot Log Analysis - 14-Day Evaluation License', 'THS-LTFT-DEMO-14', 'software', 'demo', 14, 2, ARRAY['log_collection', 'basic_search'], true, 'standard', '1.0.0', 'stable', 0, 'free'),
  ('LIGHTFOOT', 'Lightfoot Log Analysis - 30-Day Extended Trial', 'THS-LTFT-DEMO-30', 'software', 'demo', 30, 5, ARRAY['log_collection', 'basic_search', 'correlation'], true, 'standard', '1.0.0', 'stable', 0, 'free'),
  
  -- O-Range Demo
  ('O-RANGE', 'O-Range OT Security - 14-Day Evaluation License', 'THS-ORNG-DEMO-14', 'software', 'demo', 14, 2, ARRAY['ot_monitoring', 'protocol_support'], true, 'standard', '1.0.0', 'stable', 0, 'free'),
  ('O-RANGE', 'O-Range OT Security - 30-Day Extended Trial', 'THS-ORNG-DEMO-30', 'software', 'demo', 30, 5, ARRAY['ot_monitoring', 'protocol_support', 'asset_discovery'], true, 'standard', '1.0.0', 'stable', 0, 'free'),
  
  -- Aurora Sense Demo
  ('AURORA SENSE', 'Aurora Sense SIEM - 14-Day Evaluation License', 'THS-AURA-DEMO-14', 'software', 'demo', 14, 2, ARRAY['event_collection', 'basic_correlation'], true, 'standard', '1.0.0', 'stable', 0, 'free'),
  ('AURORA SENSE', 'Aurora Sense SIEM - 30-Day Extended Trial', 'THS-AURA-DEMO-30', 'software', 'demo', 30, 5, ARRAY['event_collection', 'basic_correlation', 'dashboards'], true, 'standard', '1.0.0', 'stable', 0, 'free');