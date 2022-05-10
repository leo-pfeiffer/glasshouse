const retrieve = async function () {
    let obj = await fetch("https://glasshouse-341514.nw.r.appspot.com/api/v1/github")
        .then((res) => {
            return res.json()
        })
        .catch((e) => console.error(e))
    return obj
}

module.exports = {
    retrieve
}