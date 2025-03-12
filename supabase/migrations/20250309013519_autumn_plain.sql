/*
  # Add has_batteries column to devices table

  1. Changes
    - Add `has_batteries` boolean column to devices table with default false
    - Create trigger function to update has_batteries automatically
    - Create trigger to update has_batteries when batteries are added/removed
    - Create trigger to update has_batteries when device battery_count changes

  2. Notes
    - has_batteries is true when device has all required batteries installed
    - Automatically maintained by triggers
*/

-- First update existing devices to have a default value
UPDATE devices
SET has_batteries = false;

-- Then add the column with NOT NULL constraint
ALTER TABLE devices ADD COLUMN IF NOT EXISTS has_batteries boolean NOT NULL DEFAULT false;

-- Create trigger function
CREATE OR REPLACE FUNCTION update_device_has_batteries()
RETURNS TRIGGER AS $$
DECLARE
  device_id uuid;
  required_count integer;
  installed_count integer;
BEGIN
  -- Determine which device ID to update
  device_id := COALESCE(
    NEW.device_id,
    OLD.device_id,
    NEW.id,
    OLD.id
  );

  -- Skip if no device ID (can happen during DELETE)
  IF device_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Get the required battery count for the device
  SELECT battery_count INTO required_count
  FROM devices
  WHERE id = device_id;

  -- Count installed batteries
  SELECT COUNT(*) INTO installed_count
  FROM batteries
  WHERE device_id = device_id;

  -- Update the device's has_batteries status
  UPDATE devices
  SET has_batteries = (required_count = installed_count)
  WHERE id = device_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for battery changes
DROP TRIGGER IF EXISTS update_device_has_batteries_on_battery_change ON batteries;
CREATE TRIGGER update_device_has_batteries_on_battery_change
AFTER INSERT OR UPDATE OF device_id OR DELETE ON batteries
FOR EACH ROW
EXECUTE FUNCTION update_device_has_batteries();

-- Create trigger for device changes
DROP TRIGGER IF EXISTS update_device_has_batteries_on_device_change ON devices;
CREATE TRIGGER update_device_has_batteries_on_device_change
AFTER UPDATE OF battery_count ON devices
FOR EACH ROW
WHEN (NEW.battery_count IS DISTINCT FROM OLD.battery_count)
EXECUTE FUNCTION update_device_has_batteries();

-- Initialize has_batteries for all devices
DO $$
DECLARE
  d RECORD;
BEGIN
  FOR d IN SELECT id, battery_count FROM devices LOOP
    UPDATE devices
    SET has_batteries = (
      SELECT COUNT(*) = d.battery_count
      FROM batteries
      WHERE device_id = d.id
    )
    WHERE id = d.id;
  END LOOP;
END $$;