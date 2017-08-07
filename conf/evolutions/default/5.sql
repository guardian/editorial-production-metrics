# --- !Ups

CREATE OR REPLACE FUNCTION set_creation_date() RETURNS TRIGGER AS
$BODY$
BEGIN
    UPDATE metrics SET creation_date = date_trunc('day', NEW.creation_time) WHERE id = NEW.id;;
    RETURN NEW;;
END;;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER set_creation_date_trigger
     AFTER UPDATE OR INSERT ON metrics
     FOR EACH ROW
     WHEN (pg_trigger_depth() < 1)
     EXECUTE PROCEDURE set_creation_date();

# --- !Downs

DROP TRIGGER IF EXISTS set_creation_date_trigger ON metrics;

DROP FUNCTION IF EXISTS set_creation_date();
