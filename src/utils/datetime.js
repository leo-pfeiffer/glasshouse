const getToday = function() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

module.exports = {
    getToday
}