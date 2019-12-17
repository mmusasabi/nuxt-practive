// Vuex

//audioPlayStatus
const AUDIO_STOP = 'stop' // 停止
const AUDIO_PLAY = 'play' // 再生
const AUDIO_SUSPEND = 'suspend' // 一時停止

//audioData
const AUDIO_INFO_DEFAULT_TITLE  =　'不明な曲名' // 曲名
const AUDIO_INFO_DEFAULT_ARTIST =　'不明なアーティスト' // アーティスト名
const AUDIO_INFO_DEFAULT_ALBUM  =　'不明なアルバム名' // アルバム名
const AUDIO_INFO_DEFAULT_YEAR   =　'不明な発売年' // 発売年

// ステート
export const state = () => ({
  audioContext: null,
  audioSource: null,
  gainNode: null,

  audioStartPlayTime: 0,
  audioOffset: 0,
  audioDuration: 0,
  
  audioData: {
    title:  AUDIO_INFO_DEFAULT_TITLE, // 曲名
    artist: AUDIO_INFO_DEFAULT_ARTIST, // アーティスト名
    album:  AUDIO_INFO_DEFAULT_ALBUM, // アルバム名
    year:   AUDIO_INFO_DEFAULT_YEAR, // 発売年
  },

  audioPlayStatus: AUDIO_STOP, // 仮
  text: '',
  list: []
})

// ゲッター
export const getters = {
  // objectの中身見てるのでcomputedとかで反応しないので注意
  audioContext(state) {
    return state.audioContext
  },

  audioSource(state){
    return state.audioSource
  },

  musicPlayStatus(state) {
    return state.audioPlayStatus === AUDIO_PLAY
  },

  audioDuration(state) {
    return Math.ceil(state.audioDuration)
  },

  audioData(state) {
    return state.audioData
  },

  // NOTE: メソッドスタイルアクセスで呼ばないと毎回計算されないため
  // this.$store.getters['audio/musicPlayedTime']()
  musicPlayedTime: (state) => () => {
    return state.audioContext.currentTime - state.audioStartPlayTime + state.audioOffset
  },
}

// ミューテーション
export const mutations = {
  // 兎にも角にも一度state.audioContextにaudioContextを突っ込む。話はそれからだ。
  audioInit (state, {text, audioContext}) {
    if (state.audioContext === null && audioContext.constructor === AudioContext) {
      state.text = text
      state.audioContext = audioContext  
    }
  },

  resetAudioNode (state, audioSource) {
    if(state.audioSource) { // 再生中なら止める
      state.audioSource.stop()
    }
    state.audioSource   = audioSource
    state.audioDuration = audioSource.buffer.duration
    state.gainNode      = state.audioContext.createGain();
  },

  setStartTime(state, offset = 0) {
    if (state.audioContext !== null) {
      state.audioOffset = offset
      state.audioStartPlayTime = state.audioContext.currentTime      
    }
  },

  setAudioInfo(state, audioInfo) {
    state.audioData.title  = audioInfo.title  || AUDIO_INFO_DEFAULT_TITLE  // 曲名
    state.audioData.artist = audioInfo.artist || AUDIO_INFO_DEFAULT_ARTIST // アーティスト名
    state.audioData.album  = audioInfo.album  || AUDIO_INFO_DEFAULT_ALBUM  // アルバム名
    state.audioData.year   = audioInfo.year   || AUDIO_INFO_DEFAULT_YEAR   // 発売年
  },

  changeAudioStatus(state, status){
    state.audioPlayStatus = status
  },
}

// アクション
export const actions = {
  /**
   * 音楽を再生する
   *
   * @param int audioVolume
   * @param string musicFileName
   * @param int duration
   * @return Promise
   */
  musicStart({commit, state}, {audioVolume = 50, musicFileName = '/music2.mp3', offset = 0}) {
    // サスペンド中、durationの指定なし（時間指定再生ではない）場合、
    if(state.audioContext.state === 'suspended' && offset === 0) {
      return state.audioContext.resume().then(() => {
        commit('changeAudioStatus', AUDIO_PLAY)
      })
    }

    // TOOD: 現状resume以外の方法で再開すると都度音楽ファイルを読み込む
    // Objectのクローンなどで対応したい気持ち
    return this.$loadAudioData(musicFileName).then((arrayBuffer) => {
      commit('setAudioInfo', this.$loadAudioInfo(arrayBuffer))
      return this.$initAudioSource(state.audioContext, arrayBuffer)

    }).then((audioSource) =>{
      commit('resetAudioNode', audioSource)

      // TODO: このへんの処理もresetAudioNodeに移設したい
      state.audioSource.connect(state.audioContext.destination);
      state.audioSource.connect(state.gainNode);
  
      state.gainNode.connect(state.audioContext.destination);
      state.gainNode.gain.value = calcGainVolume(audioVolume);

      // サスペンド中かもしれないので必ずresumuしておく
      return state.audioContext.resume()
    }).then(() => {
      if (offset === 0){
        return state.audioSource.start();
      }
      return state.audioSource.start(undefined, offset)
    }).then(() => {
      commit('setStartTime', offset)
      commit('changeAudioStatus', AUDIO_PLAY)
      return 'start'
    })
  },

  /**
   * 音楽が再生中なら一時停止にする
   *
   * @return Promise
   */
  musicStop({commit, state}) {
    return state.audioContext.suspend().then(() => {
      commit('changeAudioStatus', AUDIO_SUSPEND)
      return 'stop'
    })
  },

  /**
   * 音量を変更する
   *
   * @param Object context
   * @param int setVolume
   */
  changeAudioVolume({getters, commit, state}, setVolume) {
    if(state.gainNode === null) {
      console.log('dont start music')
      return
    }
    state.gainNode.gain.value = calcGainVolume(setVolume)
  }
}



// 
// private function
// 

/**
 * gainNodeのgain値に設定可能な音量の値を返す。
 *
 * @param int audioVolume
 * @return double
 */
function calcGainVolume(audioVolume) {
  var gainValue = parseInt(audioVolume)
  if(gainValue > 100){gainValue = 100}
  if(gainValue < 0  ){gainValue = 0  }
  return gainValue / 100 - 1
}