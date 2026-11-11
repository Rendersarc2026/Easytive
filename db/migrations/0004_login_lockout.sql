-- Sign-in protection (see src/lib/login-guard.ts):
--   * login_failures: one row per failed sign-in, for sliding-window counts
--     per account and per address;
--   * account_locks:  5 failures on an account in 15 minutes lock it for 15;
--   * ip_blocks:      addresses that look like an attack are shut out of the
--                     whole admin for a while (1 hour, doubling on repeats).
--
-- Accounts are identified by a SHA-256 of the typed email, so an email that
-- has no account is counted and locked exactly like one that does (the
-- responses can't be used to find out which emails exist).

create table easytive.login_failures (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  email_hash text not null check (email_hash ~ '^[0-9a-f]{64}$'),
  ip text not null check (char_length(ip) <= 64)
);
create index login_failures_email_hash_at_idx on easytive.login_failures (email_hash, at);
create index login_failures_ip_at_idx on easytive.login_failures (ip, at);
create index login_failures_at_idx on easytive.login_failures (at);

create table easytive.account_locks (
  email_hash text primary key check (email_hash ~ '^[0-9a-f]{64}$'),
  locked_until timestamptz not null,
  locked_at timestamptz not null default now()
);
create index account_locks_locked_until_idx on easytive.account_locks (locked_until);

create table easytive.ip_blocks (
  ip text primary key check (char_length(ip) <= 64),
  blocked_until timestamptz not null,
  reason text not null,
  -- How many times this address has been blocked; each new block lasts twice
  -- as long as the last (capped at a day). Resets after 30 quiet days.
  strikes integer not null default 1 check (strikes > 0),
  first_blocked_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ip_blocks_blocked_until_idx on easytive.ip_blocks (blocked_until);

alter table easytive.login_failures enable row level security;
alter table easytive.account_locks enable row level security;
alter table easytive.ip_blocks enable row level security;
revoke all on easytive.login_failures, easytive.account_locks, easytive.ip_blocks from public;
revoke all on easytive.login_failures, easytive.account_locks, easytive.ip_blocks from anon, authenticated;
