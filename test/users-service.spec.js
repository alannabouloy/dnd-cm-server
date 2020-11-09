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

    before(() => {
        return db
            .into('users')
            .insert(testUsers)
    })

    after(() => db.destroy())

    describe(`getAllUsers()`, () => {
        it(`returns all users from the users table`, () => {
            return UsersService.getAllUsers(db)
                .then(actual => {
                    expect(actual).to.eql(testUsers)
                })
        })
    })
})