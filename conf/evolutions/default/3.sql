# --- !Ups

ALTER TABLE metrics RENAME COLUMN starting_system TO originating_system;

# --- !Downs

ALTER TABLE metrics RENAME COLUMN originating_system TO starting_system;
