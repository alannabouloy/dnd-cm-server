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

    validateMinStringLength(string, length, key){
        if(string.length < length){
            return {error: {message: `'${key}' must be at least ${length} characters in length`}}
        }
    },
    validateMaxStringLength(string, length, key){
        if(string.length > length){
            return {error: {message: `'${key}' cannot be more than ${length} chararacters in length`}}
        }
    },
    validateEmail(email){
        const mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if(!email.match(mailFormat)){
            return {error: {message: `Request body must include a valid email address`}}
        }
    },
    validateType(value, type, key){
        if(typeof value !== type){
            return {error: {message: `Invalid request: ${key} must be a ${type}`}}
        }
    }
}

module.exports = helpers