const dotenv = require('dotenv')
dotenv.config()
module.exports = {
    spClientId: process.env.SPOTIFY_CLIENT_ID,
    spClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    spBaseUrl: process.env.SPOTIFY_BASE_URL,
    port: process.env.PORT
}