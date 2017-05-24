# --- !Ups

CREATE TYPE production_environment AS ENUM('composer','incopy');

CREATE TABLE metrics (
  id                      varchar(32)                   primary key,
  starting_system         production_environment,
  composer_id             varchar(32)                   unique,
  story_bundle_id         varchar(32)                   unique,
  commissioning_desk      varchar(32),
  user_desk               varchar(32),
  in_workflow             boolean                       DEFAULT FALSE,
  in_newspaper            boolean                       DEFAULT FALSE,
  creation_time           timestamp,
  roundtrip               boolean                       DEFAULT FALSE
);

CREATE TABLE incopy_metrics (
  story_bundle_id         varchar(32)                   primary key,
  time_finalised          timestamp,
  word_count              integer,
  revision_number         integer
);

CREATE TABLE composer_metrics (
  composer_id             varchar(32)                   primary key,
  first_published         timestamp,
  created_in_workflow     boolean                       DEFAULT FALSE
);

CREATE TABLE forks (
  id                      varchar(32)                   primary key,
  composer_id             varchar(32)                   not null,
  time                    timestamp                     not null,
  word_count              integer                       not null,
  revision_number         integer                       not null
);

# --- !Downs

DROP TYPE production_environment;

DROP TABLE metrics;

DROP TABLE incopy_metrics;

DROP TABLE composer_metrics;

DROP TABLE forks;