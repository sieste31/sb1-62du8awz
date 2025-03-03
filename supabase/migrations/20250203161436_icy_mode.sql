/*
  # Add foreign key constraints

  1. Changes
    - Add foreign key constraint between batteries and devices tables
    - Add index on device_id for better query performance

  2. Security
    - No changes to RLS policies required
*/

-- Add foreign key constraint for device_id in batteries table
ALTER TABLE batteries
ADD CONSTRAINT batteries_device_id_fkey
FOREIGN KEY (device_id)
REFERENCES devices(id)
ON DELETE SET NULL;

-- Add index for device_id to improve query performance
CREATE INDEX batteries_device_id_idx ON batteries(device_id);