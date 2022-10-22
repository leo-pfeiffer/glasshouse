<template>
  <div class="content article-body">
    <div class="level box">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Period (dys)</p>
          <p class="title">30</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Total Time (hrs)</p>
          <p class="title">{{ round(totalTime, 1) }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Daily Average (hrs)</p>
          <p class="title">{{ round(avgTime, 1) }}</p>
        </div>
      </div>
    </div>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <apexchart type="bar" width="100%" height="200" :options="editorChartOptions" :series="wakaEditors"></apexchart>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <apexchart type="bar" width="100%" height="200" :options="langChartOptions" :series="wakaLangs"></apexchart>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import wakatime from "@/api_client/wakatime";

export default {
  name: "WakaTime",
  props: {
    content: String
  },
  components: {
  },
  data() {
    return {
      wakaData: {},
      available: false,
      wakaEditors: [],
      wakaLangs: [],
      chartOptions: {
        chart: {
          type: 'bar',
          stacked: true,
          stackType: '100%'
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        xaxis: {categories: [""],},
        tooltip: {enabled: false,},
        fill: {
          opacity: 1
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 0
        },
        theme: {
          palette: 'palette10',
        }
      },
    }
  },
  computed: {
    totalTime: function() {
       return this.wakaData.total / 3600
    },
    avgTime: function() {
      return this.wakaData.average / 3600
    },
    editorChartOptions: function() {
      const opts = Object.assign({}, this.chartOptions)
      opts['title'] = {text: 'Editors'}
      return opts
    },
    langChartOptions: function() {
      const opts = Object.assign({}, this.chartOptions)
      opts['title'] = {text: 'Languages'}
      return opts
    },
  },
  methods: {
    round: function (num, d) {
      const m = Math.pow(10, d)
      return Math.floor(num * m) / m;
    },
  },
  async mounted() {
    const data = await wakatime.retrieve()
    if (Object.keys(data).length > 0) {
      this.wakaData = data
      this.available = true

      this.wakaEditors = this.wakaData.editors
          .reduce((a, b) => [... a, Object.assign({}, {name: b.name, data: [b.total]})], [])

      this.wakaLangs = this.wakaData.languages
          .reduce((a, b) => [... a, Object.assign({}, {name: b.name, data: [b.total]})], [])
          .sort((a, b) => b.data[0] > a.data[0] ? 1 : -1)
          .slice(0, 5)
    }
  }
}
</script>

<style scoped>

</style>