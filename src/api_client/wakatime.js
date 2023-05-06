const retrieve = async function () {
    let obj = await fetch("/api/v1/wakatime")
        .then(res => res.json())
        .catch(() => {})

    obj['date'] = new Date(obj.date)

    return obj
}

module.exports = {
    retrieve
}