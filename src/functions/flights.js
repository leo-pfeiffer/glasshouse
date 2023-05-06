const {getFlights, getAirportData} = require("../api_services/flights/main");
const {cors_headers} = require("../utils/cors");
const {withCache, setCache} = require("../utils/redis-cache");

const flights = async (event, context) => {

    const rawFlights = await getFlights()

    // Some airport codes the API uses are incorrect. Fix them here.
    const airportOverride = new Map();
    airportOverride.set("BER", "SXF")

    rawFlights.map(flight => {
        const origin = flight["Origin"];
        if (airportOverride.has(origin)) {
            flight["Origin"] = airportOverride.get(origin)
        }
        const dest = flight["Destination"];
        if (airportOverride.has(dest)) {
            flight["Destination"] = airportOverride.get(dest)
        }
        return flight
    })

    const uniqueAirports = Array.from(
        rawFlights
            .reduce((acc, cur) => {
                acc.add(cur["Origin"], cur["Destination"])
                return acc
            }, new Set())
    );

    const airportData = await Promise.all(uniqueAirports.map(airportCode => getAirportData(airportCode)))
        .then((values) => {
            return values
        })
        .then((airportCodes) => airportCodes.reduce((acc, cur) => {
            if (cur !== undefined) {
                const airport = cur['iata'];
                acc[airport] = cur
            }
            return acc;
        }, {}))

    const flightData = rawFlights
        .map(flight => {
            const origin = flight['Origin'];
            const destination = flight['Destination'];
            if (origin in airportData) {
                flight['Origin'] = airportData[origin]
            }
            if (destination in airportData) {
                flight['Destination'] = airportData[flight['Destination']]
            }
            return flight
        })

    await setCache(event.rawUrl, JSON.stringify(flightData), 7200)

    return {
        statusCode: 200,
        body: JSON.stringify(flightData),
        headers: cors_headers
    }
}

module.exports.handler = (event, context) => withCache(flights)(event, context);