/*
  # Add battery life duration to devices

  1. Changes
    - Add `battery_life_weeks` column to `devices` table
      - Integer column to store battery life duration in weeks
      - Nullable, as not all devices may have this setting
      - Must be positive when set
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devices' AND column_name = 'battery_life_weeks'
  ) THEN
    ALTER TABLE devices ADD COLUMN battery_life_weeks integer;
    ALTER TABLE devices ADD CONSTRAINT battery_life_weeks_positive CHECK (battery_life_weeks IS NULL OR battery_life_weeks > 0);
  END IF;
END $$;