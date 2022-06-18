const {BASE_URL} = require("@/api/settings");

const retrieve = async function () {
    return await fetch(`${BASE_URL}/api/v1/github`)
        .then((res) => {
            return res.json()
        })
        .catch((e) => console.error(e))
}

module.exports = {
    retrieve
}