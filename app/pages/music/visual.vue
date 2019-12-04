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
        <button v-on:click="musicChange()">音楽変更</button>
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
      audioContext: null,
      source: null,
      gainNode: null,
      musicStatus: MUSIC_STOP,
      musicVolume: 0, // 初期音量 100%...?
      musicFile: "/music.mp3" 
    }
  },

// AudioBufferSourceNodeは基本使い捨で。使い終わったた（音楽を停止）すると再度再生できない（エラーになる
// 一時停止が存在するので、連続で再生、停止をするなら、一時停止（suspend）＝＞再開（resume）という流れ

  created() {
    if (process.browser) { // Nuxt サーバーサイドで実行しない
      this.audioContext = new AudioContext()
      this.source = this.audioContext.createBufferSource(); // AudioBufferSourceNodeを作成

      // 音楽ファイルを読み込む。
      var request = new XMLHttpRequest();
      request.open('GET', this.musicFile, true);
      request.responseType = 'arraybuffer';
      request.send();

      let tis = this
      request.onload = function () {
        var res = request.response;
        tis.audioContext.decodeAudioData(res, function (buf) {
          tis.source.buffer = buf;
        });
      };
      this.source.connect(this.audioContext.destination);

      // 音量調整
      this.gainNode = this.audioContext.createGain();
      this.source.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      // this.gainNode.gain.value が音量のやつ。　初期値1。-1で音が消える。-2と0で音量一緒。
      // gainNodeのgainは音量の増幅を変化させる値。
      // WebAudioApiで作った音は０で音が消えるっぽいので、増幅なしでも音がなる音楽ファイルでは、音量が－１
      // つまり、増幅されている音を打ち消すことで音楽が消える...という雰囲気？
      this.gainNode.gain.value = this.musicVolume;
    }
    console.log(this.audioContext);
    console.log(this.source);
  },

  computed: {
    isMusicStatusStop() {
      return this.musicStatus === MUSIC_STOP
    }
  },

  methods: {
    // AudioBufferSourceNodeのメモリ解放条件　https://weblike-curtaincall.ssl-lolipop.jp/portfolio-web-sounder/webaudioapi-basic/audio
    // のガベージコレクションの項より

// 参照が残っていない
// オーディオが停止している
// サウンドスケジューリングが設定されていない
// ノードが接続されていない
// 処理すべきデータが残っていない
    musicChange() {
      this.source.stop();//オーディオの停止

      this.musicFile = "/music2.mp3"
      const newSource = this.audioContext.createBufferSource();

      // 音楽ファイルを読み込む。
      var request = new XMLHttpRequest();
      request.open('GET', this.musicFile, true);
      request.responseType = 'arraybuffer';
      request.send();

      let tis = this
      request.onload = function () {
        var res = request.response;
        tis.audioContext.decodeAudioData(res, function (buf) {
          newSource.buffer = buf;
        });
      };
      newSource.connect(this.audioContext.destination);
      newSource.connect(this.gainNode); // 音量系統と接続

      // あたらしい AudioBufferSourceNode をパラメータに突っ込む
      this.source = newSource

      if ( ! this.isMusicStatusStop){
        this.source.start();
      }
    },

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

