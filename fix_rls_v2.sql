-- Fix Infinite Recursion completely
-- First, drop ALL existing policies on profiles
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can select all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.profiles;

-- The simplest, safest policy that CANNOT cause infinite recursion:
CREATE POLICY "Users can read own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- For admins, we will use RPC functions instead of RLS to read all users to prevent recursion entirely.

-- Fix the trigger to allow Dashboard user creation (providing safe defaults if metadata is missing)
CREATE OR REPLACE FUNCTION public.fn_handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_student_id BIGINT;
BEGIN
  INSERT INTO public.students (email, name, branch, year)
  VALUES (
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student ' || split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'branch', 'Computer Science'),
    COALESCE((NEW.raw_user_meta_data->>'year')::INT, 1)
  )
  RETURNING id INTO new_student_id;

  INSERT INTO public.profiles (id, role, student_id)
  VALUES (NEW.id, 'student', new_student_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
