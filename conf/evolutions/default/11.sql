# --- !Ups

ALTER TABLE forks ADD COLUMN issue_date timestamp;
ALTER TABLE forks ADD COLUMN time_until_fork timestamp;

# --- !Downs

ALTER TABLE forks DROP COLUMN issue_date;
ALTER TABLE forks DROP COLUMN time_until_fork;