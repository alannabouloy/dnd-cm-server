const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray(){
    return [
        {
            id: 1,
            username: 'testuser1',
            user_password: 'test-password1',
            first_name: 'Test',
            last_name: 'User1',
            email: 'testuser1@email.com',
            date_joined: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 2, 
            username: 'testuser2',
            user_password: 'test-password2',
            first_name: 'Test',
            last_name: 'User2',
            email: 'testuser2@email.com',
            date_joined: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 3,
            username: 'testuser3',
            user_password: 'test-password3',
            first_name: 'Test',
            last_name: 'User3',
            email: 'testuser3@email.com',
            date_joined: '2029-01-22T16:28:32.615Z',
        }
    ]
}

function makeCampaignsArray(){
    return [
        {
            id: 1,
            campaign_name: 'testcampaign1',
            players: 3,
            admin: 1,
            desc: 'this is a test',
            active: true,
            private_campaign: false,
            playing_since: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 2, 
            campaign_name: 'testcampaign2',
            players: 5,
            admin: 2,
            desc: 'this is a test',
            active: true,
            private_campaign: false,
            playing_since: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 3,
            campaign_name: 'testcampaign3',
            players: 4,
            admin: 3,
            desc: 'this is a test',
            active: true,
            private_campaign: true,
            playing_since: new Date('2029-01-22T16:28:32.615Z')
        }
    ]
}

function makeNotesArray(){
    return [
        {
            id: 1,
            note_title: 'testnote1',
            note_content: 'this is a  test',
            modified: new Date('2029-01-22T16:28:32.615Z'),
            private_note: false,
            admin: 1,
            campaign: 2
        },
        {
            id: 2,
            note_title: 'testnote2',
            note_content: 'this is a test',
            modified: new Date('2029-01-22T16:28:32.615Z'),
            private_note: true,
            admin: 2,
            campaign: 2
        },
        {
            id: 3, 
            note_title: 'testnote3',
            note_content: 'this is a test',
            modified: new Date('2029-01-22T16:28:32.615Z'),
            private_note: false,
            admin: 1,
            campaign: 1
        }
    ]
}

function seedUsers(db, users){
    const preppedUsers = users.map(user => ({
        ...user,
        user_password: bcrypt.hashSync(user.user_password, 1)
    }))

    return db.into('users').insert(preppedUsers)
        .then(() => 
            db.raw(
                `SELECT setval('users_id_seq', ?)`, 
                [users[users.length -1].id],
            )
        )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET){
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.username,
        algorithm: 'HS256',
    })

    return `Bearer ${token}`
}

module.exports = {
    makeUsersArray,
     makeCampaignsArray, 
     makeNotesArray,
     seedUsers,
     makeAuthHeader
}