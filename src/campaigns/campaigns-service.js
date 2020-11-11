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
    getUserCampaignById(knex, adminId, campId){
        return knex
            .select('*')
            .from('campaigns')
            .where('admin', adminId)
            .where('id', campId)
            .first()
    },
    getCampaignById(knex, campId){
        return knex
            .select('*')
            .from('campaigns')
            .where('id', campId)
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
    updateUserCampaign(knex, adminId, campId, updateFields){
        return knex('campaigns')
            .where({admin : adminId})
            .where({id : campId})
            .update(updateFields)
    },
    deleteUserCampaign(knex, adminId, campId){
        return knex('campaigns')
            .where({admin : adminId})
            .where({id: campId})
            .delete()
    }

}

module.exports = CampaignsService;