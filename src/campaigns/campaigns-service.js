const CampaignsService = {
    getAllCampaigns(knex){
        return knex
            .select('*')
            .from('campaigns')
    },
    getAllCampaignsByAdmin(knex, adminId){
        return knex
            .select('*')
            .from('campaigns')
            .where('admin', adminId)
    },
    getCampaignById(knex, id){
        return knex
            .select('*')
            .from('campaigns')
            .where('id', id)
            .first()
    },
    addCampaign(knex, newCampaign){
        return knex
        .into('campaigns')
        .insert(newCampaign)
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    },
    updateCampaign(knex, id, updateFields){
        return knex('campaigns')
            .where({id})
            .update(updateFields)
    },
    deleteCampaign(knex, id){
        return knex('campaigns')
            .where({id})
            .delete()
    }

}

module.exports = CampaignsService;