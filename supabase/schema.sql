-- Church App — Supabase Schema
-- Run this in your Supabase SQL Editor

-- ANNOUNCEMENTS
create table announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text,
  date text,
  image_url text,
  images jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now()
);
alter table announcements enable row level security;
create policy "Public read" on announcements for select to anon using (true);
create policy "Public insert" on announcements for insert to anon with check (true);
create policy "Public update" on announcements for update to anon using (true);
create policy "Public delete" on announcements for delete to anon using (true);

-- EVENTS
create table events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  date text not null,
  start_time text,
  end_time text,
  location text,
  type text,
  note text,
  details jsonb,
  created_at timestamp with time zone default now()
);
alter table events enable row level security;
create policy "Public read" on events for select to anon using (true);
create policy "Public insert" on events for insert to anon with check (true);
create policy "Public update" on events for update to anon using (true);
create policy "Public delete" on events for delete to anon using (true);

-- SERMONS
create table sermons (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  speaker text,
  date text,
  description text,
  youtube_url text,
  pdf_url text,
  image_url text,
  created_at timestamp with time zone default now()
);
alter table sermons enable row level security;
create policy "Public read" on sermons for select to anon using (true);
create policy "Public insert" on sermons for insert to anon with check (true);

-- SERMON FILES
create table sermon_files (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  file_url text not null,
  file_type text,
  date text,
  created_at timestamp with time zone default now()
);
alter table sermon_files enable row level security;
create policy "Public read" on sermon_files for select to anon using (true);
create policy "Public insert" on sermon_files for insert to anon with check (true);

-- SIGN-UP SHEETS
create table signups (
  id uuid default gen_random_uuid() primary key,
  event_name text not null,
  event_description text,
  event_date text,
  event_image_url text,
  is_active boolean default true,
  type text default 'registration',
  created_at timestamp with time zone default now()
);
alter table signups enable row level security;
create policy "Public read" on signups for select to anon using (true);
create policy "Public insert" on signups for insert to anon with check (true);
create policy "Public delete" on signups for delete to anon using (true);

-- SIGN-UP RESPONSES
create table signup_responses (
  id uuid default gen_random_uuid() primary key,
  signup_id uuid references signups(id) on delete cascade,
  parent_first_name text,
  parent_last_name text,
  email text,
  phone text,
  emergency_contact_name text,
  emergency_contact_phone text,
  child_first_name text,
  child_last_name text,
  grade text,
  gender text,
  date_of_birth text,
  shirt_size text,
  allergies text,
  medical_concerns text,
  friend_requests text,
  signup_type text,
  comments text,
  question text,
  created_at timestamp with time zone default now()
);
alter table signup_responses enable row level security;
create policy "Public read" on signup_responses for select to anon using (true);
create policy "Public insert" on signup_responses for insert to anon with check (true);
create policy "Public delete" on signup_responses for delete to anon using (true);

-- Enable real-time for Q&A
alter publication supabase_realtime add table signup_responses;

-- PUSH TOKENS
create table push_tokens (
  id uuid default gen_random_uuid() primary key,
  token text not null unique,
  created_at timestamp with time zone default now()
);
alter table push_tokens enable row level security;
create policy "Public read" on push_tokens for select to anon using (true);
create policy "Public insert" on push_tokens for insert to anon with check (true);

-- NOTIFICATIONS SENT
create table notifications_sent (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text not null,
  devices_count integer,
  created_at timestamp with time zone default now()
);
alter table notifications_sent enable row level security;
create policy "Public read" on notifications_sent for select to anon using (true);
create policy "Public insert" on notifications_sent for insert to anon with check (true);
create policy "Public delete" on notifications_sent for delete to anon using (true);

-- PHOTO ALBUMS
create table photo_albums (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  cover_url text,
  date text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);
alter table photo_albums enable row level security;
create policy "Public read" on photo_albums for select to anon using (true);
create policy "Public insert" on photo_albums for insert to anon with check (true);
create policy "Public update" on photo_albums for update to anon using (true);
create policy "Public delete" on photo_albums for delete to anon using (true);

-- PHOTOS
create table photos (
  id uuid default gen_random_uuid() primary key,
  album_id uuid references photo_albums(id) on delete cascade,
  url text not null,
  caption text,
  created_at timestamp with time zone default now()
);
alter table photos enable row level security;
create policy "Public read" on photos for select to anon using (true);
create policy "Public insert" on photos for insert to anon with check (true);
create policy "Public delete" on photos for delete to anon using (true);

-- PRAYER REQUESTS
create table prayer_requests (
  id uuid default gen_random_uuid() primary key,
  name text default 'Anonymous',
  prayer text not null,
  created_at timestamp with time zone default now()
);
alter table prayer_requests enable row level security;
create policy "Public insert" on prayer_requests for insert to anon with check (true);
create policy "Public read" on prayer_requests for select to anon using (true);

-- STORAGE BUCKETS (create these in Supabase Storage UI)
-- assets (public) — logos, announcement images, notification images
-- photos (public) — church photo albums
-- sermons (public) — sermon PDFs and files

-- Storage policies (run after creating buckets)
create policy "Public read assets" on storage.objects for select to anon using (bucket_id = 'assets');
create policy "Public upload assets" on storage.objects for insert to anon with check (bucket_id = 'assets');
create policy "Public read photos" on storage.objects for select to anon using (bucket_id = 'photos');
create policy "Public upload photos" on storage.objects for insert to anon with check (bucket_id = 'photos');
create policy "Public read sermons" on storage.objects for select to anon using (bucket_id = 'sermons');
create policy "Public upload sermons" on storage.objects for insert to anon with check (bucket_id = 'sermons');
