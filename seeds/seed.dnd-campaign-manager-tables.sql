BEGIN;

TRUNCATE
    notes,
    campaigns,
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
    ('notacabbage', 'no1puphenry', 'Brian W.', 'Foster', 'bwfoster@email.com'),
    ('galarzacat', 'freyaisacutie', 'Alex', 'Galarza', 'agalarza@email.com');

INSERT INTO campaigns (admin, campaign_name, players, active)
VALUES
    (1, 'Vox Machina', 7, true),
    (1, 'Mighty Nein', 7, true),
    (10, 'Merry Misfits', 5, true);

INSERT INTO notes (admin, campaign, note_title, note_content)
VALUES
    (2, 2, 'Meeting Dairon', 'Met an awesome monk named Dairon. They wand me to be an expositor. Kicks ass'),
    (2, 2, 'Nott has a family', 'Real name is Veth. Has a son named Luc and husband named Yeza. Actually a halfling. Felderwin'),
    (6, 2, 'My tragic backstory', 'Told Beau how I was abused and brainwashed into brutally murdering my parents in order to get into archive. Went well');
COMMIT;