/*
  # Add battery slot number

  1. Changes
    - Add slot_number column to batteries table
    - Update existing records with sequential slot numbers per group
    - Make slot_number required for future records
    - Add unique constraint for slot_number within each group

  2. Purpose
    - Ensure each battery has a fixed slot number within its group
    - Maintain consistent battery identification across device installations
*/

-- Add slot_number column
ALTER TABLE batteries
ADD COLUMN slot_number INTEGER;

-- Create a function to assign slot numbers
CREATE OR REPLACE FUNCTION assign_slot_numbers()
RETURNS void AS $$
DECLARE
  r RECORD;
  slot INTEGER;
BEGIN
  FOR r IN 
    SELECT DISTINCT group_id 
    FROM batteries 
    ORDER BY group_id
  LOOP
    slot := 1;
    UPDATE batteries
    SET slot_number = subquery.new_slot_number
    FROM (
      SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_slot_number
      FROM batteries
      WHERE group_id = r.group_id
    ) as subquery
    WHERE batteries.id = subquery.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT assign_slot_numbers();

-- Drop the function as it's no longer needed
DROP FUNCTION assign_slot_numbers();

-- Make slot_number required
ALTER TABLE batteries
ALTER COLUMN slot_number SET NOT NULL;

-- Add unique constraint for slot_number within each group
ALTER TABLE batteries
ADD CONSTRAINT unique_slot_number_per_group UNIQUE (group_id, slot_number);

-- Create a trigger to automatically assign the next slot number for new batteries
CREATE OR REPLACE FUNCTION assign_next_slot_number()
RETURNS TRIGGER AS $$
BEGIN
  SELECT COALESCE(MAX(slot_number), 0) + 1
  INTO NEW.slot_number
  FROM batteries
  WHERE group_id = NEW.group_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assign_slot_number_before_insert
BEFORE INSERT ON batteries
FOR EACH ROW
WHEN (NEW.slot_number IS NULL)
EXECUTE FUNCTION assign_next_slot_number();