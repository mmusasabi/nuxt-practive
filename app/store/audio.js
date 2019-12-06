// Vuex
// ステート
export const state = () => ({
  audioContext: null,
  audioSource: null,
  gainNode: null,

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
    state.audioContext = audioContext
  },

  resetAudioNode (state, audioSource) {
    if(state.audioSource) { // 再生中なら止める
      state.audioSource.stop()
    }
    state.audioSource = audioSource
    state.gainNode    = state.audioContext.createGain();
  },

  changeAudioStatus(state, status){
    state.audioPlayStatus=status
  }
}

// アクション
export const actions = {
  /**
   * 音楽を再生する
   *
   * @return string
   */
  async musicStart({commit, state}) { // HACK?: 非同期にしている理由も特にないが、そのまま。
    var musicFileName = '/music2.mp3'

    commit('resetAudioNode', this.$loadDecodeAudioData(state.audioContext, musicFileName))

    state.audioSource.connect(state.audioContext.destination);
    state.audioSource.connect(state.gainNode);

    state.gainNode.connect(state.audioContext.destination);
    state.gainNode.gain.value = -0.5;
    
    state.audioSource.start();

    commit('changeAudioStatus', true)
    return 'start'
  },

  /**
   * 音楽が再生中なら一時停止にする
   *
   * @return string
   */
  async musicStop({commit, state}) {
    // TODO: 再開できる形で音楽止める処理書く
    state.audioSource.stop();

    commit('changeAudioStatus', false)
    return 'stop'
  },

  /**
   * ユーザIDをキーにキャッシュから本の配列を取得する。
   *
   * @param int setVolume
   */
  changeAudioVolume({commit, state}, setVolume) {
    var gainValue = parseInt(setVolume)
    if(gainValue > 100){gainValue = 100}
    if(gainValue < 0  ){gainValue = 0  }
    state.gainNode.gain.value = gainValue / 100 - 1
  }
}