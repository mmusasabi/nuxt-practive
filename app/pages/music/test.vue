<template>
  <section class="container">
    <app-logo/>
    <div>
      <div>
        <h2>音の再生</h2>
        <button v-if="isMusicStatusStop" v-on:click="musicStart()">
          再生
        </button>
        <button v-else v-on:click="musicStop()">
          停止
        </button>
      </div>

      <div>
        <h2>音の調整: {{musicVolume}}</h2>
        <button v-on:click="volumeUp()">
          ＋
        </button>
        <button v-on:click="volumeDown()">
          -
        </button>
      </div>
    </div>
  </section>
</template>

<script>
const MUSIC_PLAY = "play"
const MUSIC_STOP = "stop"
const VOLUME_INTERVAL = 0.1

import AppLogo from '~/components/AppLogo.vue'

export default {
  layout: 'simple',
  components: {
    AppLogo
  },
  data() {
    return {
      audioContext: null,
      source: null,
      gainNode: null,
      musicStatus: MUSIC_STOP,
      musicVolume: 0, // 初期音量 100%...?
      musicFile: "/music.mp3" 
    }
  },

  computed: {
    isMusicStatusStop() {
      return this.musicStatus === MUSIC_STOP
    }
  },

  methods: {
    musicStart() {
      this.musicStatus = MUSIC_PLAY
      if (process.browser) { // Nuxt サーバーサイドで実行しない
        this.audioContext = new AudioContext()
        var oscillatorNode = this.audioContext.createOscillator();  // OscillatorNode(入力、音源)を作成
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = this.musicVolume;                         // 音量を小さくする
        oscillatorNode.connect(this.gainNode);                  // oscillatorNodeをgainNodeに接続
        this.gainNode.connect(this.audioContext.destination);            // gainNodeをAudioDestinationNode(出力)に接続
        oscillatorNode.start(0);                           // 再生開始
      }
    },

    musicStop() {
      this.musicStatus = MUSIC_STOP
    },

    volumeUp() {
      this.gainNode.gain.value = this.gainNode.gain.value + VOLUME_INTERVAL;
      this.musicVolume = this.gainNode.gain.value;
    },
  
    volumeDown() {
      this.gainNode.gain.value = this.gainNode.gain.value - VOLUME_INTERVAL;
      this.musicVolume = this.gainNode.gain.value;
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

