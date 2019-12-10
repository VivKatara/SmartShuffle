const dotenv = require('dotenv')
dotenv.config()
module.exports = {
    port: process.env.PORT,
    sortParams: process.env.SPOTIFY_SORTING_PARAMS

}