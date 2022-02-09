<template>
  <div class="content article-body">
    {{ content }}
    <Graph style="margin-top: 30px;"/>
  </div>
</template>

<script>
import Graph from "@/components/Graph";
export default {
  name: "WakaTime",
  props: {
    content: String
  },
  components: {
    Graph
  }
}
</script>

<style scoped>

</style>