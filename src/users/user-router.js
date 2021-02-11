const express = require('express')
const UsersService = require('./users-service')
const helpers = require('../helpers')
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')

const usersRouter = express.Router()
const jsonParser = express.json()

usersRouter
    .route('/')
    .get( async (req, res, next) => {
        const db = req.app.get('db')
        try {
            const users = await UsersService.getAllUsers(db)
            res.json(users)
            next()
        }catch(error){
            next(error)
        }
    })
    .post(jsonParser, async (req, res, next) => {
        const db = req.app.get('db')
        try {
            const {
                username, 
                user_password, 
                first_name,
                last_name,
                email
            } = req.body
    
            const keys = ["username", "user_password", "first_name", "last_name", "email"]
    
            let error = helpers.validateKeys({username, user_password, first_name, last_name, email}, keys)
            if(error){
                return res
                    .status(400)
                    .json(error)
            }
            error = helpers.validateMinStringLength(username, 6, "username")
            if(error){
                return res
                    .status(400)
                    .json(error)
            }
            error = UsersService.validatePassword(user_password)
            if(error){
                return res
                    .status(400)
                    .json(error)
            }
            error = helpers.validateMinStringLength(first_name, 2, "first_name")
            if(error){
                return res
                    .status(400)
                    .json(error)
            }
            error = helpers.validateMinStringLength(last_name, 2, "last_name")
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

            const hasUser = await UsersService.hasUserWithUsername(db, username)

            if(hasUser){
                return res
                    .status(400)
                    .json({
                        error: `Username already taken`
                    })
            }

            const hasUserWithEmail = await UsersService.hasUserWithEmail(db, email)

            if(hasUserWithEmail){
                return res
                    .status(400)
                    .json({
                        error: `A user account with this email already exists`
                    })
            }

            const hashedPassword = await UsersService.hashPassword(user_password)

            const newUser = {
                username, 
                user_password: hashedPassword,
                first_name,
                last_name,
                email
            }

            const user = await UsersService.addUser(db, newUser)

            res 
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(user)
            
            next()
        } catch(error){
            next(error)
        }          
    })

usersRouter
    .route('/:username')
    .all(requireAuth)
    .all( async (req, res, next) => {
        const db = req.app.get('db')
        try {
            const user = await UsersService.getUserById(db, req.user.id)
            
            if(!user){
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
    .get((req, res, next) => {
        res.json(req.user)
    })
    .delete( async (req, res, next) => {
        const db = req.app.get('db')

        try {
            await UsersService.deleteUser(db, req.user.id)

            res
                .status(204)
                .end

            next()
        } catch(error){
            next(error)
        }
    })
    .patch(jsonParser, async (req, res, next) => {
        const db = req.app.get('db')

        try {
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

            await UsersService.updateUser(db, req.user.id, updateUserFields)

            res
                .status(204)
                .end()

            next()
    
        } catch(error){
            next(error)
        }

    })
module.exports = usersRouter