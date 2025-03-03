/*
  # Fix RLS policy for batteries table

  1. Changes
    - Update RLS policy for batteries table to allow updating device_id and status
    - Add more specific policies for different update scenarios

  2. Security
    - Ensure users can only update their own batteries
    - Allow updating device_id and status while maintaining user_id restriction
*/

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update their own batteries device and status" ON batteries;

-- Create new, more specific update policies
CREATE POLICY "Users can update their own batteries device and status"
  ON batteries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    (
      -- Allow updating device_id, status, and last_checked while preserving other fields
      NEW.user_id = OLD.user_id AND
      NEW.group_id = OLD.group_id AND
      NEW.slot_number = OLD.slot_number
    )
  );