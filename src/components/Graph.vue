<template>

  <div id="my-chart">
    <table id="animations-example-6" class="charts-css column hide-data data-spacing-5 show-primary-axis">
      <!--    show-labels-->
      <thead>
      <tr>
        <th scope="col"> Year</th>
        <th scope="col"> Progress</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row"> 2016</th>
        <td :style="'--size:' + Math.random()"><span class="data"></span></td>
      </tr>
      <tr>
        <th scope="row"> 2017</th>
        <td :style="'--size:' + Math.random()"><span class="data"></span></td>
      </tr>
      <tr>
        <th scope="row"> 2018</th>
        <td :style="'--size:' + Math.random()"><span class="data"></span></td>
      </tr>
      <tr>
        <th scope="row"> 2019</th>
        <td :style="'--size:' + Math.random()"><span class="data"></span></td>
      </tr>
      <tr>
        <th scope="row"> 2020</th>
        <td style="--size:0.3;"><span class="data"> </span></td>
      </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
export default {
  name: "Graph"
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

#my-chart {
  margin-top: 30px;
}

#my-chart .column {
  height: 100px;
  margin: 0 auto;
}

@keyframes gradient-animation {
  0%   { background-position:   0; }
  100% { background-position: 100%; }
}
</style>