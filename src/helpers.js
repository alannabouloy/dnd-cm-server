const helpers = {
    validateKeys(object, keyArr){
        let error = ''
        for(let i = 0; i < keyArr.length; i++){
            if(!object[keyArr[i]]){
                error = {error: {message: `Request body must include a '${keyArr[i]}' value`}}
                break
            }
        }
        return error
    },

    validateStringLength(string, length, key){
        if(string.length < length){
            return {error: {message: `'${key}' must be at least ${length} characters in length`}}
        }
    },
    validateEmail(email){
        const mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if(!email.match(mailFormat)){
            return {error: {message: `Request body must include a valid email address`}}
        }
    }
}

module.exports = helpers