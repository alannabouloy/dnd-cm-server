const AuthService = {
    getUserWithUserName(db, username){
        return db('blogful_users')
            .where({ username })
            .first()
    },
    parseBasicToken(token){
        return Buffer
            .from(token, 'base64')
            .toString()
            .split(':')
    },
}

module.exports = AuthService