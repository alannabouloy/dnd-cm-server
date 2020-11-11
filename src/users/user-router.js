const express = require('express')
const UsersService = require('./users-service')
const helpers = require('../helpers')
const path = require('path')

const usersRouter = express.Router()
const jsonParser = express.json()

usersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        UsersService.getAllUsers(knexInstance)
            .then(users => {
                res.json(users)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const {
            username, 
            user_password, 
            first_name,
            last_name,
            email
        } = req.body

        const newUser = {
            username,
            user_password,
            first_name,
            last_name,
            email
        }

        const keys = Object.keys(newUser)

        let error = helpers.validateKeys(newUser, keys)
        if(error){
            return res
                .status(400)
                .json(error)
        }
        error = ''
        error = helpers.validateStringLength(username, 6, "username")
        if(error){
            return res
                .status(400)
                .json(error)
        }
        error = ''
        error = helpers.validateStringLength(user_password, 8, "user_password")
        if(error){
            return res
                .status(400)
                .json(error)
        }
        error = ''
        error = helpers.validateStringLength(first_name, 2, "first_name")
        if(error){
            return res
                .status(400)
                .json(error)
        }
        error = ''
        error = helpers.validateStringLength(last_name, 2, "last_name")
        if(error){
            return res
                .status(400)
                .json(error)
        }
        error = ''
        error = helpers.validateEmail(email)
        if(error){
            return res
                .status(400)
                .json(error)
        }

        UsersService.addUser(knexInstance, newUser)
            .then(user => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                    .json(user)
            })
    })

module.exports = usersRouter