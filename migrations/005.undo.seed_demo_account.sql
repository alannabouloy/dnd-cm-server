BEGIN;

TRUNCATE 
    notes,
    campaigns,
    users
RESTART IDENTITY CASCADE;


COMMIT;