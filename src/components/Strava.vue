<template>
  <div class="content article-body">

    <div class="box">
      <div class="level">
        <div class="level-item has-text-centered">
          <button class="button is-primary is-normal"
                  v-bind:class="{'is-outlined': buttonActive[0]}"
                  @click="() => {update(7); toggleButton(0)}">7D</button>
        </div>
        <div class="level-item has-text-centered">
          <button class="button is-primary is-normal"
                  v-bind:class="{'is-outlined': buttonActive[1]}"
                  @click="() => {update(14); toggleButton(1)}">14D</button>
        </div>
        <div class="level-item has-text-centered">
          <button class="button is-primary is-normal"
                  v-bind:class="{'is-outlined': buttonActive[2]}"
                  @click="() => {update(30); toggleButton(2)}">1M</button>
        </div>
      </div>
      <hr>
      <div class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading"># Workouts</p>
            <p class="title">{{ workouts.length }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Total Time (hrs)</p>
            <p class="title">{{ round(totalWorkoutTime / 60, 1) }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Max Heart Rate</p>
            <p class="title">{{ maxBPM }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="box">
        <apexchart type="line" width="100%" height="250"
                   :options="chartOptions"
                   :series="workoutTsData"
                   :categories="chartOptions.xaxis.categories">
        </apexchart>
    </div>

    <div class="scrolling-wrapper-flexbox box">

      <div class="scrolling-wrapper-card box" v-for="(w, i) in workouts" v-bind:key="i">

        <p class="title is-6 py-2">{{ w.name }}</p>
        <p class="subtitle is-6 py-1">{{ w.start_date.toISOString().slice(0,10) }}</p>

        <table class="table is-striped">
          <tbody>
          <tr>
            <td>Duration (min)</td>
            <td>{{ round(w["duration"], 1) }}</td>
          </tr>
          <tr>
            <td>Avg BPM</td>
            <td>{{ round(w["avg_hr"], 0) }}</td>
          </tr>
          <tr>
            <td>Max BPM</td>
            <td>{{ round(w["max_hr"], 0) }}</td>
          </tr>
          <tr v-if="w['distance'] > 0">
            <td>Distance (km)</td>
            <td>{{ round(w['distance'] / 1000, 1) }}</td>
          </tr>
          </tbody>
        </table>

      </div>
    </div>

  </div>

</template>

<script>
import strava from "@/api_client/strava";

export default {
  name: "Strava",
  props: {
    content: String
  },
  data() {
    return {
      workouts: [],
      workoutTsData: [],
      buttonActive: [false, true, true],

      chartOptions: {
        chart: {
          type: 'line',
          stackType: '100%'
        },
        stroke: {
          width: 2,
          curve: 'straight'
        },
        xaxis: {
          categories: [],
          type: 'datetime',
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return (val).toFixed(0);
            },
          },
          title: {
            text: 'Duration (mins)'
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return (val).toFixed(0)
            }
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 0
        },
        theme: {
          palette: 'palette10',
        },
        title: {text: 'Workouts'},
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },

      },
    };
  },
  computed: {
    totalWorkoutTime: function () {
      return strava.getTotalWorkoutTime(this.workouts)
    },
    maxBPM: function () {
      return strava.getMaxBPM(this.workouts)
    },
  },
  created() {
    this.update(7)
  },
  methods: {
    update: async function (days) {
      const newWorkouts = await strava.retrieve(days)
      while (this.workouts.length !== 0) {
        this.workouts.pop()
      }
      for (let w of newWorkouts) {
        this.workouts.push(w)
      }

      const workoutTs = strava.getDurationTimeSeries(this.workouts);
      this.workoutTsData = [{
        name: "Duration (min)",
        data: workoutTs.map(e => [+e["date"], e["duration"]])
      }]
    },
    toggleButton: function(idx) {
      this.buttonActive = this.buttonActive.map(() => true)
      this.buttonActive[idx] = false
    },
    round: function (num, d) {
      const m = Math.pow(10, d)
      return Math.floor(num * m) / m;
    }
  },
}
</script>

<style scoped>

.scrolling-wrapper-flexbox {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;

  /* Hide scrollbar */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Hide scrollbar, safari, chrome, opera*/
.scrolling-wrapper-flexbox::-webkit-scrollbar {
  display: none;
}

.scrolling-wrapper-card {
  flex: 0 0 auto;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

</style>