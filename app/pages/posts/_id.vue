<template>
  <section class="container">
    <div>
      <h1 class="title">
        hogeのぺーじだお
        {{post.title}}
      </h1>
      <h2 class="subtitle">
        nuxt practice
        {{post.descriotion}}
      </h2>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      posts: [
        {
          id: 'piyo',
          title: 'title',
          description: 'ないよう'
        }
      ]
    }
  },

  computed: {
    post () {
      return this.posts.find(post => post.id === this.id)
    }
  }
}
</script>

<style>
</style>

