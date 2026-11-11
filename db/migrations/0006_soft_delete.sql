-- Soft delete everywhere: nothing is removed from the database any more.
-- Every table gets is_active (default true); "deleting" a row sets it to
-- false, and the app only reads rows where it is true.
--
-- admin_users already has is_active (0002). schema_migrations is left alone:
-- it is the migration runner's own record and is never deleted from.
--
-- Tables whose rows are reused by key (rate_limits, account_locks, ip_blocks)
-- switch a soft-deleted row back on when the same key comes up again.

alter table easytive.admin_sessions add column is_active boolean not null default true;
alter table easytive.admin_audit_log add column is_active boolean not null default true;
alter table easytive.rate_limits add column is_active boolean not null default true;
alter table easytive.site_content add column is_active boolean not null default true;
alter table easytive.blog_posts add column is_active boolean not null default true;
alter table easytive.login_failures add column is_active boolean not null default true;
alter table easytive.account_locks add column is_active boolean not null default true;
alter table easytive.ip_blocks add column is_active boolean not null default true;

-- Blog: only live posts need distinct addresses, so a deleted post doesn't
-- hold on to its slug. The list order index only needs live posts too.
alter table easytive.blog_posts drop constraint blog_posts_slug_key;
create unique index blog_posts_slug_key on easytive.blog_posts (slug) where is_active;
drop index easytive.blog_posts_order_idx;
create index blog_posts_order_idx on easytive.blog_posts (published_on desc nulls first, id desc) where is_active;

-- Failed sign-ins: the sliding-window counts only look at active rows.
drop index easytive.login_failures_email_hash_at_idx;
drop index easytive.login_failures_ip_at_idx;
create index login_failures_email_hash_at_idx on easytive.login_failures (email_hash, at) where is_active;
create index login_failures_ip_at_idx on easytive.login_failures (ip, at) where is_active;

-- Sessions: signing out everywhere ends a user's active sessions.
create index admin_sessions_user_id_active_idx on easytive.admin_sessions (user_id) where is_active;
