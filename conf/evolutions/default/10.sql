# --- !Ups

ALTER TABLE metrics ADD COLUMN publication_time timestamp;

# --- !Downs

ALTER TABLE metrics DROP COLUMN publication_time;