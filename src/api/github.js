const {API_URL} = require("@/utils/settings");

const retrieve = async function () {
    return await fetch(`${API_URL}/api/v1/github`)
        .then((res) => {
            return res.json()
        })
        .catch((e) => console.error(e))
}

module.exports = {
    retrieve
}