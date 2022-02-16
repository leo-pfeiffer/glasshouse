const getToday = function() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

const minusOneMonth = function(date) {
    date.setMonth(date.getMonth() - 1);
    return date
}

const secondsUntilEndOfDay = function() {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    return (24*60*60) - (h*60*60) - (m*60) - s;
}

module.exports = {
    getToday,
    minusOneMonth,
    secondsUntilEndOfDay
}