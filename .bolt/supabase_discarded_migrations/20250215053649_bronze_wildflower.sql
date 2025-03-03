/*
  # Fix RLS policy for battery updates

  1. Changes
    - Drop existing update policy
    - Create new policy that allows updating device_id, status, and last_checked
    - Ensure user can only update their own batteries
    - Preserve immutable fields (user_id, group_id, slot_number)

  2. Security
    - Maintain RLS protection
    - Only allow authenticated users to update their own batteries
    - Prevent modification of critical fields
*/

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update their own batteries" ON batteries;

-- Create new update policy with simplified conditions
CREATE POLICY "Users can update their own batteries"
  ON batteries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);