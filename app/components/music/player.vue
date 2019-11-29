<template>
  <section class="container">
    <app-logo/>
    <div>
      <h1 class="title">
        music/visualのぺーじだお
      </h1>
      <div>
        <h2>音楽の再生</h2>
        <button v-if="isMusicStatusStop" v-on:click="musicStart()">
          再生
        </button>
        <button v-else v-on:click="musicStop()">
          停止
        </button>
      </div>

      <div>
        <h2>音量の調整: {{musicVolume}}</h2>
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
      source: null,
      gainNode: null,
      musicStatus: MUSIC_STOP,
      musicVolume: -0.5, // 初期音量 50%...?
      musicFile: "/music.mp3" 
    }
  },

  created() {    
    if (process.browser) { // Nuxt サーバーサイドで実行しない
      const context = new AudioContext();
      this.source = context.createBufferSource();

      // 音楽ファイルを読み込む。
      var request = new XMLHttpRequest();
      request.open('GET', this.musicFile, true);
      request.responseType = 'arraybuffer';
      request.send();

      let tis = this
      request.onload = function () {
        var res = request.response;
        context.decodeAudioData(res, function (buf) {
          tis.source.buffer = buf;
        });
      };
      this.source.connect(context.destination);

      // 音量調整
      this.gainNode = context.createGain();
      this.source.connect(this.gainNode);
      this.gainNode.connect(context.destination);
      // this.gainNode.gain.value が音量のやつ。　初期値1。-1で音が消える。-2と0で音量一緒。
      this.gainNode.gain.value = this.musicVolume;
    }
    console.log(this.source);
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
        this.source.start();
      }
    },

    musicStop() {
      this.musicStatus = MUSIC_STOP
      if (process.browser) { // Nuxt サーバーサイドで実行しない
        this.source.stop();
      }
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

