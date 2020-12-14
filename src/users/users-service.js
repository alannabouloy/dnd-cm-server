const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    getAllUsers(knex){
        return knex
            .select('*')
            .from('users')
    },

    getUserById(knex, userId){
       return knex
            .select('*')
            .from('users')
            .where('id', userId)
            .first()
    },

    hasUserWithUsername(knex, username){
        return knex
            .select('*')
            .from('users')
            .where('username', username)
            .first()
            .then(user => !!user)
    },

    hasUserWithEmail(knex, email){
        return knex
            .select('*')
            .from('users')
            .where({email})
            .first()
            .then(user => !!user)
    },

    addUser(knex, newUser){
        return knex
        .into('users')
        .insert(newUser)
        .returning(['username', 'first_name', 'last_name', 'email', 'user_password', 'id'])
        .then(rows => {
            return rows[0]
        })
    },

    updateUser(knex, userId, updateFields){
        return knex('users')
            .where({id: userId})
            .update(updateFields)
    },

    deleteUser(knex, userId){
        return knex('users')
            .where({id: userId})
            .delete()
    },

    validatePassword(password) {
        if (password.length < 8) {
            return {error: { message: 'Password must be longer than 8 characters' } }
        }
        if (password.length > 72) {
            return { error: { message: 'Password must be less than 72 characters' } } 
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return { error: { message: 'Password must not start or end with empty spaces' } }
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return { error: { message: 'Password must contain 1 upper case, lower case, number and special character' } }
        }
        return null
    },

    hashPassword(password){
        return bcrypt.hash(password, 12)
    }


}

module.exports = UsersService;