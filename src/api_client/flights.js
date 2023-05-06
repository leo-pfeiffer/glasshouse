const retrieve = async function () {
    return await fetch("/api/v1/flights")
        .then((res) => {
            return res.json()
        })
        .catch((e) => console.error(e))
}

module.exports = {
    retrieve
}