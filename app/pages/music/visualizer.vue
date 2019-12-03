<template>
  <section class="main-wrap">
    <header>
      <!-- 今の所使いみちなし -->
    </header>

    <div class="contents">
      <section class="audio-playing">
        <section class="menu">
          hoge
        </section>

        <section class="visualizer">
          huga
        </section>
      </section>

      <audio-control class="audio-control" />
    </div>

    <footer>
      <!-- 今の所使いみちなし -->
    </footer>
  </section>
</template>

<script>
import AudioControl from '~/components/music/AudioControl.vue'
// import AppLogo from '~/components/AppLogo.vue'
// import AppLogo from '~/components/AppLogo.vue'

export default {
  components: {
    AudioControl
  },
  layout: 'musicVisualizer'
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

    .audio-control
      width: 100%
      height: $audio-control-height
      background-color: burlywood
</style>

