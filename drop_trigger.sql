-- Drop the trigger completely so we can isolate the problem!
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.fn_handle_new_user CASCADE;
