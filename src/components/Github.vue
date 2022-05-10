<template>
  <div class="content article-body">
    <div class="level box is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading" :title="`Commits (${year})`">
            <svg class="icon" viewBox="0 0 16 16"><path :d="icons.commits.d"/></svg>
          </p>
          <p class="title">{{ githubStats.totalCommits }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading" title="Stars">
            <svg class="icon" viewBox="0 0 16 16"><path :d="icons.star.d"/></svg>
          </p>
          <p class="title">{{ githubStats.totalStars }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading" title="Pull requests">
            <svg class="icon" viewBox="0 0 16 16"><path :d="icons.prs.d"/></svg>
          </p>
          <p class="title">{{ githubStats.totalPRs }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading" title="Issues">
            <svg class="icon" viewBox="0 0 16 16"><path :d="icons.issues.d"/></svg>
          </p>
          <p class="title">{{ githubStats.totalIssues }}</p>
        </div>
      </div>
    </div>
    <div class="box">
      <apexchart type="bar" width="100%" height="200" :options="chartOptions" :series="githubLanguages"></apexchart>
    </div>
  </div>
</template>

<script>
import github from "@/api/github";
import icons from "@/assets/icons";

export default {
  name: "WakaTime",
  props: {
    content: String
  },
  data() {
    return {
      githubStats: {totalPRs: 0, totalCommits: 0, totalIssues: 0, totalStars: 0},
      githubLanguages: [],
      available: false,

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
        title: {text: 'Top Languages'},
        xaxis: {categories: [""],},
        tooltip: {enabled: false,},
        fill: {
          opacity: 1
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 0
        }
      },
    }
  },
  computed: {
    year: function() {
      return new Date().getFullYear()
    },
    icons: function() {
      return icons;
    }
  },
  methods: {
    round: function (num, d) {
      const m = Math.pow(10, d)
      return Math.floor(num * m) / m;
    },
    processLangs: function(langs) {
      const runs = Object.entries(langs)
          .map(e => e[1])
          .sort((a, b) => b["size"] - a["size"])
      console.log(runs)

      return runs.slice(0, 5)
          .map(e => {
            return {"name": e.name, "data": [e.size]}
          })
    }
  },
  async mounted() {
    const githubData = await github.retrieve();
    this.githubStats = githubData["stats"]
    this.githubLanguages = this.processLangs(githubData["languages"])
  }
}
</script>

<style scoped>

</style>