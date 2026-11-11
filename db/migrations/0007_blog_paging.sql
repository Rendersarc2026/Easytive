-- Blog lists load 9 posts at a time (infinite scroll), paging by the last
-- post seen rather than an offset. Undated drafts sort first, so the sort key
-- is coalesce(published_on, 'infinity'); this index matches that order.

drop index easytive.blog_posts_order_idx;
create index blog_posts_order_idx
  on easytive.blog_posts ((coalesce(published_on, 'infinity'::date)) desc, id desc)
  where is_active;
