const VUE_APP_BASE_URL = "https://glasshouse.netlify.app"
// const BASE_URL = "http://localhost:8888"
// const VUE_APP_BASE_URL = process.env.VUE_APP_BASE_URL

console.log("HARD CODED", VUE_APP_BASE_URL)
console.log("BASE_URL", process.env.BASE_URL)

module.exports = {
    BASE_URL: VUE_APP_BASE_URL
}
