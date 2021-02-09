const express = require('express')
const CampaignsService = require('./campaigns-service')
const helpers = require('../helpers')
const path = require('path')
const UsersService = require('../users/users-service')
const {requireAuth} = require('../middleware/jwt-auth')
const xss = require('xss')



const userCampaignsRouter = express.Router()
const jsonParser = express.json()
const campaignsRouter = express.Router()

function serializeCampaign(campaign) {
    campaign = {
        ...campaign,
        campaign_name: xss(campaign.campaign_name),
        camp_desc: xss(campaign.camp_desc)
    }

    return campaign
}

//userCampaignsRouter is protected endpoint and fetches campaigns associated with specific user
userCampaignsRouter
    .route('/')
    .all(requireAuth)
    .all( async (req, res, next) => {
        const db = req.app.get('db')
        const id = req.user.id
        try {
            //get user from database
            const user = await UsersService.getUserById(db, id)

            if(!user) {
                return res 
                    .status(404)
                    .json({
                        error: `User Not Found`
                    })
            }
            req.user = user
            next()

        } catch(error){
            next(error)
        }
    })
    .get( async (req, res, next) => {
        const db = req.app.get('db')
        const id = req.user.id
        
        try{
            //get campaigns from database
            const campaigns = await CampaignsService.getAllCampaignsByAdmin(db, id)
            res
                .json(campaigns)

            next()
        } catch(error){
            next(error)
        }
    })
    .post(jsonParser, async (req, res, next) => {
        const db = req.app.get('db')
        const admin = req.user.id

        try{
            const {campaign_name, players = 1, active = true, private_campaign = false, camp_desc = '' } = req.body
            const newCampaign = {
                campaign_name,
                players: parseInt(players),
                active,
                private_campaign,
                camp_desc,
                admin
            }

            //key validation

            if(!campaign_name){
                return res
                    .status(400)
                    .json({error: {message: `Request body must include a 'campaign_name' value`}})
            }
            errorMessage = ''
            errorMessage = helpers.validateMinStringLength(campaign_name, 4, "campaign_name")
            if(errorMessage){
                return res
                    .status(400)
                    .json(errorMessage)
            }
            errorMessage = helpers.validateType(campaign_name, 'string', 'campaign_name')
            if(errorMessage){
                return res
                    .status(400)
                    .json(errorMessage)
            }

            if(players){
                errorMessage = helpers.validateType(parseInt(players), 'number', 'players')
                if(errorMessage){
                    return res
                        .status(400)
                        .json(errorMessage)
                }
            }

            if(active){
                errorMessage = helpers.validateType(active, 'boolean', 'active')
                if(errorMessage){
                    return res
                        .status(400)
                        .json(errorMessage)
                }
            }

            if(private_campaign){
                errorMessage = helpers.validateType(private_campaign, 'boolean', 'private_campaign')
                if(errorMessage){
                    return res
                        .status(400)
                        .json(errorMessage)
                }
            }

            if(camp_desc){
                errorMessage = helpers.validateType(camp_desc, 'string', 'camp_desc')
                if(errorMessage){
                    return res
                        .status(400)
                        .json(errorMessage)
                }
            }

            const campaign = await CampaignsService.addCampaign(db, newCampaign)

            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${campaign.id}`))
                .json(serializeCampaign(campaign))

            next()

        }catch(error){
            next(error)
        }
    })

userCampaignsRouter
    .route('/:campaign_id')
    .all(requireAuth)
    .all( async(req, res, next) => {
        const db = req.app.get('db')
        const userId = req.user.id
        const campId = req.params.campaign_id

        try {
            const user = await UsersService.getUserById(db, userId)

            if(!user){
                return res
                    .status(404)
                    .json({error: `User Not Found`})
            }

            const campaign = await CampaignsService.getUserCampaignById(db, userId, campId)

            if(!campaign){
                return res 
                    .status(404)
                    .json({error: `Campaign Not Found`})
            }

            req.campaign = campaign
            next()

        } catch(error){
            next(error)
        }
    })
    .get((req, res, next) => {
        try {
            res.json(serializeCampaign(req.campaign))
            next()
        } catch(error){
            next(error)
        }
    })
    .delete( async (req, res, next) => {
        const db = req.app.get('db')
        const adminId = req.user.id
        const campId = req.params.campaign_id
        try {
            await CampaignsService.deleteUserCampaign(db, adminId, campId)
            res
                .status(204)
                .end()

            next()
        }catch(error){
            next(error)
        }
    })
    .patch(jsonParser, async (req, res, next) => {
        const db = req.app.get('db')
        const userId = req.user.id
        const campId = req.params.campaign_id
        const {campaign_name, active, private_campaign, players, camp_desc} = req.body
        const updateCampaignFields = {
            campaign_name,
            active,
            private_campaign,
            players,
            camp_desc
        }

        try {
            const numOfValues = Object.values(updateCampaignFields).filter(Boolean).length
            if(numOfValues === 0){
                return res
                    .status(400)
                    .json({error: {message: `Request body must include a field to update`}})
            }
            let error = ''

            if(campaign_name){
                error = helpers.validateType(campaign_name, 'string', 'campaign_name')
                if(error){
                    return res
                        .status(400)
                        .json(error)
                }
                error = helpers.validateMinStringLength(campaign_name, 4, 'campaign_name')
                if(error){
                    return res
                        .status(400)
                        .json(error)
                }
            }
            if(active){
                error = helpers.validateType(active, 'boolean', 'active')
                if(error){
                    return res
                        .status(400)
                        .json(error)
                }
            }

            if(players){
                error = helpers.validateType(players, 'number', 'players')
                if(error){
                    return res
                        .status(400)
                        .json(error)
                }
            }

            if(private_campaign){
                error = helpers.validateType(private_campaign, 'boolean', 'private_campaign')
                if(error){
                    return res
                        .status(400)
                        .json(error)
                }
            }

            if(camp_desc){
                error = helpers.validateType(camp_desc, 'string', 'camp_desc')
                if(error){
                    return res
                        .status(400)
                        .json(error)
                }
            }

            await CampaignsService.updateUserCampaign(db, userId, campId, updateCampaignFields)

            res 
                .status(204)
                .end()

            next()
        } catch(error){
            next(error)
        }
    })

//campaignsRouter is not a protected endpoint and will fetch all public campaigns in database regardless of user
campaignsRouter
    .route('/')
    .get(async (req, res, next) => {
        const db = req.app.get('db')

        try{
            let campaigns = await CampaignsService.getAllCampaigns(db)
            campaigns = campaigns.map(campaign => serializeCampaign(campaign))
            res.json(campaigns)
            next()
        } catch(error){
            next(error)
        }
    })

campaignsRouter
    .route('/:campaign_id')
    .all(async (req, res, next) => {
        const db = req.app.get('db')
        const campId = req.params.campaign_id

        try {
            const campaign = await CampaignsService.getCampaignById(db, campId)
            
            if(!campaign){
                return res
                    .status(404)
                    .json({error: `Campaign Not Found`})
            }
            req.campaign = campaign
            next()
        } catch(error){
            next(error)
        }
    })
    .get((req, res, next) => {
        try{
            res
                .json(serializeCampaign(req.campaign))
            next()
        } catch(error){
            next(error)
        }
       
    })


module.exports = { userCampaignsRouter, campaignsRouter}