/*
  # Add toy device type

  1. Changes
    - Update the device type check constraint to include 'toy' as a valid device type
*/

DO $$ BEGIN
  -- Update the device type check constraint
  ALTER TABLE devices
  DROP CONSTRAINT IF EXISTS devices_type_check;

  ALTER TABLE devices
  ADD CONSTRAINT devices_type_check
  CHECK (type IN ('smartphone', 'speaker', 'camera', 'gadget', 'light', 'toy'));
END $$;