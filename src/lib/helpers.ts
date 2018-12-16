const jwt = require('jsonwebtoken');

export function createToken (credentials: Object) {
    return jwt.sign(credentials, process.env.JWT_SECRET);
}

interface ErrorObject {
    message: string;
}
export function serviceDatabaseErrorHandler(error: ErrorObject) {
    //  TODO: Add logger for errors
    console.error({ error: true, msg: error.message });
    return Object.assign({ error: true, msg: error.message });
}

export function createRandomString(strLength: number) {

    if (strLength) {
        const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let str = '';

        for (let i = 1; i <= strLength; i++) {
            const randomChar = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
            str += randomChar;
        }
        return str;
    } else {
        return false;
    }
}