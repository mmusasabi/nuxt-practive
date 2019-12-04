// nuxt
// https://ja.nuxtjs.org/guide/vuex-store/

export const state = () => ({
  counter: 10
})
  
export const mutations = {
  increment (state) {
    console.log('incrementを実施');
    
    state.counter++
  }
}