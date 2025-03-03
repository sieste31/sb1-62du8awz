/*
  # Create storage bucket for battery images

  1. New Storage Bucket
    - Create a new storage bucket called 'battery-images'
    - Enable RLS
    - Add policies for authenticated users to manage their own images

  2. Security
    - Enable RLS on the bucket
    - Add policies for authenticated users to:
      - Read any image
      - Upload/update their own images
      - Delete their own images
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name)
VALUES ('battery-images', 'battery-images')
ON CONFLICT DO NOTHING;

-- Enable RLS
UPDATE storage.buckets
SET public = false
WHERE id = 'battery-images';

-- Allow authenticated users to read any image
CREATE POLICY "Anyone can read battery images"
ON storage.objects FOR SELECT
USING (bucket_id = 'battery-images');

-- Allow authenticated users to upload and update their own images
CREATE POLICY "Users can upload battery images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'battery-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own battery images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'battery-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'battery-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own battery images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'battery-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);