<template>

  <div id="my-chart">
    <table id="animations-example-6" class="charts-css data-spacing-1 show-primary-axis"
           v-bind:class="[{'show-labels': showLabels, 'hide-data': !showData}, chartType]"
    >
      <thead>
      <tr>
        <th scope="col"> {{ xName }}</th>
        <th scope="col"> {{ yName }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, i) of xValues" v-bind:key="item">
        <th scope="row"> {{ item }}</th>
        <td :style="'--size:' + yValues[i]"><span class="data">{{ item }}</span></td>
      </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
export default {
  name: "Graph",
  props: {
    x: String,
    y: String,
    xSeries: Array[Number],
    ySeries: Array[String],
    chartType: {
      type: String,
      default: 'column'
    },
    showData: Boolean,
    showLabels: Boolean
  },
  data() {
    return {
      xName: this.x ? this.x : "Progress",
      yName: this.y ? this.y : "Year",
      xValues: this.xSeries ? this.xSeries : [Math.random(), Math.random(), Math.random(), Math.random()],
      yValues: this.ySeries ? this.ySeries : [Math.random(), Math.random(), Math.random(), Math.random()],
    }
  }
}
</script>

<style scoped>
#animations-example-6 td {
  background-image: linear-gradient(
      45deg,
      #956fd3,
      #e76ec2,
      #ff7fa2,
      #ffa782,
      #ffd86f,
      #faf982
  );
  background-size: 600%;
  animation: gradient-animation 3s linear infinite alternate;
}

.data {
  font-size: 12px;
}

#my-chart {
  width: 100%
}

#my-chart .column {
  height: 100px;
  margin: 0 auto;
}

#my-chart .bar {
  height: 100px;
  //max-width: 300px;
  --labels-size: 300px;
  margin: 0 auto;
}

#my-chart .line {
  height: 100px;
  margin: 0 auto;
}

@keyframes gradient-animation {
  0%   { background-position:   0; }
  100% { background-position: 100%; }
}
</style>