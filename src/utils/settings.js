// set the API url depending on the environment
// const API_URL = process.env.VUE_APP_DEV_API_URL
const API_URL = process.env.NODE_ENV === "development" ? process.env.VUE_APP_DEV_API_URL : process.env.VUE_APP_API_URL
module.exports = {
    API_URL: API_URL
}
