const express = require('express')
const TagsService = require('./tags-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')
const xss = require('xss')

const tagsRouter = express.Router()
const jsonParser = express.json()

function sanitizeTag(tag){
    tag = {
        ...tag,
        name: xss(tag.tag_name),
    }

    return tag
}

//tagsRouter GET and POST are protected endpoints
tagsRouter
    .route('/')
    .all(requireAuth)
    .get( async (req, res, next) => {
        //gets all unique tags based on user id and returns as single object
        const db = req.app.get('db')

        try {
            const result = await TagsService.getAllTags(db, req.user.id)
            res
                .json(result)

            next()
        } catch(error){
            next(error)
        }
    })