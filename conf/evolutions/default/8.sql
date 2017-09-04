# --- !Ups

ALTER TABLE metrics ALTER COLUMN in_newspaper SET NOT NULL;
ALTER TABLE metrics ALTER COLUMN round_trip SET NOT NULL;

# --- !Downs

ALTER TABLE metrics ALTER COLUMN in_newspaper DROP NOT NULL;
ALTER TABLE metrics ALTER COLUMN round_trip DROP NOT NULL;