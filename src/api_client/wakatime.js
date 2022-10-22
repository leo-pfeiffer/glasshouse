const {API_URL} = require("@/utils/settings");

const retrieve = async function () {
    let obj = await fetch(`${API_URL}/api/v1/wakatime`)
        .then(res => res.json())
        .catch(() => {})

    obj['date'] = new Date(obj.date)

    return obj
}

module.exports = {
    retrieve
}