<template>
<div class="content article-body">
  {{ content }}
  <Graph style="margin-top: 30px;"/>
  <div class="hooper-wrapper">
    <hooper :settings="hooperSettings" style="height: 100%">
      <slide v-for="w in workouts" v-bind:key="w">
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
      }
    };
  },
  computed: {
    workouts: () => fitness.retrieve()
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