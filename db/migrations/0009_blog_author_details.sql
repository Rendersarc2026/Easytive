-- The author's credentials, shown in small type under their name on the
-- article ("MBBS, MD (Pathology)," / "Reg. No. 37061, Delhi Medical Council").
-- Line breaks are kept. Empty string means "not shown".

alter table easytive.blog_posts add column author_details text not null default '';
