-- A note at the end of the article, under a thin rule, in small italics
-- ("Medically reviewed by Dr Pankaj Tripathi, MBBS, MD (Pathology) …").
-- Line breaks are kept. Empty string means "not shown".

alter table easytive.blog_posts add column review_note text not null default '';
