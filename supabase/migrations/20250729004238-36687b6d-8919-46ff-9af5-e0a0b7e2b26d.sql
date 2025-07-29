-- Create admin user in profiles table
INSERT INTO public.profiles (id, email, full_name, role) 
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid, 
  'admin@converttemp.com', 
  'Admin User', 
  'admin'
)
ON CONFLICT (email) DO UPDATE SET role = 'admin';