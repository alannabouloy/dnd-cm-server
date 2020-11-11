const express = require('express')
const NotesService = require('./notes-service')
const helpers = require('../helpers')
const path = require('path')

const notesRouter = express.Router()
const jsonParser = express.json()

notesRouter
    .route('/:campaign_id/notes')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        const campId = req.params.campaign_id
        
        NotesService.getAllNotesByCampaign(knexInstance, campId)
            .then(notes => {
                res.json(notes)
            })
    })
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const campaign = req.params.campaign_id
        const {
            admin,
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

module.exports = notesRouter