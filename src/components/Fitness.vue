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
          <p class="title">Past 14 days</p>

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
                  <p class="subtitle is-6">{{ getDate(new Date(w.start)) }}</p>

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

const scheme = new ColorScheme;
scheme.from_hex('4389A2').scheme('contrast');

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
      proportions: {},
      workoutTypes: [],
      workoutProportions: [],
      handler: new Vue(),
      totalWorkoutTime: 0,
      maxBPM: 0
    };
  },
  created() {
    this.workouts = fitness.retrieve();
    this.proportions = fitness.getWorkoutProportions(this.workouts);
    this.workoutTypes = this.getWorkoutTypes(this.proportions);
    this.workoutProportions = this.getWorkoutProportions(this.proportions);
    this.totalWorkoutTime = fitness.getTotalWorkoutTime(this.workouts);
    this.maxBPM = fitness.getMaxBPM(this.workouts);
  },
  methods: {
    getWorkoutTypes: (proportions) => {
      const types = []
      for (let type in proportions) {
        types.push(type)
      }
      return types
    },
    getWorkoutProportions: (proportions) => {
      const props = []
      for (let type in proportions) {
        props.push(proportions[type])
      }
      return props
    },
    round: (num, d) => {
      const m = Math.pow(10, d)
      return Math.floor(num * m) / m;
    },
    getDate: (date) => moment(date).format("DD-MMM-YYY"),
  },
  mounted() {
    // to init the graph call:
    const options = {
      size: {
        height: 200,
        // width: 300
      },
      data: {
        columns: Object.entries(this.proportions),
        type: 'donut',
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
      }
    }
    this.handler.$emit('init', options);
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