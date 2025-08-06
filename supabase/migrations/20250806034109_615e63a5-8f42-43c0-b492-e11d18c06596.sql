-- Create the admin user using Supabase's proper signup method
-- The handle_new_user trigger will automatically create the profile

-- Enable the trigger for handling new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();