-- Rebuild admin_users: uuid ids, Argon2id hashes, and soft delete via is_active.
--
-- Accounts are never hard-deleted any more: "deleting" one sets is_active to
-- false, which blocks sign-in and keeps the row so audit history still names
-- who did what. Existing rows are copied across with fresh uuids, and every
-- column that pointed at the old bigint id is converted to the matching uuid.
--
-- Existing scrypt hashes are kept as they are; src/lib/password.ts still
-- verifies them and rewrites them as Argon2id at the account's next sign-in.

-- ---- Move the old table aside -------------------------------------------------
-- Index names are schema-wide, so free them up for the new table.

alter table easytive.admin_users rename to admin_users_old;
alter index easytive.admin_users_pkey rename to admin_users_old_pkey;
alter index easytive.admin_users_email_key rename to admin_users_old_email_key;
alter index easytive.admin_users_created_by_idx rename to admin_users_old_created_by_idx;

-- ---- New accounts table -------------------------------------------------------

create table easytive.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(email) and char_length(email) between 3 and 254),
  -- Argon2id in PHC form: $argon2id$v=19$m=…,t=…,p=…$salt$hash (see src/lib/password.ts).
  password_hash text not null,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  -- Soft delete: false blocks sign-in; the row stays.
  is_active boolean not null default true,
  -- Set when an admin (or the CLI) hands out a temporary password.
  must_change_password boolean not null default false,
  temp_password_expires_at timestamptz,
  last_login_at timestamptz,
  password_changed_at timestamptz not null default now(),
  created_by uuid references easytive.admin_users (id) on delete set null,
  created_at timestamptz not null default now(),
  legacy_id bigint -- old id, only for the copy below; dropped at the end
);

insert into easytive.admin_users
  (email, password_hash, role, is_active, must_change_password, temp_password_expires_at,
   last_login_at, password_changed_at, created_at, legacy_id)
select email, password_hash, role, disabled_at is null, must_change_password, temp_password_expires_at,
       last_login_at, password_changed_at, created_at, id
from easytive.admin_users_old;

update easytive.admin_users n
set created_by = creator.id
from easytive.admin_users_old o
join easytive.admin_users creator on creator.legacy_id = o.created_by
where o.id = n.legacy_id;

-- ---- Point dependent columns at the new ids -------------------------------------
-- Dropping the old column also drops its foreign key and index.

alter table easytive.admin_sessions add column user_uuid uuid;
update easytive.admin_sessions s set user_uuid = u.id from easytive.admin_users u where u.legacy_id = s.user_id;
delete from easytive.admin_sessions where user_uuid is null;
alter table easytive.admin_sessions drop column user_id;
alter table easytive.admin_sessions rename column user_uuid to user_id;
alter table easytive.admin_sessions alter column user_id set not null;
alter table easytive.admin_sessions
  add constraint admin_sessions_user_id_fkey foreign key (user_id) references easytive.admin_users (id) on delete cascade;
create index admin_sessions_user_id_idx on easytive.admin_sessions (user_id);

alter table easytive.admin_audit_log add column actor_uuid uuid;
update easytive.admin_audit_log l set actor_uuid = u.id from easytive.admin_users u where u.legacy_id = l.actor_id;
alter table easytive.admin_audit_log drop column actor_id;
alter table easytive.admin_audit_log rename column actor_uuid to actor_id;
alter table easytive.admin_audit_log
  add constraint admin_audit_log_actor_id_fkey foreign key (actor_id) references easytive.admin_users (id) on delete set null;
create index admin_audit_log_actor_id_idx on easytive.admin_audit_log (actor_id);

alter table easytive.site_content add column updated_by_uuid uuid;
update easytive.site_content c set updated_by_uuid = u.id from easytive.admin_users u where u.legacy_id = c.updated_by;
alter table easytive.site_content drop column updated_by;
alter table easytive.site_content rename column updated_by_uuid to updated_by;
alter table easytive.site_content
  add constraint site_content_updated_by_fkey foreign key (updated_by) references easytive.admin_users (id) on delete set null;
create index site_content_updated_by_idx on easytive.site_content (updated_by);

-- ---- Finish ---------------------------------------------------------------------

drop table easytive.admin_users_old;
alter table easytive.admin_users drop column legacy_id;

-- One account per email, active or not: a deactivated account is reactivated, not re-created.
create unique index admin_users_email_key on easytive.admin_users (email);
create index admin_users_created_by_idx on easytive.admin_users (created_by);

alter table easytive.admin_users enable row level security;
revoke all on easytive.admin_users from public;
revoke all on easytive.admin_users from anon, authenticated;
