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
      <WakaTime v-if="type==='wakatime'" :content="content"/>
      <Strava v-else-if="type==='strava'" :content="content"/>
      <Spotify v-else-if="type==='spotify'" :content="content"/>
      <Github v-else-if="type==='github'" :content="content"/>
      <div class="content article-body" v-else>{{ content }}</div>
    </div>
  </div>
</template>

<script>
import WakaTime from "@/components/WakaTime";
import Spotify from "@/components/Spotify";
import Github from "@/components/Github";
import Strava from "@/components/Strava";

export default {
  name: "Article",
  components: {
    Spotify,
    WakaTime,
    Strava,
    Github
  },
  props: {
    title: String,
    content: String,
    img: String,
    type: String
  },
}
</script>

<style scoped>

.articles .content p {
  line-height: 1.9;
  margin: 15px 0;
}

.article {
  margin-top: 6rem;
}

.article-title {
  font-size: 2rem;
  font-weight: lighter;
  line-height: 2;
}

.article-body {
  line-height: 1.4;
  margin: 0 3rem;
  text-align: center;
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

.card-content {
  padding: 1.5rem 0;
}

</style>