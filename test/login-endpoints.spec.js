const supertest = require('supertest')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken')

describe.only('Login Endpoint', function() {
    let db
    
    const testUsers = helpers.makeUsersArray()
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => {
        db.destroy()
    })

    before('clean the table', () => db.raw('TRUNCATE notes, campaigns, users RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE notes, campaigns, users RESTART IDENTITY CASCADE'))

    describe('POST login', () => {
        beforeEach('insert users', () => {
            helpers.seedUsers(db, testUsers)
        })

        const requiredFields = ['username', 'user_password']

        requiredFields.forEach(field => {
            const loginAttemptBody = {
                username: testUser.username,
                user_password: testUser.user_password,
            }

            it(`responds with 400 required error when '${field}' is missing`, () => {
                delete loginAttemptBody[field]

                return supertest(app)
                    .post('/api/auth/login')
                    .send(loginAttemptBody)
                    .expect(400, {
                        error: `Missing '${field}' in request body`
                    })
            })
        })

        it(`responds 400 'invalid username or user_password' when bad username`, () => {
            const userInvalidUser = { username: 'user_not', user_password: 'exist'}
            
            return supertest(app)
                .post('/api/auth/login')
                .send(userInvalidUser)
                .expect(400, {error: `Incorrect username or user_password` })
        })

        it(`responds 400 'invalid username or user_password' when bad user_password`, () => {
            const userInvalidPass = { user_name: testUser.username, user_password: 'iamwrong'}
            
            return supertest(app)
                .post('/api/auth/login')
                .send(userInvalidPass)
                .expect(400, {error: `Incorrect username or user_password` })
        })

        it(`responds 200 and JWT auth token when credentials valid`, () => {
            const userValidCreds = {
                username: testUser.username,
                user_password: testUser.user_password
            }

            const expectedToken = jwt.sign(
                { user_id: testUser.id },
                process.env.JWT_SECRET,
                {
                    subject: testUser.username,
                    algorithm: 'HS256'
                }
            )

            return supertest(app)
                .post('/api/auth/login')
                .send(userValidCreds)
                .expect(200, {
                    authToken: expectedToken,
                })
        })
    })
})