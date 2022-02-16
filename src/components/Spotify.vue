<template>
  <div class="content article-body">
    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <p class="subtitle">Currently playing</p>
          <SpotifyItem :image="currentlyPlaying.image.url"
                       :name="currentlyPlaying.name"
                       :persons="currentlyPlaying.artists"
                       :src="currentlyPlaying.spotify_url"
                       v-if="isPlaying"
          />
          <p v-else>Not currently playing any songs!</p>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <p class="subtitle">Recently played</p>
        </article>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <p class="subtitle">Top Artists (recently)</p>

          <div class="table-container">
            <table class="table is-hoverable">
              <thead>
              <tr>
                <th>#</th>
                <th>Artist</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(artist, i) of topArtists" v-bind:key="i">
                <td>{{ i + 1}}</td>
                <td><a :href="artist.external_urls.spotify">{{ artist.name }}</a></td>
              </tr>
              </tbody>
            </table>
          </div>

        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <p class="subtitle">Top Tracks (recently)</p>
          <table class="table is-hoverable">
            <thead>
            <tr>
              <th>#</th>
              <th>Track</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(artist, i) of topTracks" v-bind:key="i">
              <td>{{ i + 1 }}</td>
              <td><a :href="artist.external_urls.spotify">{{ artist.name }}</a></td>
            </tr>
            </tbody>
          </table>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import SpotifyItem from "@/components/SpotifyItem";
import spotifyClient from "@/api/spotify";
export default {
  name: "Spotify",
  props: {
    content: String
  },
  data() {
    return {
      currentlyPlaying: {},
      topArtists: [],
      topTracks: [],
      isPlaying: false
    }
  },
  components: {
    SpotifyItem
  },
  async created() {
    const current = await spotifyClient.getCurrentlyPlaying();
    if (Object.keys(current).length === 0) {
      this.isPlaying = false
    } else {
      this.currentlyPlaying = current
      this.isPlaying = true
    }

    this.topArtists = await spotifyClient.getTopArtists();
    this.topTracks = await spotifyClient.getTopTracks();
  }
}
</script>

<style scoped>

</style>