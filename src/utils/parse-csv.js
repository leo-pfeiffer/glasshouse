const csvToJson = function(csvStr){
    const lines = csvStr.split("\n");
    const result = [];
    const headers = lines[0].split(",").map(header => header.trim());
    for (let i=1; i < lines.length; i++){
        const obj = {};
        const line = lines[i].split(",");
        for (let j=0; j < headers.length; j++){
            obj[headers[j]] = line[j].trim();
        }
        result.push(obj);
    }
    return result;
}

module.exports = {
    csvToJson
}