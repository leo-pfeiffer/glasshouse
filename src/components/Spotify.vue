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

          <div class="table-container">
            <table class="table is-hoverable">
              <tbody>
              <tr v-for="(track, i) of recentlyPlayed" v-bind:key="i">
                <td><img :src="getLastImageURL(track.track.album.images)" :alt="track.track.name" class="mini-img"/></td>
                <td><a :href="track.track.external_urls.spotify">{{ track.track.name }}</a></td>
              </tr>
              </tbody>
            </table>
          </div>

        </article>
      </div>
    </div>

    <div class="tile is-ancestor">
      <div class="tile is-parent">
        <article class="tile is-child box">
          <p class="subtitle">Top Artists (30 dys)</p>

          <div class="table-container">
            <table class="table is-hoverable">
              <tbody>
              <tr v-for="(artist, i) of topArtists" v-bind:key="i">
                <td><img :src="getLastImageURL(artist.images)" :alt="artist.name" class="mini-img"/></td>
                <td><a :href="artist.external_urls.spotify">{{ artist.name }}</a></td>
              </tr>
              </tbody>
            </table>
          </div>

        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <p class="subtitle">Top Tracks (30 dys)</p>
          <table class="table is-hoverable">
            <tbody>
            <tr v-for="(track, i) of topTracks" v-bind:key="i">
              <td><img :src="getLastImageURL(track.album.images)" :alt="track.name" class="mini-img"/></td>
              <td><a :href="track.external_urls.spotify">{{ track.name }}</a></td>
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
      recentlyPlayed: [],
      isPlaying: false
    }
  },
  components: {
    SpotifyItem
  },
  methods: {
    getLastImageURL: function(images) {
      const length = images.length
      if (length === 0) {
        return null
      }
      return images[length - 1].url;
    }
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
    this.recentlyPlayed = await spotifyClient.getRecentlyPlayed();
  }
}
</script>

<style scoped>
.mini-img {
  max-height: 1.5em;
  max-width: 1.5em;
  width: auto;
  height: auto;
}

</style>