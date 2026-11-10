-- Admin accounts, sessions, rate limits, audit log and editable site content.
--
-- Everything lives in a private `easytive` schema: Supabase's Data API only
-- serves exposed schemas (public by default), so none of this is reachable
-- with a project API key. RLS is switched on with no policies as a second
-- fence; the app connects as the table owner, which is not subject to it.

create schema if not exists easytive;
revoke all on schema easytive from public;
revoke all on schema easytive from anon, authenticated;

-- ---- Accounts ---------------------------------------------------------------

create table easytive.admin_users (
  id bigint generated always as identity primary key,
  email text not null check (email = lower(email) and char_length(email) between 3 and 254),
  -- Encoded scrypt hash: scrypt$N$r$p$salt$hash (see src/lib/password.ts).
  password_hash text not null,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  -- Set when an admin (or the CLI) hands out a temporary password.
  must_change_password boolean not null default false,
  temp_password_expires_at timestamptz,
  disabled_at timestamptz,
  last_login_at timestamptz,
  password_changed_at timestamptz not null default now(),
  created_by bigint references easytive.admin_users (id) on delete set null,
  created_at timestamptz not null default now()
);
create unique index admin_users_email_key on easytive.admin_users (email);
create index admin_users_created_by_idx on easytive.admin_users (created_by);

-- ---- Sessions ---------------------------------------------------------------
-- The cookie holds a random token; only its SHA-256 is stored, so a database
-- leak does not hand out usable sessions.

create table easytive.admin_sessions (
  token_hash bytea primary key check (octet_length(token_hash) = 32),
  user_id bigint not null references easytive.admin_users (id) on delete cascade,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  expires_at timestamptz not null,
  ip text,
  user_agent text
);
create index admin_sessions_user_id_idx on easytive.admin_sessions (user_id);
create index admin_sessions_expires_at_idx on easytive.admin_sessions (expires_at);

-- ---- Rate limits ------------------------------------------------------------
-- Fixed-window counters, shared by every server instance. Keys are hashed
-- ("login:ip:<sha256>", "login:email:<sha256>"), so no addresses are stored.

create table easytive.rate_limits (
  key text primary key,
  count integer not null,
  window_start timestamptz not null default now()
);
create index rate_limits_window_start_idx on easytive.rate_limits (window_start);

-- ---- Audit log --------------------------------------------------------------

create table easytive.admin_audit_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor_id bigint references easytive.admin_users (id) on delete set null,
  action text not null,
  detail jsonb,
  ip text
);
create index admin_audit_log_at_idx on easytive.admin_audit_log (at desc);
create index admin_audit_log_actor_id_idx on easytive.admin_audit_log (actor_id);

-- ---- Site content -----------------------------------------------------------
-- One row per editable section (hero, products, articles, faq, …). The value
-- is that section's override; a missing row means "use the site default".

create table easytive.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by bigint references easytive.admin_users (id) on delete set null
);
create index site_content_updated_by_idx on easytive.site_content (updated_by);

-- ---- Lock down --------------------------------------------------------------

alter table easytive.admin_users enable row level security;
alter table easytive.admin_sessions enable row level security;
alter table easytive.rate_limits enable row level security;
alter table easytive.admin_audit_log enable row level security;
alter table easytive.site_content enable row level security;

revoke all on all tables in schema easytive from public;
revoke all on all tables in schema easytive from anon, authenticated;
alter default privileges in schema easytive revoke all on tables from public;
alter default privileges in schema easytive revoke all on tables from anon, authenticated;
