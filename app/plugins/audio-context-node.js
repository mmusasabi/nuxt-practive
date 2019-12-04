// https://ja.nuxtjs.org/guide/plugins#%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%88%E3%82%84-context-%E3%81%AB%E6%B3%A8%E5%85%A5%E3%81%99%E3%82%8B
// store側の処理が膨らみそうなので、繰り返し必要そうな処理に関してはこちらでまとめる。

export default ({ app }, inject) => {

  // musicFileName ex) /music1.mp3
  inject('loadDecodeAudioData', (audioContext, musicFileName) => {
    console.log('Call loadDecodeAudioData methods')

    // 音楽ファイルを読み込む。
    const request = new XMLHttpRequest();
    const audioSource = audioContext.createBufferSource(); // AudioBufferSourceNodeを作成

    request.open('GET', musicFileName, true);
    request.responseType = 'arraybuffer';
    request.send();

    request.onload = function () {
      var res = request.response;
      audioContext.decodeAudioData(res, function (buf) {
        audioSource.buffer = buf;
      });
    };

    return audioSource
  })
}
