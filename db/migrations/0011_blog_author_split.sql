-- The author's credentials as two separate fields instead of one free-text
-- box (0009): qualifications ("MBBS, MD (Pathology),") and registration
-- ("Reg. No. 37061, Delhi Medical Council"). Each shows on its own line under
-- the author's name. Anything already typed into author_details is kept as
-- the qualifications.

alter table easytive.blog_posts rename column author_details to author_qualifications;
alter table easytive.blog_posts add column author_registration text not null default '';
