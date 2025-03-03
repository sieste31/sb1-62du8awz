/*
  # Add name field to battery groups

  1. Changes
    - Add `name` column to `battery_groups` table
    - Set default name based on type for existing records
    - Make name required for future records

  2. Notes
    - Existing records will get a default name based on their type
    - New records will require a name
*/

-- Add name column with a temporary NULL constraint
ALTER TABLE battery_groups
ADD COLUMN name TEXT;

-- Update existing records with a default name based on type
UPDATE battery_groups
SET name = type || ' 電池グループ';

-- Make name required for future records
ALTER TABLE battery_groups
ALTER COLUMN name SET NOT NULL;