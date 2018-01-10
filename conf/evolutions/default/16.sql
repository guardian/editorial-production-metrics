# --- !Ups

ALTER TABLE metrics ADD COLUMN headline varchar;

# --- !Downs

ALTER TABLE metrics DROP COLUMN headline;