<template>
  <view :class="timeInfo.background?'timeBox':'timeBox inline'">
    <text :class="timeInfo.background?'time':'time noBgc'">{{day}}</text><text :style="timeInfo.dianColor?'color:#000;':''">:</text>
    <text :class="timeInfo.background?'time':'time noBgc'">{{hour}}</text><text :style="timeInfo.dianColor?'color:#000;':''">:</text>
    <text :class="timeInfo.background?'time ':'time noBgc'">{{min}}</text><text :style="timeInfo.dianColor?'color:#000;':''">:</text>
    <text :class="timeInfo.background?'time bgc':'time noBgc'">{{sec}}</text>
  </view>
</template>

<script>
export default {
  props: {
    timeInfo: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  data () {
    return {
      day: 0,
      hour: 0,
      min: 0,
      sec: 0
    }
  },
  mounted () {
    this.countTime()
  },
  methods: {

    //倒计时
    countTime () {
      let start_date = this.$moment().format( "YYYY-MM-DD HH:mm:ss" )
      let end_date, seconds, endtime = this.timeInfo.endTime
      if ( this.timeInfo.endTime.toString().length == 10 ) {
        endtime = this.timeInfo.endTime * 1000
      }
      end_date = this.$moment( endtime ).format( "YYYY-MM-DD HH:mm:ss" )
      seconds = this.$moment( end_date ).diff( start_date, "seconds" )
      if ( seconds >= 0 ) {

        this.formateSeconds( seconds, 0, ( day, hour, min, second ) => {
          this.day = day
          this.hour = hour
          this.min = min
          this.sec = second
        } )
      }
      setTimeout( this.countTime, 1000 )
    },
    formateSeconds ( second_time, flag, callback ) {
      if ( isNaN( second_time ) ) {
        return "0秒";
      }
      var timeStr = parseInt( second_time ) + "秒"
      if ( parseInt( second_time ) > 60 ) {
        var second = parseInt( second_time ) % 60
        var min = parseInt( second_time / 60 )
        timeStr = min + "分" + second + "秒"
        if ( min > 60 ) {
          min = parseInt( second_time / 60 ) % 60
          var hour = parseInt( parseInt( second_time / 60 ) / 60 )
          timeStr = hour + "小时" + min + "分" + second + "秒";
          if ( hour > 24 ) {
            hour = parseInt( parseInt( second_time / 60 ) / 60 ) % 24;
            var day = parseInt( parseInt( parseInt( second_time / 60 ) / 60 ) / 24 )
            timeStr = day + "天" + hour + "小时" + min + "分" + second + "秒"
          }
        }
        callback && callback( day, hour, min, second )
      }
    },
  }
}
</script>

<style  scoped>
.timeBox {
  margin: 0 auto;
  color: #fff;
}
.inline {
  display: inline-block;
  color: #000;
}

.time {
  width: 40upx;
  height: 40upx;
  display: inline-block;
  background: #4a4a4a;
  border-radius: 2px;
  line-height: 40upx;
  text-align: center;
  font-size: 10px;
  margin: 8upx;
}
.bgc {
  background: #fa4b9b;
}
.noBgc {
  color: #000;
  background: transparent;
  margin: 0;
  font-size: 10px;
}
</style>