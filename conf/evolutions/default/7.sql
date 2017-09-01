# --- !Ups

ALTER TABLE metrics ALTER COLUMN in_workflow SET NOT NULL;

# --- !Downs

ALTER TABLE metrics ALTER COLUMN in_workflow DROP NOT NULL;