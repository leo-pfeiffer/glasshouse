<template>
  <div class="content article-body">
    <div class="level box is-mobile">
      <p>{{ flightData }}</p>
    </div>
  </div>
</template>

<script>
import flights from "@/api_client/flights";

export default {
  name: "Flights",
  props: {
    content: String
  },
  data() {
    return {
      flightData: {},
    }
  },
  computed: {
  },
  methods: {
  },
  async mounted() {
    this.flightData = await flights.retrieve();
  }
}
</script>

<style scoped>

</style>