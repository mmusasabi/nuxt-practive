// Vuex
// ステート
export const state = () => ({
  audioContext: null,
  audioPlayStatus: false, // 仮
  text: '',
  list: []
})

// ゲッター
export const getters = {
  // TODO: audioSourceの状態を見て再生中かどうかをリターンするようにしたい。
  musicPlayStatus(state) {
    return state.audioPlayStatus
  }
}

// ミューテーション
export const mutations = {
  // 兎にも角にも一度state.audioContextにaudioContextを突っ込む。話はそれからだ。
  audioInit (state, {text, audioContext}) {
    state.text = text
    console.log(state.text);

    state.audioContext = audioContext
    console.log(audioContext);   
  },

  changeAudioStatus(state, status){
    state.audioPlayStatus=status
  }
}

// アクション
export const actions = {
  // HACK?: 非同期にしている理由も特にないが、そのまま。
  async musicStart({commit, state}) {
    var musicFileName = '/music.mp3'

    // TODO: 再生中なら現在のaudioSourceの音楽を止めて、開放。その後に新しくSourceを作り直して、音楽再生。
    const audioSource = this.$loadDecodeAudioData(state.audioContext, musicFileName)
    const gainNode    = state.audioContext.createGain();

    audioSource.connect(state.audioContext.destination);
    audioSource.connect(gainNode);

    gainNode.connect(state.audioContext.destination);
    gainNode.gain.value = -0.8;
    
    audioSource.start();

    commit('changeAudioStatus', true)
    return 'start'
  },

  async musicStop({commit, state}) {
    // 
    //  TODO: 再開できる形で音楽止める処理書く
    //     
    commit('changeAudioStatus', false)
    return 'stop'
  },
}