<template>
  <div class="content article-body">

    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <vue-c3 :handler="handler" id="chart"></vue-c3>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <div class="level is-mobile">
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

          <table class="table is-striped">
            <tbody>
            <tr>
              <td># Workouts</td>
              <td>{{ workouts.length }}</td>
            </tr>
            <tr>
              <td>Total Time (min)</td>
              <td>{{ totalWorkoutTime }}</td>
            </tr>
            <tr>
              <td>Max Heart Rate</td>
              <td>{{ maxBPM }}</td>
            </tr>
            </tbody>
          </table>

        </article>
      </div>
    </div>

    <div class="hooper-wrapper">
      <hooper :settings="hooperSettings" style="height: 100%">
        <slide v-for="w in workouts" v-bind:key="w.start.toString()">
          <div class="box slider-box">

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
        </slide>
        <hooper-navigation slot="hooper-addons"></hooper-navigation>
      </hooper>
    </div>
  </div>

</template>

<script>
import Vue from 'vue'
import VueC3 from 'vue-c3'
import {
  Hooper,
  Slide,
  Navigation as HooperNavigation
} from 'hooper';
import 'hooper/dist/hooper.css';
import fitness from "@/api/fitness";
import ColorScheme from 'color-scheme';
import moment from "moment";

const scheme = new ColorScheme();
scheme.from_hex('000cff').scheme('contrast');

export default {
  name: "Fitness",
  components: {
    Hooper,
    Slide,
    HooperNavigation,
    VueC3
  },
  props: {
    content: String
  },
  data() {
    return {
      hooperSettings: {
        itemsToShow: 1.5,
        centerMode: false,
      },
      workouts: [],
      handler: new Vue(),
      buttonActive: [true, true, false]
    };
  },
  computed: {
    proportions: function () {
      return fitness.getWorkoutProportions(this.workouts);
    },
    totalWorkoutTime: function () {
      return fitness.getTotalWorkoutTime(this.workouts)
    },
    maxBPM: function () {
      return fitness.getMaxBPM(this.workouts)
    },
  },
  created() {
    this.update(30)
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
      this.makeChart();
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
    makeChart: function() {
      const options = {
        size: {
          height: 200,
        },
        data: {
          columns: Object.entries(this.proportions),
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
      this.handler.$emit('init', options);
    }
  },
  mounted() {
    this.makeChart();
  }
}
</script>

<style scoped>

.slider-box {
  height: 90%;
  margin-left: 0.5em;
  margin-right: 0.5em;
}


</style>