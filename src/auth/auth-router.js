const express = require('express')
const AuthService = require('./auth-service')

const authRouter = express.Router()
const jsonBodyParser = express.json()

authRouter
    .post('/login', jsonBodyParser, (req, res, next) => {
        const { username, user_password } = req.body
        console.log('received credentials:', username, user_password)
        const loginUser = {username, user_password}

        for(const [key, value] of Object.entries(loginUser)){
            if(value == null){
                return res
                    .status(400)
                    .json({
                        error: `Missing '${key}' in request body`
                    })
            }
        }
        AuthService.getUserWithUserName(
            req.app.get('db'),
            loginUser.username
        )
        .then(dbUser => {
            if (!dbUser){
                return res
                    .status(400)
                    .json({
                        error: 'Incorrect username or password',
                    })
            }
            return AuthService.comparePasswords(loginUser.user_password, dbUser.user_password)
                .then(compareMatch => {
                    if(!compareMatch){
                        return res
                            .status(400)
                            .json({
                                error: 'Incorrect username or password',
                            })
                    }
                    const sub = dbUser.username
                    const payload = {user_id: dbUser.id}
                    const token = AuthService.createJwt(sub, payload)
                    console.log('token sent: ', token)
                    res.json({
                        authToken: token,
                    })
                })
        })
        .catch(next)
    })

module.exports = authRouter