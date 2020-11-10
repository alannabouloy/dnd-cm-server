const NotesService = {
    getAllNotesByCampaign(knex, campaignId){
        return knex
            .select('*')
            .from('notes')
            .where('campaign', campaignId)
    },

    getAllNotesByAdmin(knex, adminId){
        return knex
            .select('*')
            .from('notes')
            .where('admin', adminId)
    },

    getNoteById(knex, id){
        return knex
            .select('*')
            .from('notes')
            .where('id', id)
            .first()
    },
    addNote(knex, newNote){
        return knex
            .into('notes')
            .insert(newNote)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    updateNote(knex, id, updateFields){
        return knex('notes')
            .where({id})
            .update(updateFields)
    },
    deleteCampaign(knex, id){
        return knex('notes')
            .where({id})
            .delete()
    }
}

module.exports = NotesService;