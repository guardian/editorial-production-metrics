# --- !Ups

ALTER TABLE forks DROP COLUMN issue_date;
ALTER TABLE forks DROP COLUMN seconds_until_fork;
DROP TABLE incopy_metrics;
DROP TABLE composer_metrics;

# --- !Downs

ALTER TABLE forks ADD COLUMN issue_date timestamp;
ALTER TABLE forks ADD COLUMN seconds_until_fork integer;

CREATE TABLE incopy_metrics (
  story_bundle_id         varchar(32)                   primary key,
  time_finalised          timestamp,
  word_count              integer                       not null,
  revision_number         integer                       not null
);

CREATE TABLE composer_metrics (
  composer_id             varchar(32)                   primary key,
  first_published         timestamp,
  created_in_workflow     boolean                       default false
);
