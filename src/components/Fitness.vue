<template>
<div class="content article-body">
  {{ content }}
  <Graph style="margin-top: 30px;"
         :x="'Workouts'"
         :y="'Proportion'"
         :x-series="workoutTypes"
         :y-series="workoutProportions"
         :show-labels="false"
         :show-data="false"
         :chart-type="'column'"
  />
  <div class="hooper-wrapper">
    <hooper :settings="hooperSettings" style="height: 100%">
      <slide v-for="w in workouts" v-bind:key="w.start">
        <div class="box slider-box">
          <div class="columns is-multiline">

            <div class="column is-full">
              <div class="box inner-box">
                <Graph/>
              </div>
            </div>

            <div class="column is-full">
              <div class="box inner-box desc-box">
                {{ w.name }}
              </div>
            </div>

          </div>
        </div>
      </slide>
      <hooper-navigation slot="hooper-addons"></hooper-navigation>
    </hooper>
  </div>
</div>

</template>

<script>
import Graph from "@/components/Graph";
import {
  Hooper,
  Slide,
  Navigation as HooperNavigation
} from 'hooper';
import 'hooper/dist/hooper.css';
import fitness from "@/api/fitness";

export default {
  name: "Fitness",
  components: {
    Hooper,
    Slide,
    HooperNavigation,
    Graph
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
      workoutProportions: []
    };
  },
  created() {
    this.workouts = fitness.retrieve();
    this.proportions = fitness.getWorkoutProportions(this.workouts);
    this.workoutTypes = this.getWorkoutTypes(this.proportions);
    this.workoutProportions = this.getWorkoutProportions(this.proportions);
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
    }
  }
}
</script>

<style scoped>
.hooper-wrapper {
  //margin-top: 30px;
}

.slider-box {
  height: 90%;
  margin-left: 0.5em;
  margin-right: 0.5em;
}

.inner-box {
  word-wrap: break-word;
}

.desc-box {
  padding: 0.5rem;
  font-size: 12px;
}

</style>