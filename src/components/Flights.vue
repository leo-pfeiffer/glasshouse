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
  </div>
</template>

<script>
import flights from "@/api_client/flights";
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
      console.log(this.flightData)
      return this.flightData
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
        .map(flight => {
          const origin = flight["Origin"]
          const dest = flight["Destination"]
          return [
            [origin["latitude"], origin["longitude"]],
            [dest["latitude"], dest["longitude"]]
          ]
        })
    }
  },
  methods: {
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