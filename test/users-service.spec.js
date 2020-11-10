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

    describe(`addUser()`, () => {
        //test to make sure we can add a new user
        it(`adds a new user and returns that user to you with an id and date_joined`, () => {
            //set up newUser
            const newUser = {
                username: 'testnewusername',
                user_password: 'test-new-password',
                first_name: 'New',
                last_name: 'User',
                email: 'newtestuser@email.com'
            }
            //call addUser
            return UsersService.addUser(db, newUser)
                .then(actual => {
                    expect(actual.username).to.eql(newUser.username)
                    expect(actual.user_password).to.eql(newUser.user_password)
                    expect(actual.first_name).to.eql(newUser.first_name)
                    expect(actual.last_name).to.eql(newUser.last_name)
                    expect(actual.email).to.eql(newUser.email)
                    expect(actual).to.have.property('id')
                    expect(actual).to.have.property('date_joined')
                })
        })
    })

    describe(`getUserById()`, () => {
        
        context(`Given users in database`, () => {
            before(() => {
                return db
                    .into('users')
                    .insert(testUsers)
            })

            it(`returns user that matches id`, () => {
                const userId = 2
                const expectedUser = testUsers[userId - 1]

                return UsersService.getUserById(db, userId)
                    .then(actual => {
                        expect(actual).to.eql(expectedUser)
                    })
            })
        })
    })

    describe(`deleteUser()`, () => {
        
        context(`Given users in database`, () => {
            before(() => {
                return db
                    .into('users')
                    .insert(testUsers)
            })

            it(`deletes user from db`, () => {
                const userId = 2
                const expectedResult = testUsers.filter(user => user.id !== userId)

                return UsersService.deleteUser(db, userId)
                    .then(() => {
                        return UsersService.getAllUsers(db)
                            .then(actual => {
                                expect(actual).to.eql(expectedResult)
                            }) 
                    })
            })
        })
    })

    describe(`updateUser()`, () => {

        before(() => {
            return db
                    .into('users')
                    .insert(testUsers)
        })

        context(`Given users in database`, () => {

            it(`Updates the information in the database`, () => {
                const userId = 2
                const updateUser = {
                    first_name: 'Anna',
                    username: 'annatheunknown'
                 }
                const expectedResult = {
                    ...testUsers[userId - 1],
                    ...updateUser
                }

                return UsersService.updateUser(db, userId, updateUser)
                    .then(() => {
                         UsersService.getUserById(db, userId)
                            .then(actual => {
                                 expect(actual).to.eql(expectedResult)
                            })
                    })
            })

            
       })
    })
})