-- Add file storage columns to invoices table
ALTER TABLE invoices 
ADD COLUMN invoice_number TEXT,
ADD COLUMN file_url TEXT,
ADD COLUMN file_name TEXT;