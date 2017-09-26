# --- !Ups

ALTER TABLE metrics ADD COLUMN newspaper_book varchar;
ALTER TABLE metrics ADD COLUMN newspaper_book_section varchar;

# --- !Downs

ALTER TABLE metrics DROP COLUMN newspaper_book;
ALTER TABLE metrics DROP COLUMN newspaper_book_section;