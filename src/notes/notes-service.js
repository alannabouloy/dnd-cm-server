const NotesService = {
    getAllNotesByCampaign(knex, campaignId){
        return knex
            .select('*')
            .from('notes')
            .where('campaign', campaignId)
    },

    getAllNotesByAdmin(knex, adminId, campId){
        return knex
            .select('*')
            .from('notes')
            .where('admin', adminId)
            .where('campaign', campId)
    },

    getNoteById(knex, campId, noteId){
        return knex
            .select('*')
            .from('notes')
            .where('campaign', campId)
            .where('id', noteId)
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
    updateNote(knex, campId, noteId, updateFields){
        return knex('notes')
            .where({campaign : campId})
            .where({id : noteId})
            .update(updateFields)
    },
    deleteNote(knex, campId, noteId){
        return knex('notes')
            .where({campaign : campId})
            .where({id : noteId})
            .delete()
    }
}

module.exports = NotesService;