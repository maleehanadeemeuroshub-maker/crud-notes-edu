-- Fires the "welcome-email" Edge Function (via pg_net) whenever a new user signs up.
-- pg_net is enabled by default on Supabase projects.

create extension if not exists pg_net;

create or replace function public.send_welcome_email()
returns trigger as $$
begin
  perform net.http_post(
    url := 'https://hzxicrjmnnkzhoayscqy.supabase.co/functions/v1/welcome-email',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object('record', jsonb_build_object(
      'id', new.id,
      'email', new.email,
      'raw_user_meta_data', new.raw_user_meta_data
    ))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_send_welcome_email on auth.users;
create trigger on_auth_user_created_send_welcome_email
  after insert on auth.users
  for each row
  execute function public.send_welcome_email();
