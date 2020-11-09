BEGIN;

TRUNCATE
    users
RESTART IDENTITY CASCADE;

INSERT INTO users (username, user_password, first_name, last_name, email)
VALUES
    ('mattmercer', 'pumatrocks', 'Matthew', 'Mercer', 'mmercer@email.com'),
    ('marishanosleevesray', 'sleevesarebullshit', 'Marisha', 'Ray', 'mray@email.com'),
    ('laurajests', 'travelerismycopilot', 'Laura', 'Bailey', 'lbailey@email.com'),
    ('theancientone', 'longmayhereign', 'Talieson', 'Jaffe', 'tjaffe@email.com'),
    ('thewinemom', 'nott-the-brave', 'Sam', 'Riegel', 'sriegel@email.com'),
    ('tragicbackstoryliam', 'calebcries', 'Liam', 'O Brien', 'lobrien@email.com'),
    ('traviswillingham', 'cowboysrule', 'Travis', 'Willingham', 'twillingham@email.com'),
    ('ashleyjohnson', 'harpsandflowers', 'Ashley', 'Johnson', 'ajohnson@email.com'),
    ('notacabbage', 'no1puphenry', 'Brian W.', 'Foster', 'bwfoster@email.com');

COMMIT;