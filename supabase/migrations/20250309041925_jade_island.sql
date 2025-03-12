/*
  # Setup Storage Buckets and Policies

  1. Storage Buckets
    - Create battery-images bucket
    - Create device-images bucket
  
  2. Security Policies
    - Drop existing policies
    - Create new policies for authenticated users
*/

-- Create battery-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('battery-images', 'battery-images')
ON CONFLICT (id) DO NOTHING;

-- Create device-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('device-images', 'device-images')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on both buckets
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can upload battery images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their battery images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their battery images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can view battery images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload device images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their device images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their device images" ON storage.objects;
    DROP POLICY IF EXISTS "Users can view device images" ON storage.objects;
END $$;

-- Policy for battery images
CREATE POLICY "Users can upload battery images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'battery-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their battery images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'battery-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their battery images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'battery-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view battery images"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'battery-images'
);

-- Policy for device images
CREATE POLICY "Users can upload device images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'device-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their device images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'device-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their device images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'device-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view device images"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'device-images'
);