# --- !Ups

ALTER TABLE forks ADD COLUMN issue_date timestamp;
ALTER TABLE forks ADD COLUMN seconds_until_fork integer;

# --- !Downs

ALTER TABLE forks DROP COLUMN issue_date;
ALTER TABLE forks DROP COLUMN seconds_until_fork;