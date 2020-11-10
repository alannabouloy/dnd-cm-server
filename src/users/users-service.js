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

    addUser(knex, newUser){
        return knex
        .into('users')
        .insert(newUser)
        .returning('*')
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
    }


}

module.exports = UsersService;