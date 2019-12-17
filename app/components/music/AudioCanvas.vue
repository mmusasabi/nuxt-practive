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
    }
  },

  mounted () {
    var canvas = this.$refs.sample1
    if (canvas.getContext) {
      var context = canvas.getContext('2d');
      
      canvas.width = canvas.offsetWidth;
      canvas.height  = canvas.offsetHeight;

      //左から20上から40の位置に、幅50高さ100の四角形を描く
      context.fillRect(20,40,50,100);

      //色を指定する
      context.strokeStyle = 'rgb(00,00,255)'; //枠線の色は青
      context.fillStyle = 'rgb(255,00,00)'; //塗りつぶしの色は赤

      //左から200上から80の位置に、幅100高さ50の四角の枠線を描く
      context.strokeRect(200,80,100,50);

      //左から150上から75の位置に、半径60の半円を反時計回り（左回り）で描く
      context.arc(150,75,60,Math.PI*1,Math.PI*2,true);
      context.fill()
    }


    // なんか繰り返し描画するやつ
    // const ths = this
    var count = 0
    this.intervalId = setInterval(function () {
      // context.fillStyle="#fff";//消去時の色
      // context.clearRect(0,0,300,300);//消す
      // context.fillStyle="#f00";//塗りつぶし色を赤に
      // context.fillRect(30+count,30+count,30,30);
      // count++;
      // if(count > 200){
      //     clearInterval(intervalId);
      // }
    }, 100)
  },

  beforeDestroy () {
    clearInterval(this.intervalId)
  },

  watch: {
  },

  computed: {
  }
}
</script>

<style scoped lang="stylus">
canvas#sample1
  width: 100%
  height: 100%
</style>

