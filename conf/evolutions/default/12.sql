# --- !Ups

ALTER TABLE forks ADD COLUMN time_to_publication integer;
ALTER TABLE forks ADD COLUMN octopus_status varchar;
ALTER TABLE forks ADD COLUMN fork_application varchar;
ALTER TABLE forks ADD COLUMN workflow_status varchar;

ALTER TABLE metrics ADD COLUMN book_section_name varchar;
ALTER TABLE metrics ADD COLUMN book_section_code varchar;
ALTER TABLE metrics ADD COLUMN issue_date timestamp;

# --- !Downs

ALTER TABLE forks DROP COLUMN time_to_publication;
ALTER TABLE forks DROP COLUMN octopus_status;
ALTER TABLE forks DROP COLUMN fork_application;
ALTER TABLE forks DROP COLUMN workflow_status;

ALTER TABLE metrics DROP COLUMN book_section_name;
ALTER TABLE metrics DROP COLUMN book_section_code;
ALTER TABLE metrics DROP COLUMN issue_date;