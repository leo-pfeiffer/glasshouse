const axios = require("axios")
const {csvToJson} = require("../../utils/parse-csv");

const FLIGHT_URL = "https://docs.google.com/spreadsheets/d/1-7bMwK4Bat-viQvHGsy-IQ2ovzuUeIF1Qpi0SD3yR9E/export?format=csv"
const AIRPORT_URL = "https://www.airport-data.com/api/ap_info.json?iata="

const getFlights = function() {
    return axios.get(FLIGHT_URL, { responseType: 'blob'})
        .then((res) => res.data)
        .then((res) => csvToJson(res))
        .then((csv) => console.log(csv))
        .catch((err) => console.error(err))
}

const getAirportData = function(iataCode) {
    return axios.get(AIRPORT_URL + iataCode)
        .then((res) => res.data)
        .then((json) => console.log(json))
        .catch((err) => console.error(err))
}

getFlights()
getAirportData("EDI")