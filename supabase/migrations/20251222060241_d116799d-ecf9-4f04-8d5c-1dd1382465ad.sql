-- Add Evaluation tier
INSERT INTO license_tiers (name, description, max_seats)
VALUES ('Evaluation', 'Time-limited evaluation license for trial purposes', 5);

-- Add Starter tier (maps to evaluation price_tier)
INSERT INTO license_tiers (name, description, max_seats)
VALUES ('Starter', 'Entry-level tier with core features', 3);

-- Add Elite tier (maps to enterprise price_tier)
INSERT INTO license_tiers (name, description, max_seats)
VALUES ('Elite', 'Premium tier with all features for enterprises', 100);

-- Add Premium tier (maps to professional price_tier)
INSERT INTO license_tiers (name, description, max_seats)
VALUES ('Premium', 'Advanced features for growing teams', 25);