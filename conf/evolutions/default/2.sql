# --- !Ups
drop table metrics;

create table metrics (
  id                      varchar(36)                   primary key,
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

# --- !Downs

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

drop table metrics;
