# --- !Ups

ALTER TABLE forks ALTER COLUMN id TYPE varchar(36);

# --- !Downs

ALTER TABLE forks ALTER COLUMN id TYPE varchar(32);