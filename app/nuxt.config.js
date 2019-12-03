module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'nuxt-practice',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'nuxt practice' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  /*
  ** modules
  */
  modules: [
    // '@nuxtjs/auth',
    '@nuxtjs/axios',

    '@nuxtjs/style-resources',
  ],

  // style-resources を利用したスタイルファイルの読み込み
  styleResources: {
    stylus: [
      './assets/css/*.styl'
    ]
  },

   axios: {
    baseURL: "https://api.github.com"
  }
}

