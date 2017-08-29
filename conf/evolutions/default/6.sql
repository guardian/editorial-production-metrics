# --- !Ups

ALTER TABLE metrics ADD COLUMN production_office varchar(16);

# --- !Downs

ALTER TABLE metrics DROP COLUMN production_office;