// https://ja.nuxtjs.org/guide/plugins#%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%88%E3%82%84-context-%E3%81%AB%E6%B3%A8%E5%85%A5%E3%81%99%E3%82%8B
// store側の処理が膨らみそうなので、繰り返し必要そうな処理に関してはこちらでまとめる。

// https://github.com/jDataView/jDataView
// 曲情報の取得に利用
import jDataView from 'jDataView'
import Encoding from 'encoding-japanese'


import axios from 'axios'

export default ({ app }, inject) => {
  /**
   * 音楽データを取得し、audioSourceをreturnするpromiseを返却する
   *
   * @param Object audioContext
   * @param string musicFileName
   * @return Promise
   */
  inject('loadDecodeAudioData', (audioContext, musicFileName = '/music1.mp3') => {
    // 音楽ファイルを読み込む。
    const request = new XMLHttpRequest();
    const audioSource = audioContext.createBufferSource(); // AudioBufferSourceNodeを作成

    return axios.get(musicFileName, { responseType : 'arraybuffer' })
                .then(response => {
                  const arrayBuffer = response.data
                  parseAudioInfo(arrayBuffer)
                  return audioContext.decodeAudioData(arrayBuffer, function (buf) {
                    audioSource.buffer = buf;
                  });
                }).then(() => {
                  return audioSource
                })
  })
}

function parseAudioInfo(arrayBuffer) {
  var jdv = new jDataView(arrayBuffer);

  // ID3v1.1
  if (jdv.getString(3, jdv.byteLength - 128) == 'TAG') {
    const convertSetting = {
      to: 'UNICODE',
      from: 'AUTO',
      type: 'string'
    }

    var title  = jdv.getBytes(30, jdv.tell());
    var artist = jdv.getBytes(30, jdv.tell());
    var album  = jdv.getBytes(30, jdv.tell());
    var year   = jdv.getBytes(4, jdv.tell());

    console.log(Encoding.convert(title, convertSetting));
    console.log(Encoding.convert(artist, convertSetting));
    console.log(Encoding.convert(album, convertSetting));
    console.log(Encoding.convert(year, convertSetting));
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
}