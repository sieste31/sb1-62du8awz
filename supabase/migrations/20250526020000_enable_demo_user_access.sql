-- Enable read-only access for demo user across tables

-- Battery Groups RLS Policy
CREATE OR REPLACE POLICY "Demo user can read battery groups" 
ON battery_groups FOR SELECT 
USING (
  auth.uid() = '${DEMO_USER_ID}'::uuid OR 
  user_id = '${DEMO_USER_ID}'::uuid OR 
  user_id = auth.uid()
);

-- Devices RLS Policy
CREATE OR REPLACE POLICY "Demo user can read devices" 
ON devices FOR SELECT 
USING (
  auth.uid() = '${DEMO_USER_ID}'::uuid OR 
  user_id = '${DEMO_USER_ID}'::uuid OR 
  user_id = auth.uid()
);

-- Batteries RLS Policy
CREATE OR REPLACE POLICY "Demo user can read batteries" 
ON batteries FOR SELECT 
USING (
  auth.uid() = '${DEMO_USER_ID}'::uuid OR 
  user_id = '${DEMO_USER_ID}'::uuid OR 
  user_id = auth.uid()
);

-- Battery Usage History RLS Policy
CREATE OR REPLACE POLICY "Demo user can read battery usage history" 
ON battery_usage_history FOR SELECT 
USING (
  auth.uid() = '${DEMO_USER_ID}'::uuid OR 
  user_id = '${DEMO_USER_ID}'::uuid OR 
  user_id = auth.uid()
);

-- Device Usage History RLS Policy
CREATE OR REPLACE POLICY "Demo user can read device usage history" 
ON device_usage_history FOR SELECT 
USING (
  auth.uid() = '${DEMO_USER_ID}'::uuid OR 
  user_id = '${DEMO_USER_ID}'::uuid OR 
  user_id = auth.uid()
);
