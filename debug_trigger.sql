-- Create a debug table to catch errors
CREATE TABLE IF NOT EXISTS public.trigger_errors (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  error_message TEXT,
  error_detail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate trigger with full error catching
CREATE OR REPLACE FUNCTION public.fn_handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_student_id BIGINT;
BEGIN
  BEGIN
    INSERT INTO public.students (email, name, branch, year)
    VALUES (
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student ' || split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'branch', 'Computer Science'),
      COALESCE((NEW.raw_user_meta_data->>'year')::INT, 1)
    )
    ON CONFLICT (email) DO UPDATE 
    SET 
      name = EXCLUDED.name,
      branch = EXCLUDED.branch,
      year = EXCLUDED.year
    RETURNING id INTO new_student_id;

    INSERT INTO public.profiles (id, role, student_id)
    VALUES (NEW.id, 'student', new_student_id);
    
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.trigger_errors (error_message, error_detail) 
    VALUES (SQLERRM, SQLSTATE);
    RAISE WARNING 'Trigger error: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
