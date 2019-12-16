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
          一時停止
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
        {{ playingTime }}
        <input type="range" min="0" :max="audioDuration" v-model="playTime" v-on:change="musicMiddleStart">
        {{ durationTime }}
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
      audioVolume: 50,
      playTime: 0,

      intervalId: null,
    }
  },

  mounted () {
    const ths = this
    this.intervalId = setInterval(function () {
      if(ths.audioSource && ths.audioSource.buffer) {
        const updateTime = Math.floor(ths.$store.getters['audio/musicPlayedTime']())
        if(ths.playTime + 1 === updateTime){
          ths.playTime = updateTime
        }
      }
    }, 100)
  },

  beforeDestroy () {
    clearInterval(this.intervalId)
  },

  watch: {
    audioVolume(volume) {
      this.$store.dispatch('audio/changeAudioVolume', volume)
    },
  },

  computed: {
    ...mapGetters({
      musicPlayStatus: 'audio/musicPlayStatus',
      audioContext: 'audio/audioContext',
      audioSource: 'audio/audioSource',
      audioDuration: 'audio/audioDuration',
    }),

    // TODO: ２つの処理似てるよ
    playingTime(){
      let min = Math.floor(this.playTime / 60)
      let sec = ('00' + this.playTime % 60).slice(-2)
      return min + ':' + sec
    },

    durationTime(){
      let min = Math.floor(this.audioDuration / 60)
      let sec = this.audioDuration % 60
      return min + ':' + sec
    }
  },

  methods: {
    musicStart() {
      this.loading = true
      this.$store.dispatch('audio/musicStart', {
        audioVolume: this.audioVolume
      }).then((result) => {
        this.loading = false
        console.log(result);
      })
    },

    musicStop() {
      this.$store.dispatch('audio/musicStop').then((result) => {
        console.log(result);
      })
    },

    // HACK: 途中から再生のもっといい名前
    musicMiddleStart(e) {
      console.log(e.target.value);
      this.playTime = parseInt(e.target.value, 10)
      this.loading = true
      this.$store.dispatch('audio/musicStart', {
        audioVolume: this.audioVolume,
        offset: this.playTime
      }).then((result) => {
        this.loading = false
        console.log(result);
      })
    }
  }
}
</script>

<style scoped lang="stylus">
</style>

