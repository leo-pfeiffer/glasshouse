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
          <p class="title">123</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Daily Average (hrs)</p>
          <p class="title">123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
// import VueC3 from 'vue-c3'
// import wakatime from "@/api/wakatime";
import github from "@/api/github";
// import ColorScheme from 'color-scheme';
// const scheme = new ColorScheme();


export default {
  name: "WakaTime",
  props: {
    content: String
  },
  // components: {
  //   VueC3
  // },
  data() {
    return {
      editorChartHandler: new Vue(),
      langChartHandler: new Vue(),
      wakaData: {},
      available: false,
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
  async mounted() {
    const data = await github.retrieve()
    console.log(data)
    // if (Object.keys(data).length > 0) {
    //   this.wakaData = data
    //   this.available = true
    //
    //   const editors = this.wakaData.editors.reduce((a, b) => [... a, [b.name, b.total]], [])
    //   const editorScheme = scheme.from_hex('00faff').scheme('contrast');
    //   this.makeChart(editors, this.editorChartHandler, editorScheme);
    //
    //   let langs = this.wakaData.languages.reduce((a, b) => [... a, [b.name, b.total]], [])
    //   langs.sort((a, b) => b[1] > a[1] ? 1 : -1)
    //   langs = langs.slice(0, Math.min(5, langs.length))
    //   const langScheme = scheme.from_hex('cb21ff').scheme('contrast');
    //   this.makeChart(langs, this.langChartHandler, langScheme);
    // }
  }
}
</script>

<style scoped>

</style>