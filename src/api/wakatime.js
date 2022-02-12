const moment = require("moment");
const retrieve = function () {
    let obj = {
        "_id": "6202570a4d7599965c02fcd4",
        "date": "2022-02-08T00:00:00.000Z",
        "total": 244941.749,
        "average": 14408,
        "editors": [
            {"name": "IntelliJ", "total": 243381.668},
            {"name": "WebStorm", "total": 1560.081}
        ],
        "languages": [
            {"name": "Java", "total": 202298.146},
            {"name": "Groovy", "total": 10769.792},
            {"name": "textmate", "total": 7484.774},
            {"name": "Makefile", "total": 6293.115},
            {"name": "XML", "total": 3207.236},
            {"name": "Python", "total": 3165.922},
            {"name": "Scala", "total": 2921.201},
            {"name": "Vue.js", "total": 1560.081},
            {"name": "GitIgnore file", "total": 1302.221},
            {"name": "CSV/TSV", "total": 1286.695},
            {"name": "sbt", "total": 1072.651},
            {"name": "HTML", "total": 932.442},
            {"name": "Markdown", "total": 860.877},
            {"name": "Properties", "total": 753.077},
            {"name": "JSON", "total": 445.269},
            {"name": "Text", "total": 300.632},
            {"name": "YAML", "total": 154.288},
            {"name": "Shell Script", "total": 126.105},
            {"name": "Batchfile", "total": 6.685},
            {"name": "IDEA_MODULE", "total": 0.54}
        ]
    }

    obj['date'] = moment(obj.date).toDate();

    return obj
}

module.exports = {
    retrieve
}