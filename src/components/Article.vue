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
        <div class="hooper-wrapper">
          <hooper :settings="hooperSettings">
            <slide>
                <div class="box slider-box">
                  <Graph/>
                </div>
            </slide>
            <slide>
                <div class="box slider-box">
                  I'm in a box.
                </div>
            </slide>
            <slide>
                <div class="box slider-box">
                  Another one.
                </div>
            </slide>
            <hooper-navigation slot="hooper-addons"></hooper-navigation>
          </hooper>

        </div>
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

export default {
  name: "Article",
  components: {
    Graph,
    Hooper,
    Slide,
    HooperNavigation
  },
  props: {
    title: String,
    content: String,
    img: String
  },
  data() {
    return {
      hooperSettings: {
        itemsToShow: 2,
        centerMode: true,
      }
    };
  }
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

.hooper-wrapper {
  margin-top: 30px;
}

.slider-box {
  height: 90%;
  margin-left: 10px;
  margin-right: 10px;
}


</style>