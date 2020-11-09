const UsersService = require('../src/users/users-service');
const knex = require('knex');
const helpers = require('./test-helpers');
const { expect } = require('chai');

describe(`UsersService object`, () => {

    let db

    const testUsers = helpers.makeUsersArray();

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('users').truncate())

    afterEach(() => db('users').truncate())

    after(() => db.destroy())

    describe(`getAllUsers()`, () => {

        context(`Given users in database`, () => {

            before(() => {
                return db
                    .into('users')
                    .insert(testUsers)
            })

            it(`returns all users from the users table`, () => {
                return UsersService.getAllUsers(db)
                    .then(actual => {
                        expect(actual).to.eql(testUsers)
                    })
            })
        })
        
        context(`Given no users`, () => {
            it(`returns an empty array`, () => {
                return UsersService.getAllUsers(db)
                    .then(actual => {
                        expect(actual).to.eql([])
                    }) 
            })
        })
    })
})