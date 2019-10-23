<template>
  <section class="container">
    <div>
      <h1 class="title">
        天気情報を取得するページ
      </h1>
      <h2 class="subtitle">
        nuxt practice
      </h2>

      <div v-if="wether_data === null">
        Loading...
      </div>
      <div v-else>
        <ul>
          <li v-for="pref in wether_data" v-bind:key="pref.pref_code">
            <p class="name">{{pref.pref_name}}</p>
          </li>
        </ul>

      </div>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'simple',
  
  data() {
    return {
      wether_data: null
    }
  },

  created() {
    const url = 'http://localhost:3030/api_test.json'

    // 天気情報を取得
    this.$axios.get(url).then(res => {
      console.log(res.data.pref)
      this.wether_data = res.data.pref
    }).catch(error => {
      const {
        status,
        statusText
      } = error.response;
      console.log(`Error! HTTP Status: ${status} ${statusText}`);
    });

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
  font-size: 50px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 30px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

