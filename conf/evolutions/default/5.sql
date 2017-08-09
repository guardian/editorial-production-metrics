# --- !Ups

ALTER TABLE metrics DROP COLUMN creation_date;

# --- !Downs

ALTER TABLE metrics ADD COLUMN creation_date timestamp;