-- Clean-up after the admin was cut down to blog posts only.
--
--   * Blog posts moved to easytive.blog_posts (0003), so the old JSON copy in
--     site_content is no longer read.
--   * There is no account management page any more, so every account has the
--     same access and the admin/editor role means nothing: drop it.
--   * Failed-password lockouts moved to account_locks / login_failures (0004);
--     the old per-email counters in rate_limits are unused.

delete from easytive.site_content where key = 'articles';

alter table easytive.admin_users drop column role;

delete from easytive.rate_limits where key like 'login:email:%';
