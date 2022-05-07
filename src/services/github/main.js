const axios = require("axios")

const getStats = function() {
    const url = "https://github-stats-rest.vercel.app/api?username=leo-pfeiffer&count_private=true&show_icons=true"
    return axios.get(url)
        .then((res) => res.data)
        .catch((err) => console.error(err))
}

const getLangs = function() {
    const url = "https://github-stats-rest.vercel.app/api/top-langs/?username=leo-pfeiffer&layout=compact&hide=Jupyter%20Notebook,html&exclude_repo=Functional-Programming-in-Scala"
    return axios.get(url)
        .then((res) => res.data)
        .catch((err) => console.error(err))
}

/**
 * Read wakatime entries from API or cache.
 * */
const read = async function() {
    const stats = await getStats();
    const langs = await getLangs();
    return {
        ...stats, ...langs
    }
}

module.exports = {
    read: read
};
