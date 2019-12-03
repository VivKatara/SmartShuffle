const dotenv = require('dotenv')
dotenv.config()
module.exports = {
    spClientId: process.env.SPOTIFY_CLIENT_ID,
    spClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    spBaseUrl: process.env.SPOTIFY_BASE_URL,
    port: process.env.PORT,
    sortParams: process.env.SPOTIFY_SORTING_PARAMS,
    authToken: process.env.SPOTIFY_AUTH_TOKEN
}