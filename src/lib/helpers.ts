const jwt = require('jsonwebtoken');

export function createToken(credentials: Object) {
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


const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_MAPS_KEY,
    Promise: Promise
});

export async function getCityState(latitude: string, longitude: string) {
    // TODO Needs error handling in this method

    const locationJSON = await googleMapsClient.reverseGeocode({ latlng: [latitude, longitude] }).asPromise();
    return {
        city: locationJSON.json.results[0].address_components[0].long_name,
        state: locationJSON.json.results[0].address_components[1].short_name
    };
}