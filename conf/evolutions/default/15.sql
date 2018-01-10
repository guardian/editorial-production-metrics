# --- !Ups

ALTER TABLE metrics ADD COLUMN word_count integer;
ALTER TABLE metrics ADD COLUMN commissioned_word_count integer;
ALTER TABLE metrics ADD COLUMN path varchar;

# --- !Downs

ALTER TABLE metrics DROP COLUMN word_count;
ALTER TABLE metrics DROP COLUMN commissioned_word_count;
ALTER TABLE metrics DROP COLUMN path;