<template>
  <section class="main-wrap">
    <header>
      <!-- 今の所使いみちなし -->
    </header>

    <div class="contents">
      <section class="audio-playing">
        <section class="menu">
          hoge menu
        </section>

        <audio-canvas class="visualizer audio-canvas" />
      </section>

      <audio-control class="audio-control" />
    </div>

    <footer>
      <!-- 今の所使いみちなし -->
    </footer>
  </section>
</template>

<script>
// import { mapMutations } from 'vuex'
import AudioCanvas from '~/components/music/AudioCanvas.vue'
import AudioControl from '~/components/music/AudioControl.vue'

export default {
  layout: 'musicVisualizer',
  components: {
    AudioCanvas,
    AudioControl
  },
  
  // https://ja.nuxtjs.org/api/pages-fetch
  // MEMO: ページがレンダーされる前に行う動作
  // 主にサーバサイドで処理するものを記載しておく。
  fetch ({ store, params }) {
    store.commit('increment')
    // audioInit() はfetch内ではインスタンス化されていないため、methodsに定義しても呼べない。

    if (process.browser) { // Nuxt サーバーサイドで実行しない
      // インスタンス化出来てないので死ぬ
      // store.commit('audio/audioInit', 'fetch')
    }
  },

  created() {
    if (process.browser){
      // TODO: Cookieとかにボリュームの設定とか保存しておいて、読み込んだ瞬間取り出しとく？
      this.$store.commit(
        'audio/audioInit',
        new (window.AudioContext || window.webkitAudioContext)()
      )
    }
  }

  // methods: {
  //   ...mapMutations({
  //     audioInit: 'audio/init'
  //   })
  // }
}
</script>

<style scoped lang="stylus">
$menu = 50px
$audio-control-height = 100px

.main-wrap
  width: 100%
  height: 100%

  .contents
    height: 100%

    .audio-playing
      width: 100%
      height: "calc(100% - %s)" % $audio-control-height
      position: relative

      .menu
        position: absolute
        top: 0
        left: 0
        width: $menu
        height: 100%
        background-color: aquamarine

      .visualizer
        padding-left: $menu
        width: 100%
        height: 100%

    .audio-control
      width: 100%
      height: $audio-control-height
      background-color: burlywood
</style>

