SQL



USER

username

UPDATE public.users
SET username = email || '_' || dob  || '_' || insurance_company_id;



dob

UPDATE public.users
SET dob = CASE email
    WHEN 'jdoe@example.com' THEN '1990-01-01'::date
    WHEN 'mjane@example.com' THEN '1985-06-15'::date
    WHEN 'user102@example.com' THEN '1997-08-16'::date
    WHEN 'user103@example.com' THEN '1974-08-16'::date
    WHEN 'user104@example.com' THEN '1997-08-16'::date
END
WHERE email IN ('jdoe@example.com', 'mjane@example.com', 'user102@example.com', 'user103@example.com', 'user104@example.com');
