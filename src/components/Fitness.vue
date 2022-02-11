<template>
  <div class="content article-body">
    <div class="content article-subtitle">
      {{ content }}
    </div>
    <div class="columns is-vcentered">
      <div class="column is-half">
        <vue-c3 :handler="handler"></vue-c3>
      </div>
      <div class="column is-half">
        Hello world
      </div>
    </div>
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

const scheme = new ColorScheme;
scheme.from_hue(21).scheme('contrast');
console.log(scheme.colors().map(e => '#' + e))

export default {
  name: "Fitness",
  components: {
    Hooper,
    Slide,
    HooperNavigation,
    Graph,
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
      handler: new Vue()
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
        type: 'pie',
      },
      color: {
        pattern: scheme.colors().map(e => '#' + e)
      },
      pie: {
        label: {
          show: false
        }
      }
    }
    this.handler.$emit('init', options)
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