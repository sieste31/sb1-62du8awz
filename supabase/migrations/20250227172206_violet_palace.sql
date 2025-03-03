/*
  # Update device type constraints

  1. Changes
    - Update the device type check constraint to include 'gadget' and 'light' types
    - This allows for more device categories in the application
  2. Security
    - Maintains existing row level security policies
*/

-- Update the device type check constraint
ALTER TABLE devices
DROP CONSTRAINT IF EXISTS devices_type_check;

ALTER TABLE devices
ADD CONSTRAINT devices_type_check
CHECK (type IN ('smartphone', 'speaker', 'camera', 'gadget', 'light'));