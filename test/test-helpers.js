function makeUsersArray(){
    return [
        {
            id: 1,
            username: 'testuser1',
            user_password: 'test-password1',
            first_name: 'Test',
            last_name: 'User1',
            email: 'testuser1@email.com',
            date_joined: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 2, 
            username: 'testuser2',
            user_password: 'test-password2',
            first_name: 'Test',
            last_name: 'User2',
            email: 'testuser2@email.com',
            date_joined: new Date('2029-01-22T16:28:32.615Z'),
        },
        {
            id: 3,
            username: 'testuser3',
            user_password: 'test-password3',
            first_name: 'Test',
            last_name: 'User3',
            email: 'testuser3@email.com',
            date_joined: new Date('2029-01-22T16:28:32.615Z'),
        }
    ]
}

module.exports = {
    makeUsersArray,
}