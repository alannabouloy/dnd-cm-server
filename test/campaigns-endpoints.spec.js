const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')


describe('Campaign Endpoints', () => {
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

    describe('GET campaigns by user', () => {
        context('given campaigns in the database', () => {
            const testCampaigns = helpers.makeCampaignsArray()
            const testUsers = helpers.makeUsersArray()
            
            beforeEach('insert data', () => {
                helpers.seedUsers(db, testUsers)
                return db
                    .into('campaigns')
                    .insert(testCampaigns)
            })

            it('returns 200 and list of campaigns matching user', () => {
                const user = testUsers[0]
                const expectedList = testCampaigns.filter(camp => camp.admin === user.id)

                return supertest(app)
                    .get('/api/user_campaigns')
                    .set('Authorization', helpers.makeAuthHeader(user))
                    .expect(200, expectedList)
            })
        })
        context('given no campaigns', () => {
            const testUsers = helpers.makeUsersArray()

            beforeEach('insert data', () => {
                helpers.seedUsers(db, testUsers)
            })

            it('returns 200 and empty array', () => {
                const user = testUsers[0]

                return supertest(app)
                    .get('/api/user_campaigns')
                    .set('Authorization', helpers.makeAuthHeader(user))
                    .expect(200, [])
            })
        })
    })
    describe('POST campaign', () => {
        const testUsers = helpers.makeUsersArray()

        beforeEach('insert users to data', () => {
            helpers.seedUsers(db, testUsers)
        })

        it('returns a 201 and campaign information', () => {
            const newCampaign = {
                campaign_name : 'new campaign',
                active: true,
                players: 4,
                private_campaign: false,
                camp_desc: 'this is a new campaign'
            }

            const expectedCampaign = {
                ...newCampaign,
                id: 1,
                admin: 1
            }

            return supertest(app)
                .post('/api/user_campaigns')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(newCampaign)
                .expect(201, expectedCampaign)
        })
    })
})