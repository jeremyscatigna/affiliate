-- Create storage bucket for invoices
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'invoices', 
  'invoices', 
  true, -- Public bucket pour simplifier l'accès
  10485760, -- 10MB max file size
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
);

-- Create RLS policies for invoices bucket
CREATE POLICY "Allow authenticated users to upload invoices" ON storage.objects
  FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'invoices');

CREATE POLICY "Allow public to view invoices" ON storage.objects
  FOR SELECT 
  TO public 
  USING (bucket_id = 'invoices');

CREATE POLICY "Allow authenticated users to delete invoices" ON storage.objects
  FOR DELETE 
  TO authenticated 
  USING (bucket_id = 'invoices');