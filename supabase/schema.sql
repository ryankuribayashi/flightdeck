-- ============================================================
-- FLIGHTDECK — Supabase Schema
-- Run this in your Supabase SQL editor to set up the database
-- ============================================================

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  callsign text unique not null,
  display_name text,
  home_airport text,
  avatar_url text,
  rank text default 'CADET',
  spotted_count integer default 0,
  airports_count integer default 0,
  nm_logged integer default 0,
  airlines_count integer default 0,
  created_at timestamptz default now()
);

-- POSTS
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  image_url text not null,
  caption text,
  aircraft_type text,
  icao_type text,
  airline text,
  flight_number text,
  origin_airport text,
  destination_airport text,
  altitude text,
  speed text,
  airport text,
  is_live boolean default false,
  is_instant boolean default false,
  likes_count integer default 0,
  created_at timestamptz default now()
);

-- STORIES
create table public.stories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  media_url text not null,
  airport text,
  is_live boolean default false,
  expires_at timestamptz default (now() + interval '24 hours'),
  created_at timestamptz default now()
);

-- SQUADRONS
create table public.squadrons (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  tail_code text unique not null,
  color text default '#F0A020',
  created_by uuid references public.profiles on delete cascade not null,
  member_count integer default 1,
  created_at timestamptz default now()
);

-- SQUADRON MEMBERS
create table public.squadron_members (
  squadron_id uuid references public.squadrons on delete cascade,
  user_id uuid references public.profiles on delete cascade,
  role text default 'member',
  joined_at timestamptz default now(),
  primary key (squadron_id, user_id)
);

-- MESSAGES (squadron real-time chat)
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  squadron_id uuid references public.squadrons on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- TAIL WATCHLIST
create table public.tail_watchlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  registration text not null,
  aircraft_type text,
  airline text,
  created_at timestamptz default now()
);

-- FLIGHT LOG
create table public.flight_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  origin text not null,
  destination text not null,
  airline text,
  flight_number text,
  aircraft_type text,
  seat_class text,
  flight_date date,
  created_at timestamptz default now()
);

-- LIKES
create table public.likes (
  post_id uuid references public.posts on delete cascade,
  user_id uuid references public.profiles on delete cascade,
  primary key (post_id, user_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.stories enable row level security;
alter table public.squadrons enable row level security;
alter table public.squadron_members enable row level security;
alter table public.messages enable row level security;
alter table public.tail_watchlist enable row level security;
alter table public.flight_log enable row level security;
alter table public.likes enable row level security;

-- Profiles
create policy "Public profiles viewable" on public.profiles for select using (true);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

-- Posts
create policy "Posts viewable by all" on public.posts for select using (true);
create policy "Authenticated users create posts" on public.posts for insert with check (auth.uid() = user_id);
create policy "Users update own posts" on public.posts for update using (auth.uid() = user_id);
create policy "Users delete own posts" on public.posts for delete using (auth.uid() = user_id);

-- Stories
create policy "Stories viewable by all" on public.stories for select using (true);
create policy "Authenticated users create stories" on public.stories for insert with check (auth.uid() = user_id);
create policy "Users delete own stories" on public.stories for delete using (auth.uid() = user_id);

-- Squadrons
create policy "Squadrons viewable by all" on public.squadrons for select using (true);
create policy "Authenticated users create squadrons" on public.squadrons for insert with check (auth.uid() = created_by);
create policy "Creator can update squadron" on public.squadrons for update using (auth.uid() = created_by);

-- Squadron members
create policy "Members viewable by all" on public.squadron_members for select using (true);
create policy "Users can join squadrons" on public.squadron_members for insert with check (auth.uid() = user_id);
create policy "Users can leave squadrons" on public.squadron_members for delete using (auth.uid() = user_id);

-- Messages
create policy "Messages viewable by members" on public.messages for select using (
  exists (select 1 from public.squadron_members sm where sm.squadron_id = messages.squadron_id and sm.user_id = auth.uid())
);
create policy "Members can send messages" on public.messages for insert with check (
  auth.uid() = user_id and
  exists (select 1 from public.squadron_members sm where sm.squadron_id = messages.squadron_id and sm.user_id = auth.uid())
);

-- Tail watchlist
create policy "Users view own watchlist" on public.tail_watchlist for select using (auth.uid() = user_id);
create policy "Users manage own watchlist" on public.tail_watchlist for insert with check (auth.uid() = user_id);
create policy "Users delete from watchlist" on public.tail_watchlist for delete using (auth.uid() = user_id);

-- Flight log
create policy "Users view own flight log" on public.flight_log for select using (auth.uid() = user_id);
create policy "Users add to flight log" on public.flight_log for insert with check (auth.uid() = user_id);
create policy "Users delete from flight log" on public.flight_log for delete using (auth.uid() = user_id);

-- Likes
create policy "Likes viewable by all" on public.likes for select using (true);
create policy "Authenticated users can like" on public.likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike" on public.likes for delete using (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

insert into storage.buckets (id, name, public) values ('posts', 'posts', true);
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('stories', 'stories', true);

create policy "Public post images" on storage.objects for select using (bucket_id = 'posts');
create policy "Authenticated users upload posts" on storage.objects for insert with check (bucket_id = 'posts' and auth.role() = 'authenticated');

create policy "Public avatars" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users upload own avatar" on storage.objects for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');
create policy "Users update own avatar" on storage.objects for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- REALTIME
-- ============================================================

alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.stories;

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, callsign, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'callsign', 'PILOT-' || substr(new.id::text, 1, 6)),
    coalesce(new.raw_user_meta_data->>'display_name', 'New Pilot'),
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
