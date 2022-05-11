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
            <p class="heading">Total Time (min)</p>
            <p class="title">{{ totalWorkoutTime }}</p>
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
        <apexchart type="bar" width="100%" height="250" :options="chartOptions" :series="workoutData"></apexchart>
    </div>

    <div class="scrolling-wrapper-flexbox box">

      <div class="scrolling-wrapper-card box" v-for="(w, i) in workouts" v-bind:key="i">

        <p class="title is-6">{{ w.name }}</p>
        <p class="subtitle is-6">{{ getDate(w.start) }}</p>

        <table class="table is-striped">
          <tbody>
          <tr>
            <td>Min</td>
            <td>{{ w.duration }}</td>
          </tr>
          <tr>
            <td>BPM</td>
            <td>{{ round(w.avgHeartRate.qty, 0) }}</td>
          </tr>
          <tr>
            <td>MET</td>
            <td>{{ round(w.intensity.qty, 1) }}</td>
          </tr>
          </tbody>
        </table>

      </div>
    </div>

  </div>

</template>

<script>
import fitness from "@/api/fitness";
import moment from "moment";

export default {
  name: "Fitness",
  props: {
    content: String
  },
  data() {
    return {
      workouts: [],
      workoutData: [],
      buttonActive: [false, true, true],
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
        },
        title: {text: 'Workouts'}
      },
    };
  },
  computed: {
    totalWorkoutTime: function () {
      return fitness.getTotalWorkoutTime(this.workouts)
    },
    maxBPM: function () {
      return fitness.getMaxBPM(this.workouts)
    },
  },
  created() {
    this.update(7)
  },
  methods: {
    update: async function (days) {
      const newWorkouts = await fitness.retrieve(days)
      while (this.workouts.length !== 0) {
        this.workouts.pop()
      }
      for (let w of newWorkouts) {
        this.workouts.push(w)
      }

      this.workoutData = Object.entries(fitness.getWorkoutProportions(this.workouts))
          .map(e => {
            return {name: e[0], data: [e[1]]}
          })
    },
    toggleButton: function(idx) {
      this.buttonActive = this.buttonActive.map(() => true)
      this.buttonActive[idx] = false
    },
    round: function (num, d) {
      const m = Math.pow(10, d)
      return Math.floor(num * m) / m;
    },
    getDate: function (date) {
      return moment(date).format("DD-MMM-YYYY")
    },
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