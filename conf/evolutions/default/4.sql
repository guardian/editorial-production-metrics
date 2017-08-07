# --- !Ups

ALTER TABLE metrics ADD COLUMN creation_date timestamp;

# --- !Downs

ALTER TABLE metrics DROP COLUMN creation_date;