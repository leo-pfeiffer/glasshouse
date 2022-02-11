const getDate = function(date) {
    const mm = date.getMonth() + 1; // getMonth() is zero-based
    const dd = date.getDate();

    return [date.getFullYear(),
        (mm>9 ? '' : '0') + mm,
        (dd>9 ? '' : '0') + dd
    ].join('-');
};

module.exports = {
    getDate
}