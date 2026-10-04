CREATE OR REPLACE FUNCTION public.fn_handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_student_id BIGINT;
  _name TEXT;
BEGIN
  _name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student ' || split_part(NEW.email, '@', 1));

  INSERT INTO public.students (email, name, branch, year)
  VALUES (
    NEW.email,
    _name,
    COALESCE(NEW.raw_user_meta_data->>'branch', 'Computer Science'),
    COALESCE((NEW.raw_user_meta_data->>'year')::INT, 1)
  )
  ON CONFLICT (email) DO UPDATE 
  SET 
    name = EXCLUDED.name,
    branch = EXCLUDED.branch,
    year = EXCLUDED.year
  RETURNING id INTO new_student_id;

  INSERT INTO public.profiles (id, role, student_id, name)
  VALUES (NEW.id, 'student', new_student_id, _name);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
