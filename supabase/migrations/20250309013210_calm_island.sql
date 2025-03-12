/*
  # Add has_batteries column to devices table

  1. Changes
    - Add `has_batteries` boolean column to devices table
    - Add trigger to automatically update has_batteries when batteries are changed
    - Update existing devices' has_batteries values

  2. Details
    - The has_batteries column indicates if all required batteries are installed
    - True when installed_count equals battery_count
    - False when any batteries are missing
    - Automatically updated by trigger on batteries table changes
*/

-- Add has_batteries column
ALTER TABLE devices 
ADD COLUMN has_batteries boolean NOT NULL DEFAULT false;

-- Create function to count installed batteries and update has_batteries
CREATE OR REPLACE FUNCTION update_device_has_batteries()
RETURNS TRIGGER AS $$
BEGIN
  -- Update has_batteries for the affected device
  WITH battery_counts AS (
    SELECT 
      d.id as device_id,
      d.battery_count as required_count,
      COUNT(b.id) as installed_count
    FROM devices d
    LEFT JOIN batteries b ON b.device_id = d.id
    WHERE d.id = COALESCE(
      NEW.device_id,
      OLD.device_id,
      NEW.id,
      OLD.id
    )
    GROUP BY d.id, d.battery_count
  )
  UPDATE devices d
  SET has_batteries = (bc.installed_count = bc.required_count)
  FROM battery_counts bc
  WHERE d.id = bc.device_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update has_batteries
CREATE TRIGGER update_device_has_batteries_on_battery_change
AFTER INSERT OR UPDATE OR DELETE ON batteries
FOR EACH ROW
EXECUTE FUNCTION update_device_has_batteries();

CREATE TRIGGER update_device_has_batteries_on_device_change
AFTER UPDATE OF battery_count ON devices
FOR EACH ROW
WHEN (NEW.battery_count IS DISTINCT FROM OLD.battery_count)
EXECUTE FUNCTION update_device_has_batteries();

-- Update existing devices
WITH battery_counts AS (
  SELECT 
    d.id as device_id,
    d.battery_count as required_count,
    COUNT(b.id) as installed_count
  FROM devices d
  LEFT JOIN batteries b ON b.device_id = d.id
  GROUP BY d.id, d.battery_count
)
UPDATE devices d
SET has_batteries = (bc.installed_count = bc.required_count)
FROM battery_counts bc
WHERE d.id = bc.device_id;