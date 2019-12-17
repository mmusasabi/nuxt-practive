// https://ja.nuxtjs.org/guide/plugins#%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%88%E3%82%84-context-%E3%81%AB%E6%B3%A8%E5%85%A5%E3%81%99%E3%82%8B
// store側の処理が膨らみそうなので、繰り返し必要そうな処理に関してはこちらでまとめる。

// https://github.com/jDataView/jDataView
// 曲情報の取得に利用
import jDataView from 'jDataView'
import Encoding from 'encoding-japanese'

import axios from 'axios'

export default ({ app }, inject) => {
  /**
   * 音楽データを取得し、次にarrayBufferを返り値とするpromiseを返す
   *
   * @param String musicFileName
   * @return Promise
   */
  inject('loadAudioData', (musicFileName) => {
    if(typeof musicFileName !== String.name.toLowerCase()){
      throw new Error("曲名をStringで渡してください");
    }
    return axios.get(musicFileName, { responseType : 'arraybuffer' })
                .then(response => {
                  return response.data // arrayBuffer
                })
  })

  /**
   * arrayBufferを元に、audioSourceを返り値とするpromiseを返す
   *
   * @param Object audioContext
   * @param Object arrayBuffer
   * @return Promise
   */
  inject('initAudioSource', (audioContext, arrayBuffer) => {
    if(audioContext.constructor !== AudioContext){
      throw new Error("第一引数にAudioContextを渡してください");
    }
    if(arrayBuffer.constructor !== ArrayBuffer){
      throw new Error("第二引数にArrayBufferを渡してください");
    }

    const audioSource = audioContext.createBufferSource(); // AudioBufferSourceNodeを作成
    
    return audioContext.decodeAudioData(arrayBuffer, function (buf) {
      audioSource.buffer = buf;
    }).then(() => {
      return audioSource
    })
  })

  /**
   * arrayBufferを元に、audioの情報を読み出して返す
   *
   * @param ArrayBuffer arrayBuffer
   * @return Promise
   */
  inject('loadAudioInfo', (arrayBuffer) => {
    if(arrayBuffer.constructor !== ArrayBuffer){
      throw new Error("引数にArrayBufferを渡してください");
    }
    return parseAudioInfo(arrayBuffer)
  })
}

//
// private
//

function parseAudioInfo(arrayBuffer) {
  const jdv = new jDataView(arrayBuffer);
  var title, artist, album, year

  // ID3v1.1
  if (jdv.getString(3, jdv.byteLength - 128) == 'TAG') {
    const convertSetting = {
      to: 'UNICODE',
      from: 'AUTO',
      type: 'string'
    }

    title  = Encoding.convert(jdv.getBytes(30, jdv.tell()), convertSetting)
    artist = Encoding.convert(jdv.getBytes(30, jdv.tell()), convertSetting)
    album  = Encoding.convert(jdv.getBytes(30, jdv.tell()), convertSetting)
    year   = Encoding.convert(jdv.getBytes(4, jdv.tell()), convertSetting)
  } else {
    // no ID3v1 data found.
    console.log('no ID3v1 data found.');
  }

  // ID3v2.2 はどうする？
  // https://stackoverflow.com/questions/20212560/read-id3-v2-4-tags-with-native-chrome-javascript-filereader-dataview
  // これ見れば行けそうな気がするが...どうだろう...
  // https://github.com/43081j/id3
  // これも使えそう。

  // https://developer.spotify.com/
  // TODO: spotifyのAPIを使ってアルバムアートワークとか取得したいね。

  return {
    title: title,
    artist: artist,
    album: album,
    year: year,
  }
}