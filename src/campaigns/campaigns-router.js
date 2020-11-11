const express = require('express')
const CampaignsService = require('./campaigns-service')
const helpers = require('../helpers')
const path = require('path')
const UsersService = require('../users/users-service')

const userCampaignsRouter = express.Router()
const jsonParser = express.json()

userCampaignsRouter
    .route('/:user_id/campaigns')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        const id = req.params.user_id
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
        const id = req.params.user_id
        CampaignsService.getAllCampaignsByAdmin(knexInstance, id)
            .then(campaigns => {
                res
                    .json(campaigns)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const admin = req.params.user_id
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
        error = ''
        error = helpers.validateStringLength(campaign_name, 4, "campaign_name")
        if(error){
            return res
                .status(400)
                .json(error)
        }

        CampaignsService.addCampaign(knexInstance, newCampaign)
            .then(campaign => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${campaign.id}`))
                    .json(campaign)
            })
    })

module.exports = userCampaignsRouter