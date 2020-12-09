const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')




describe('Users Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => {
        db.destroy()
    })

    before('clean the table', () => db.raw('TRUNCATE users, campaigns, notes RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE users, campaigns, notes RESTART IDENTITY CASCADE'))

    describe('GET users from table', () => {
        context('given users in database', () => {
            const testUsers = helpers.makeUsersArray()

            beforeEach('insert users', () => {
                return db
                    .into('users')
                    .insert(testUsers)
            })

            it('returns 200 and an array of users', () => {
                    return supertest(app)
                    .get('/api/users')
                    .expect(200, testUsers)
            })
        })
        context('given no users in table', () => {
            it('returns an empty array', () => {
                return supertest(app)
                    .get('/api/users')
                    .expect(200, [])
            })
        })
    })

    describe('GET by username', () => {
        context('given users in database', () => {
            const testUsers = helpers.makeUsersArray()

            beforeEach('insert users into table', () => 
                helpers.seedUsers(db, testUsers)
            )

            it('returns 200 and correct user information', () => {
                 const {email, first_name, last_name, id, username} = testUsers[0]
                 const expectedUser = {email, first_name, last_name, id, username}

                return supertest(app)
                    .get(`/api/users/${testUsers[0].username}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedUser)
            })
        })
    })

    describe('POST user', () => {
        it('returns a 201 and created user', () => {
            const newUser = {
                username: 'newuser',
                first_name: 'new',
                last_name: 'user',
                email: 'newuser@email.com',
                user_password: 'newuserpassword'
            }

            const expectedUser = {
                ...newUser,
                id: 1
            }

            return supertest(app)
                .post('/api/users')
                .send(newUser)
                .expect(201, expectedUser)
        })
    })
})