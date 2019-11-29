<template>
  <section class="container">
    <div>
      <h1 class="title">
        hogeのぺーじだお
      </h1>
      <h2 class="subtitle">
        nuxt practice
      </h2>

      <p v-on:click="$store.commit('increment')">
        {{ count }}
      </p>

    </div>
  </section>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  layout: 'simple',
  computed: {
    count () {
      return this.$store.state.counter
    }
  },
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

