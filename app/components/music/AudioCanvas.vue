<template>
  <section>
    <canvas id="sample1" ref="sample1" style="background-color:lemonchiffon;">
      図形を表示するには、canvasタグをサポートしたブラウザが必要です。
    </canvas>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      intervalId: null,
      canvasContext: null
    }
  },

  mounted () {
    var canvas = this.$refs.sample1
    if (canvas.getContext) {
      this.canvasContext = canvas.getContext('2d');
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      canvasMap(canvas, this.canvasContext)
      canvasDrawTest(canvas, this.canvasContext)
    }

    // アニメーションとして描画
    requestAnimationFrame(this.draw)
  },

  beforeDestroy () {
    clearInterval(this.intervalId)
  },

  watch: {
  },

  computed: {
    ...mapGetters({
      audioAnalyserNode: 'audio/audioAnalyserNode',
      audioFrequency:    'audio/audioFrequency',
    }),
  },

  methods: {
    // 参考： https://qiita.com/soarflat/items/4aa001dac115a4af6dbe#getbytefrequencydata%E3%81%A7%E5%8F%96%E5%BE%97%E3%81%97%E3%81%9F%E6%B3%A2%E5%BD%A2%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E6%8F%8F%E7%94%BB%E3%81%99%E3%82%8B
    draw(lisner){
      var canvas = this.$refs.sample1
      if (!canvas.getContext) {
        return requestAnimationFrame(this.draw)
      }
      if (this.audioAnalyserNode === null || this.audioFrequency === null){
        return requestAnimationFrame(this.draw)
      }

      // 描画をリセット
      this.canvasContext.fillStyle = 'lemonchiffon';
      this.canvasContext.fillRect(0, 0, canvas.width, canvas.height);

      // 補助線
      canvasMap(canvas, this.canvasContext)

      const cw  = canvas.offsetWidth;
      const ch = canvas.offsetHeight;

      // 0~1まで設定でき、0に近いほど描画の更新がスムーズになり, 1に近いほど描画の更新が鈍くなる。
      this.audioAnalyserNode.smoothingTimeConstant = 0.5;

      // FFTサイズを指定する。デフォルトは2048。
      this.audioAnalyserNode.fftSize = 2048;

      // 周波数領域の波形データを引数の配列に格納するメソッド。
      // analyserNode.fftSize / 2の要素がthis.freqsに格納される。今回の配列の要素数は1024。
      this.audioAnalyserNode.getByteFrequencyData(this.audioFrequency);

      // 全ての波形データを描画するために、一つの波形データのwidthを算出する。
      var barWidth = cw / this.audioAnalyserNode.frequencyBinCount;

      // analyserNode.frequencyBinCountはanalyserNode.fftSize / 2の数値。よって今回は1024。
      for (var i = 0; i < this.audioAnalyserNode.frequencyBinCount; ++i) {
        var value = this.audioFrequency[i]; // 配列には波形データ 0 ~ 255までの数値が格納されている。
        var percent = value / 255; // 255が最大値なので波形データの%が算出できる。
        var height = ch * percent; // %に基づく描画する高さを算出

        this.canvasContext.fillStyle = '#0f0';
        this.canvasContext.fillRect(i * barWidth, ch, barWidth, -height);  // -をつけないと下に描画されてしまう。
      }

      requestAnimationFrame(this.draw)
    }
  }
}


// TODO: 落ち着いたらlibraryとかにどけたい

function canvasMap(canvas, context){
  const canvasWidth  = canvas.offsetWidth;
  const canvasHeight = canvas.offsetHeight;

  context.fillStyle   = 'rgb(220,220,220)'; //塗りつぶしの色は赤

  // 粒度
  const grainSize = 50
  // 縦線
  for (var i = 1; i < canvasWidth/grainSize; i++) {
    context.fillRect(grainSize * i, 0, 1, canvasHeight);
  }
  // 横線
  for (var i = 1; i < canvasHeight/grainSize; i++) {
    context.fillRect(0, grainSize * i, canvasWidth, 1);
  }
}

function canvasDrawTest(canvas, context){
  //左から20上から40の位置に、幅50高さ100の四角形を描く
  context.fillRect(20,40,50,100);

  //色を指定する
  context.strokeStyle = 'rgb(00,00,255)'; //枠線の色は青
  context.fillStyle = 'rgb(255,00,00)'; //塗りつぶしの色は赤

  context.fillRect(50, 0, 15, canvas.height);


  //左から200上から80の位置に、幅100高さ50の四角の枠線を描く
  context.strokeRect(200,80,100,50);

  //左から150上から75の位置に、半径60の半円を反時計回り（左回り）で描く
  context.arc(150,75,60,Math.PI*1,Math.PI*2,true);
  context.fill()
}
</script>

<style scoped lang="stylus">
canvas#sample1
  width: 100%
  height: 100%
</style>

