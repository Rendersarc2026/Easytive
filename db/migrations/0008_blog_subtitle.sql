-- Optional lines under an article's title: a subtitle ("Common Reasons
-- Explained") and a smaller note below it ("( Doctor-reviewed )").
-- Empty string means "not shown".

alter table easytive.blog_posts add column subtitle text not null default '';
alter table easytive.blog_posts add column subtitle_note text not null default '';
