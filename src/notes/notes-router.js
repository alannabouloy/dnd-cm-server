const express = require('express')
const NotesService = require('./notes-service')
const helpers = require('../helpers')
const path = require('path')
const CampaignsService = require('../campaigns/campaigns-service')
const { requireAuth } = require('../middleware/jwt-auth')


const userNotesRouter = express.Router()
const notesRouter = express.Router()
const jsonParser = express.json()

userNotesRouter
    .route('/:campaign_id')
    .all(requireAuth)
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
                
                NotesService.getAllNotesByCampaign(knexInstance, campId)
                .then(notes => {
                    res.notes = notes
                    next()
                })
                .catch(next)
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.notes)
    })
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const campaign = req.params.campaign_id
        const admin = req.user.id
        const {
            note_title,
            note_content,
            private_note = false,
        } = req.body
        const newNote = {
            admin,
            note_title,
            note_content,
            private_note,
            campaign
        }

        let error = ''

        error = helpers.validateKeys(newNote, ['admin', 'note_title', 'note_content'])
        if(error){
            return res
                .status(400)
                .json(error)
        }

        error = helpers.validateType(admin, 'number', 'admin')
        if(error){
            return res 
                .status(400)
                .json(error)
        }
        error = helpers.validateType(note_title, 'string', 'note_title')
        if(error){
            return res
                .status(400)
                .json(error)
        }
        error = helpers.validateStringLength(note_title, 4, 'note_title')
        if(error){
            return res
                .status(400)
                .json(error)
        }
        error = helpers.validateType(note_content, 'string', 'note_content')
        if(error){
            return res
                .status(400)
                .json(error)
        }

        if(private_note){
            error = helpers.validateType(private_note, 'boolean', 'private_note')
            if(error){
                return res
                    .status(400)
                    .json(error)
            }
        }

        NotesService.addNote(knexInstance, newNote)
            .then(note => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${note.id}`))
                    .json(note)
            })

    })

userNotesRouter 
    .route('/:campaign_id/:note_id')
    .all(requireAuth)
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        const campId = req.params.campaign_id
        const noteId = req.params.note_id
        CampaignsService.getCampaignById(knexInstance, campId)
            .then(campaign => {
                if(!campaign){
                    return res
                        .status(404)
                        .json({error: {message: `Campaign Not Found`}})
                }

                NotesService.getNoteById(knexInstance, campId, noteId)
                    .then(note => {
                        if(!note){
                            return res
                                .status(404)
                                .json({error: {message: `Note Not Found`}})
                        }
                        res.note = note
                        next()
                    })
                    .catch(next)
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.note)
    })
    .delete((req, res, next) => {
        const knexInstance = req.app.get('db')
        const campId = req.params.campaign_id
        const noteId = req.params.note_id
        const userId = req.user.id

        NotesService.deleteNote(knexInstance, campId, noteId)
            .then(() => {
                res
                    .status(204)
                    .end()
            })
    })
    .patch(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const campId = req.params.campaign_id
        const noteId = req.params.note_id
        const userId = req.user.id

        const {
            note_title,
            note_content,
            private_note
        } = req.body

        const updateNoteFields = {
            note_title,
            note_content, 
            private_note,
        }

        const numOfValues = Object.values(updateNoteFields).filter(Boolean).length
        if(numOfValues === 0 ){
            return res
                .status(400)
                .json({error: {message: `Invalid Request: body must include a field to update`}})
        }

        let error = ''

        if(note_title){
            error = helpers.validateType(note_title, 'string', 'note_title')
            if(error){
                return res
                    .status(400)
                    .json(error)
            }
            error = helpers.validateStringLength(note_title, 3, 'note_title')
            if(error){
                return res
                    .status(400)
                    .json(error)
            }
        }

        if(note_content){
            error = helpers.validateType(note_content, 'string', 'note_content')
            if(error) {
                return res
                    .status(400)
                    .json(error)
            }
        }

        if(private_note){
            error = helpers.validateType(private_note, 'boolean', 'private_note')
            if(error){
                return res
                    .status(400)
                    .json(error)
            }
        }

        NotesService.updateNote(knexInstance, campId, noteId, updateNoteFields)
            .then(() => {
                res
                    .status(204)
                    .end()
                })

    })
notesRouter 
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
                
                NotesService.getAllNotesByCampaign(knexInstance, campId)
                .then(notes => {
                    res.notes = notes
                    next()
                })
                .catch(next)
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.notes)
    })

notesRouter
    .route('/:campaign_id/:note_id')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        const campId = req.params.campaign_id
        const noteId = req.params.note_id
        CampaignsService.getCampaignById(knexInstance, campId)
            .then(campaign => {
                if(!campaign){
                    return res
                        .status(404)
                        .json({error: {message: `Campaign Not Found`}})
                }

                NotesService.getNoteById(knexInstance, campId, noteId)
                    .then(note => {
                        if(!note){
                            return res
                                .status(404)
                                .json({error: {message: `Note Not Found`}})
                        }
                        res.note = note
                        next()
                    })
                    .catch(next)
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.note)
    })

module.exports = {
    userNotesRouter,
    notesRouter
}