const UsersService = {
    getAllUsers(knex){
        return knex
            .select('*')
            .from('users')
    },

    getUserById(knex, userId){

    },

    addUser(knex, newUser){

    },

    updateUser(knex, userId, updateFields){

    },

    deleteUser(knex, userId){

    }


}

module.exports = UsersService;