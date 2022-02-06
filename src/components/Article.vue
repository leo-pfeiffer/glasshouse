<template>
  <div class="card article">
    <div class="card-content">
      <div class="media">
        <div class="media-center" v-if="img != null">
          <img :src="require('@/assets/' + img + '')" class="author-image" alt="Placeholder image">
        </div>
        <div class="media-content has-text-centered">
          <p class="title article-title">{{ title }}</p>
        </div>
      </div>
      <div class="content article-body">
        {{ content }}
        <Graph/>
      </div>
    </div>
  </div>
</template>

<script>
import Graph from "@/components/Graph";
export default {
  name: "Article",
  components: {Graph},
  props: {
    title: String,
    content: String,
    img: String
  }
}
</script>

<style scoped>

.articles .content p {
  line-height: 1.9;
  margin: 15px 0;
}

.article, .promo-block {
  margin-top: 6rem;
}

.article-title {
  font-size: 2rem;
  font-weight: lighter;
  line-height: 2;
}
.article-subtitle {
  color: #909AA0;
  margin-bottom: 3rem;
}
.article-body {
  line-height: 1.4;
  margin: 0 6rem;
}

.author-image {
  position: absolute;
  top: -30px;
  left: 50%;
  width: 60px;
  height: 60px;
  margin-left: -30px;
  border: 3px solid #ccc;
  border-radius: 50%;
}

.media-center {
  display: block;
  margin-bottom: 1rem;
}
.media-content {
  margin-top: 1rem;
}

</style>