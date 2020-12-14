const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Notes Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => {
        db.destroy()
    })

    before('clean the table', () => db.raw('TRUNCATE notes, campaigns, users RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE notes, campaigns, users RESTART IDENTITY CASCADE'))

    describe('GET campaign notes', () => {
        context('given notes in database', () => {
            const testUsers = helpers.makeUsersArray()
            const testCampaigns = helpers.makeCampaignsArray()
            const testNotes = helpers.makeNotesArray()

            beforeEach('insert data', () => {
                helpers.seedUsers(db, testUsers),
                helpers.seedCampaigns(db, testCampaigns)
                return db
                    .into('notes')
                    .insert(testNotes)
            })

            it('returns 200 and array of notes for campaign', () => {
                const campaign = testCampaigns[1]
                const user = testUsers[1]
                const expectedList = testNotes.filter(note => note.campaign === campaign.id)

                return supertest(app)
                    .get(`/api/user_notes/${campaign.id}`)
                    .set('Authorization', helpers.makeAuthHeader(user))
                    .expect(200, expectedList)
            })
        })
        context('given no notes', () =>{
            const testUsers = helpers.makeUsersArray()
            const testCampaigns = helpers.makeCampaignsArray()

            beforeEach('insert data', () => {
                helpers.seedUsers(db, testUsers)
                helpers.seedCampaigns(db, testCampaigns)
            })

            it('returns 200 and empty array', () => {
                const campaign = testCampaigns[0]
                const user = testUsers[0]

                return supertest(app)
                    .get(`/api/user_notes/${campaign.id}`)
                    .set('Authorization', helpers.makeAuthHeader(user))
                    .expect(200, [])
            })
        })
    })
    describe('POST note', () => {
        const testUsers = helpers.makeUsersArray()
        const testCampaigns = helpers.makeCampaignsArray()

        beforeEach('insert data', () => {
            helpers.seedUsers(db, testUsers)
            helpers.seedCampaigns(db, testCampaigns)
        })

        it('returns a 201 and note information', () => {
            const user = testUsers[0]
            const campaign = testCampaigns[0]
            const newNote = {
                note_title: 'new note',
                note_content: 'this is a test',
                private_note: false,
                modified: '2029-01-22T16:28:32.615Z',
            }

            const expectedNote = {
                ...newNote,
                id: 1,
                admin: user.id,
                campaign: campaign.id
            }

            return supertest(app)
                .post(`/api/user_notes/${campaign.id}`)
                .set('Authorization', helpers.makeAuthHeader(user))
                .send(newNote)
                .expect(201, expectedNote)
        })
    })
})