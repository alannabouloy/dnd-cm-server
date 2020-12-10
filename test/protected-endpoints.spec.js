const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Protected endpoints', function() {
    let db


    const testUsers = helpers.makeUsersArray()
    const testCampaigns = helpers.makeCampaignsArray()
    const testNotes = helpers.makeNotesArray()


    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clear database tables', () => db.raw('TRUNCATE notes, campaigns, users RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE notes, campaigns, users RESTART IDENTITY CASCADE'))

    beforeEach('insert data', () => {
        helpers.seedUsers(db, testUsers)
        helpers.seedCampaigns(db, testCampaigns)
        return db.into('notes').insert(testNotes)
    })

    const protectedEndpoints = [
        {
            name: 'GET /api/user_campaigns',
            path: '/api/user_campaigns',
            method: supertest(app).get,
        },
        {
            name: 'POST /api/user_campaigns',
            path: '/api/user_campaigns',
            method: supertest(app).post,
        },
        {
            name: 'GET /api/user_campaigns/:camp_id',
            path: '/api/user_campaigns/1',
            method: supertest(app).get,
        },
        {
            name: 'GET /api/user_notes/:camp_id',
            path: '/api/user_notes/1',
            method: supertest(app).get,
        },
        {
            name: 'POST /api/user_notes/:camp_id',
            path: '/api/user_notes/1',
            method: supertest(app).get,
        }
    ]

    protectedEndpoints.forEach(endpoint => {
        describe(endpoint.name, () => {
            it(`responds 401 'Missing bearer token' when no bearer token`, () => {
                return endpoint.method(endpoint.path)
                    .expect(401, { error: 'Missing bearer token' })
            })

            it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = testUsers[0]
                const invalidSecret = 'bad-secret'
                return endpoint.method(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                    .expect(401, { error: 'Unauthorized request' })
            })

            it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
                const invalidUser = { username: 'user-not-existy', id: 1 }
                return endpoint.method(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(invalidUser))
                    .expect(401, { error: 'Unauthorized request' })
            })
        })
    })
})