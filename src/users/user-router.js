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
        error = helpers.validateStringLength(username, 6, "username")
        if(error){
            return res
                .status(400)
                .json(error)
        }
        error = helpers.validateStringLength(user_password, 8, "user_password")
        if(error){
            return res
                .status(400)
                .json(error)
        }
        error = helpers.validateStringLength(first_name, 2, "first_name")
        if(error){
            return res
                .status(400)
                .json(error)
        }
        error = helpers.validateStringLength(last_name, 2, "last_name")
        if(error){
            return res
                .status(400)
                .json(error)
        }
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

usersRouter
    .route('/:user_id')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        UsersService.getUserById(knexInstance, req.params.user_id)
            .then(user => {
                if(!user){
                    return res
                        .status(404)
                        .json({error: {message: `User Not Found`}})
                }
                res.user = user
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.user)
    })
    .delete((req, res, next) => {
        const knexInstance = req.app.get('db')
        UsersService.deleteUser(knexInstance, req.params.user_id)
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const {
            username, 
            user_password, 
            first_name, 
            last_name, 
            email
        } = req.body
        const updateUserFields = {
            username,
            user_password,
            first_name,
            last_name,
            email
        }

        const numOfValues = Object.values(updateUserFields).filter(Boolean).length
        if(numOfValues === 0){
            return res
                .status(400)
                .json({error: {message: `Request body must include a field to update`}})
        }

        let error = ''
        if(username){
            error = helpers.validateStringLength(username, 6, "username")
            if(error){
                return res
                    .status(400)
                    .json(error)
            }
        }
        if(user_password){
            error = helpers.validateStringLength(user_password, 8, "user_password")
            if(error){
                return res
                    .status(400)
                    .json(error)
            }
        }
        if(first_name){
            error = helpers.validateStringLength(first_name, 2, "first_name")
            if(error){
                return res
                    .status(400)
                    .json(error)
            }
        }
        if(last_name){
            error = helpers.validateStringLength(last_name, 2, "last_name")
            if(error){
                return res
                    .status(400)
                    .json(error)
            }
        }
        if(email){
            error = helpers.validateEmail(email)
            if(error){
                return res
                    .status(400)
                    .json(error)
            }
        }

        UsersService.updateUser(knexInstance, req.params.user_id, updateUserFields)
            .then(() => {
                res 
                    .status(204)
                    .end()
            })
    })
module.exports = usersRouter