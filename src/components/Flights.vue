<template>
  <div class="content article-body">
    <div class="box" id="map-wrapper">
      <l-map style="height: 600px" :zoom="zoom" :center="center" ref="flightMap">
        <l-tile-layer :url="url"></l-tile-layer>
        <l-feature-group>
          <l-polyline
            v-for="(f, i) in flightsLatLong"
            :lat-lngs="f"
            :key="i"
          ></l-polyline>
        </l-feature-group>
      </l-map>
    </div>
    <h2>Distance travelled: {{ Math.round(this.distanceTravelled / 1.609) }} mi</h2>
  </div>
</template>

<script>
import flights from "@/api_client/flights";
import coordinateDistance from "@/utils/distance";
import { LMap, LTileLayer, LPolyline, LFeatureGroup } from 'vue2-leaflet';

export default {
  name: "Flights",
  components: {
    LMap,
    LTileLayer,
    LPolyline,
    LFeatureGroup,
  },
  props: {
    content: String
  },
  data() {
    return {
      flightData: [],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 3,
      center: [55.953, 3.1883],
    }
  },
  computed: {
    flightsLatLong: function() {
      return this.filterValidFlights(this.flightData)
        .map(flight => {
          const origin = flight["Origin"]
          const dest = flight["Destination"]
          return [
            [origin["latitude"], origin["longitude"]],
            [dest["latitude"], dest["longitude"]]
          ]
        })
    },
    distanceTravelled: function() {
      return this.flightsLatLong
        .map(c => coordinateDistance(Number(c[0][0]), Number(c[0][1]), Number(c[1][0]), Number(c[1][1])))
        .reduce((acc, cur) => acc + cur, 0)
    }
  },
  methods: {
    filterValidFlights: function(flights) {
      return flights
        .filter(flight => {
          const origin = flight["Origin"]
          const dest = flight["Destination"]
          // todo: this is disgusting
          return (
            origin !== undefined
            && typeof origin === 'object'
            && dest !== undefined
            && typeof dest === 'object'
            && "latitude" in origin
            && "longitude" in origin
            && "latitude" in dest
            && "longitude" in dest
          )
        })
    }
  },
  async mounted() {
    this.flightData = await flights.retrieve();
  }
}
</script>

<style scoped>
#map-wrapper {
  height: calc(100% - 100px);
  margin: 0;
}
</style>