<template>
  <section class="row">
    <div class="col music-info">
      <p class="test">
        曲名

        <span v-if="loading">
          なうろーど
        </span>
      </p>
      <p>
        アーティスト名
      </p>
    </div>

    <div class="col music-control">
      <div class="control-button">
        <button>
          <!-- シャッフル -->
        </button>
        <button>
          前の曲
        </button>

        <button v-if="musicPlayStatus" v-on:click="musicStop()">
          停止
        </button>
        <button v-else v-on:click="musicStart()">
          再生
        </button>

        <button>
          次の曲
        </button>
        <button>
          <!-- リピート -->
        </button>
      </div>
      <div class="play-time">

      </div>
    </div>

    <div class="col play-volume">
      <span>Volume: </span>
      <input type="range" min="0" max="100" v-model="audioVolume">
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      audioVolume: 50
    }
  },

  watch: {
    audioVolume(volume) {
      this.$store.dispatch('audio/changeAudioVolume', volume)
    }
  },

  computed: {
    ...mapGetters({
      musicPlayStatus: 'audio/musicPlayStatus',
    })
  },

  methods: {
    musicStart() {
      this.loading = true
      this.$store.dispatch('audio/musicStart').then((result) => {
        this.loading = false
        console.log(result);
      })
    },

    musicStop() {
      this.$store.dispatch('audio/musicStop').then((result) => {
        console.log(result);
      })
    }
  }
}
</script>

<style scoped lang="stylus">
</style>

