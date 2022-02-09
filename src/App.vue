<template>
  <div id="app">

    <Navbar logo="logo.png"/>

    <section class="hero is-info is-medium is-bold">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">My life in data.</h1>
        </div>
      </div>
    </section>

    <div class="container">
      <section class="articles">
        <div class="column is-8 is-offset-2">
          <Article
              title="Spotify"
              content="Bla bla bla I listen to Spotify all day"
              img="spotify.png"
              type="spotify"
          />

          <Article
              title="Apple Fitness"
              content="Workouts from the last 14 days."
              img="applefitness.png"
              type="fitness"
          />

          <Article
              title="WakaTime"
              content="Taking over the world with code"
              img="wakatime.png"
              type="wakatime"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Article from "@/components/Article";
import Navbar from "@/components/Navbar";

export default {
  name: 'App',
  components: {
    Navbar,
    Article
  }
}
</script>

<style>

.hero-body
{
  background: #5C258D;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #4389A2, #5C258D);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #4389A2, #5C258D); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  /*background-image: url(./assets/gradient.jpeg);*/
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 400px;
}


.articles {
  margin: -200px 0 5rem;
}

div.column.is-8:first-child {
  padding-top: 0;
  margin-top: 0;
}

</style>
