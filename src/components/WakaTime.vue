<template>
  <div class="content article-body">
    <nav class="level box">
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
    </nav>
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <vue-c3 :handler="editorChartHandler" id="editor-chart"></vue-c3>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <vue-c3 :handler="langChartHandler" id="lang-chart"></vue-c3>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueC3 from 'vue-c3'
import wakatime from "@/api/wakatime";
import ColorScheme from 'color-scheme';
// import moment from "moment";

const scheme = new ColorScheme();


export default {
  name: "WakaTime",
  props: {
    content: String
  },
  components: {
    VueC3
  },
  data() {
    return {
      editorChartHandler: new Vue(),
      langChartHandler: new Vue(),
      wakaData: {}
    }
  },
  computed: {
    totalTime: function() {
       return this.wakaData.total / 3600
    },
    avgTime: function() {
      return this.wakaData.average / 3600
    },
  },
  created() {
    this.wakaData = wakatime.retrieve()
  },
  methods: {
    makeChart: function(columnData, handler, scheme) {
      const options = {
        size: {
          height: 200,
        },
        data: {
          columns: columnData,
          type: 'donut',
          empty: {
            label: {
              text: "No Data Available"
            }
          }
        },
        color: {
          pattern: scheme.colors().map(e => '#' + e)
        },
        donut: {
          label: {
            show: false,
          },
        },
        legend: {
          show: true
        },
      }
      handler.$emit('init', options);
    },
    round: function (num, d) {
      const m = Math.pow(10, d)
      return Math.floor(num * m) / m;
    },
  },
  mounted() {
    const editors = this.wakaData.editors.reduce((a, b) => [... a, [b.name, b.total]], [])
    const editorScheme = scheme.from_hex('00faff').scheme('contrast');
    this.makeChart(editors, this.editorChartHandler, editorScheme);

    let langs = this.wakaData.languages.reduce((a, b) => [... a, [b.name, b.total]], [])
    langs.sort((a, b) => b[1] > a[1] ? 1 : -1)
    langs = langs.slice(0, Math.min(5, langs.length))
    const langScheme = scheme.from_hex('cb21ff').scheme('contrast');
    this.makeChart(langs, this.langChartHandler, langScheme);
  }
}
</script>

<style scoped>

</style>