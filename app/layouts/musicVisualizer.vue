<template>
  <div class="music-visualizer">
    <nuxt/>
  </div>
</template>

<style lang="stylus">
.music-visualizer
  // HACK: 取り敢えずは横幅が最低でも1024px ある前提で作る
  // min-width: 1024px
  width: 100%
  max-height: 100%
  height: 100vh
  min-height: 724px
</style>

