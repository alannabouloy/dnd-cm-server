const express = require('express')
const CampaignsService = require('./campaigns-service')
const helpers = require('../helpers')
const path = require('path')
const UsersService = require('../users/users-service')


const userCampaignsRouter = express.Router()
const jsonParser = express.json()
const campaignsRouter = express.Router()
const {requireAuth} = require('../middleware/basic-auth')

userCampaignsRouter
    .route('/')
    .all(requireAuth)
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        const id = req.user.id
        console.log('this is the user id', id)
        UsersService.getUserById(knexInstance, id)
            .then(user => {
                if(!user){
                    return res
                        .status(404)
                        .json({error: {message: `User Not Found`}})
                }
                req.user = user
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        const id = req.user.id
        CampaignsService.getAllCampaignsByAdmin(knexInstance, id)
            .then(campaigns => {
                res
                    .json(campaigns)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const admin = req.user.id
        const {campaign_name, players = 1, active = true, private_campaign = false } = req.body
        const newCampaign = {
            campaign_name,
            players,
            active,
            private_campaign,
            admin
        }
        if(!campaign_name){
            return res
                .status(400)
                .json({error: {message: `Request body must include a 'campaign_name' value`}})
        }
        errorMessage = ''
        errorMessage = helpers.validateStringLength(campaign_name, 4, "campaign_name")
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
            errorMessage = helpers.validateType(players, 'number', 'players')
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

        CampaignsService.addCampaign(knexInstance, newCampaign)
            .then(campaign => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${campaign.id}`))
                    .json(campaign)
            })
    })

userCampaignsRouter
    .route('/:campaign_id')
    .all(requireAuth)
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        const userId = req.user.id
        const campId = req.params.campaign_id
        UsersService.getUserById(knexInstance, userId)
            .then(user => {
                if(!user){
                    return res
                    .status(404)
                    .json({error: {message: `User NotFound`}})
                }
                CampaignsService.getUserCampaignById(knexInstance, userId, campId)
                    .then(campaign => {
                        if(!campaign){
                            return res
                                .status(404)
                                .json({error: {message: `Campaign Not Found`}})
                        }
                        req.campaign = campaign
                        next()
                    }) 
                    .catch(next)
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(req.campaign)
    })
    .delete((req, res, next) => {
        const knexInstance = req.app.get('db')
        const adminId = req.user.id
        const campId = req.params.campaign_id
        CampaignsService.deleteUserCampaign(knexInstance, adminId, campId)
            .then(() => {
                res
                    .status(204)
                    .end()
            })
    })
    .patch(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const userId = req.user.id
        const campId = req.params.campaign_id
        const {campaign_name, active, private_campaign, players} = req.body
        const updateCampaignFields = {
            campaign_name,
            active,
            private_campaign,
            players
        }
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
            error = helpers.validateStringLength(campaign_name, 4, 'campaign_name')
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

        CampaignsService.updateUserCampaign(knexInstance, userId, campId, updateCampaignFields)
            .then(() => {
                res
                    .status(204)
                    .end()
            })
    })

campaignsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        CampaignsService.getAllCampaigns(knexInstance)
            .then(campaigns => {
                res.json(campaigns)
            })
    })

campaignsRouter
    .route('/:campaign_id')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        const campId = req.params.campaign_id

        CampaignsService.getCampaignById(knexInstance, campId)
            .then(campaign => {
                if(!campaign){
                    return res
                        .status(404)
                        .json({error: {message: `Campaign Not Found`}})
                }
                res.campaign = campaign
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res
            .json(res.campaign)
    })


module.exports = { userCampaignsRouter, campaignsRouter}