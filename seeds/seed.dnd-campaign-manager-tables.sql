BEGIN;

TRUNCATE
    notes,
    campaigns,
    users
RESTART IDENTITY CASCADE;

INSERT INTO users (username, user_password, first_name, last_name, email)
VALUES
    ('mattmercer', '$2a$12$.0vIxDocI9/wR3ecsKHWCuCBhHVBADZf7tXuzbt3tmHNbU9lPEvmu', 'Matthew', 'Mercer', 'mmercer@email.com'),
    ('marishanosleevesray', '$2a$12$EFsQD3yKclxnEojtaincQuJhF/R8fkAZ8ijIfuAGKcfdYhkjCoF/y', 'Marisha', 'Ray', 'mray@email.com'),
    ('laurajests', '$2a$12$hSmbQrS5WCqnOUETtCJIQe6pZiARGlobdgc.DoXUfzdYlwonzyF7W', 'Laura', 'Bailey', 'lbailey@email.com'),
    ('theancientone', '$2a$12$WldiNum4lE6QB9dd3SdUD.c6Qyb/CuDLq5E/88DUu7mE1aGev0vY6', 'Talieson', 'Jaffe', 'tjaffe@email.com'),
    ('thewinemom', '$2a$12$DD1drKMmo6/h3m.Tes9ZJePD5F2srPKbDldY9Txhpg.i9GImgn1zy', 'Sam', 'Riegel', 'sriegel@email.com'),
    ('tragicbackstoryliam', '$2a$12$huBJn.cjumMHPHkNFJA2ruetCt2TDvhwCbbkbESEzfxbigRTy0wru', 'Liam', 'O Brien', 'lobrien@email.com'),
    ('traviswillingham', '$2a$12$BuwU5tgIM4K1fXsrIKvHIO939XOKOkncbkRJbBOP4fUChqyZ3sxbm', 'Travis', 'Willingham', 'twillingham@email.com'),
    ('ashleyjohnson', '$2a$12$BNRLKLC2xAm6aKACvp1ptug0w3ERool7vUmvGAGfnzy7SsWL4iICC', 'Ashley', 'Johnson', 'ajohnson@email.com'),
    ('notacabbage', '$2a$12$73S4Pt10kcq3tcjclUP9I.oJwwA5JuqowHOBA3Kt546lSm8eWcWte', 'Brian W.', 'Foster', 'bwfoster@email.com'),
    ('galarzacat', '$2a$12$bmTQiLHoI9osLZrcregOWOF0FhaA6WSNxpwCWahsejUGj6QFsmh7u', 'Alex', 'Galarza', 'agalarza@email.com');

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