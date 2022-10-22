const moment = require("moment");
const {API_URL} = require("@/utils/settings");

const retrieve = async function () {
    let obj = await fetch(`${API_URL}/api/v1/wakatime`)
        .then(res => res.json())
        .catch(() => {})

    obj['date'] = moment(obj.date).toDate();

    return obj
}

module.exports = {
    retrieve
}