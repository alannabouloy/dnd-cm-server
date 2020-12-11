BEGIN;

TRUNCATE
    notes,
    campaigns,
    users
RESTART IDENTITY CASCADE;

INSERT INTO users (username, user_password, first_name, last_name, email)
VALUES
    ('demoaccount', '$2a$12$qJD7kaVQVaAN5U.T66XSI.gf98Hqv/FTSidoc4/ZAsalH1L3dzXVa', 'Jane', 'Demo', 'demoaccount@email.com'),
    ('mattmercer', '$2a$12$.0vIxDocI9/wR3ecsKHWCuCBhHVBADZf7tXuzbt3tmHNbU9lPEvmu', 'Matthew', 'Mercer', 'mmercer@email.com');

INSERT INTO campaigns (admin, campaign_name, players, active)
VALUES
    (1, 'First Campaign', 4, true),
    (2, 'Vox Machina', 7, true),
    (2, 'Mighty Nein', 7, true);

INSERT INTO notes (admin, campaign, note_title, note_content)
VALUES
    (1, 1, 'First Session', 'Met the party in an inn called "The Singing Ruby." Hired by a mysterious Tabaxi to go into the mines...'),
    (2, 3, 'Meeting Dairon', 'Met an awesome monk named Dairon. They wand me to be an expositor. Kicks ass'),
    (2, 3, 'Nott has a family', 'Real name is Veth. Has a son named Luc and husband named Yeza. Actually a halfling. Felderwin'),
    (2, 3, 'My tragic backstory', 'Told Beau how I was abused and brainwashed into brutally murdering my parents in order to get into archive. Went well');
COMMIT;