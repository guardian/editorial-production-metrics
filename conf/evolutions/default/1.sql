# --- !Ups
-- Quill Does not currently work well with Enums
-- CREATE TYPE production_environment AS ENUM('composer','incopy');

create table metrics (
  id                      varchar(32)                   primary key,
  starting_system         text                          constraint production_environment check (starting_system = 'composer' or starting_system = 'incopy') not null,
  composer_id             varchar(32)                   unique,
  story_bundle_id         varchar(32)                   unique,
  commissioning_desk      text,
  user_desk               text,
  in_workflow             boolean                       default false,
  in_newspaper            boolean                       default false,
  creation_time           timestamp                     not null,
  round_trip              boolean                       default false
);

create table incopy_metrics (
  story_bundle_id         varchar(32)                   primary key,
  time_finalised          timestamp,
  word_count              integer                       not null,
  revision_number         integer                       not null
);

create table composer_metrics (
  composer_id             varchar(32)                   primary key,
  first_published         timestamp,
  created_in_workflow     boolean                       default false
);

create table forks (
  id                      varchar(32)                   primary key,
  composer_id             varchar(32)                   not null,
  time                    timestamp                     not null,
  word_count              integer                       not null,
  revision_number         integer                       not null
);

# --- !Downs

-- DROP TYPE production_environment;

drop table metrics;

drop table incopy_metrics;

drop table composer_metrics;

drop table forks;