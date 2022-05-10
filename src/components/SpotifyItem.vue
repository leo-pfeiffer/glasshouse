<template>
  <a :href="src">
    <img :src="image" :alt="name">
    <p>{{ name }}</p>
  </a>
</template>

<script>
export default {
  name: "SpotifyItem",
  props: {
    image: String,
    src: String,
    name: String,
    persons: Array[String]
  }
}
</script>

<style scoped>

img {
  min-width: 80px;
  max-width: 200px;
  width: 50%;
  border-radius: 5px;
}

</style>