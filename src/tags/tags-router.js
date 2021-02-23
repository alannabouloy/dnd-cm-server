const express = require('express')
const TagsService = require('./tags-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')
const xss = require('xss')
const helpers = require('../helpers')
const NotesService = require('../notes/notes-service')

const tagsRouter = express.Router()
const jsonParser = express.json()

function sanitizeTag(tag){
    tag = {
        ...tag,
        tag_name: xss(tag.tag_name),
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
    .post(jsonParser, async(req, res, next) => {
        const db = req.app.get('db')
        const { tag_name, note } = req.body
        const admin = req.user.id
        let newTag = {
            tag_name,
            note,
            admin
        }
        //needs to validate that 'name' and 'noteId' are included and valid
        try {
            let error = ''

            error = helpers.validateKeys(newTag, [
                'tag_name',
                'note',
                'admin',
            ])

            if(error){
                return res.status(400).json(error)
            }

            error = helpers.validateType(tag_name, 'string')
            
            if(error){
                return res.status(400).json(error)
            }

            error = helpers.validateType(note, 'number')
            if(error){
                return res.status(400).json(error)
            }
            
            error = helpers.validateType(admin, 'number')
            if(error){
                return res.status(400).json(error)
            }

            const hasNote =  await NotesService.getNoteById(db, note)

            if(!hasNote){
                return res
                    .status(404)
                    .json({error: 'Note Not Found'})
            }

            newTag = sanitizeTag(newTag)

            const added = await TagsService.addNewTag(db, admin, newTag)

            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${added.id}`))
                .json(added)
            next()
        } catch(error){
            next(error)
        }
    })

    tagsRouter
        .route('/:tagId')
        .all(async (req, res, next) => {
           const db = req.app.get('db')
           const tagId = req.params.tagId
           try{
               const tag = await TagsService.getTagById(db, tagId)
               if(!tag){
                   return res
                    .status(404)
                    .json({error: 'Tag Not Found'})
               }

               req.tag = tag
               next()
           } catch(error){
               next(error)
           } 
        })
        .get(async(req, res, next) => {
            const db = req.app.get('db')
            const userId = req.tag.admin
            const tag = req.tag
            try {
                const notes = await TagsService.getAllNotesWithTag(db, userId, tag.tag_name)
                const result = {
                    tag,
                    notes: notes
                }

                res
                    .json(result)
            }catch(error){
                next(error)
            }
        })
        .delete()