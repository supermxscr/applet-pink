<template>
  <view>
    <view class="info-top">
      <progress
        :percent="percent"
        class="progress"
        :activeColor="activeColor"
        :backgroundColor="backgroundColor"
        active="true"
        border-radius="10"
      />
      <view
        class="stype"
        :style="percent>0||percent==0?'background:'+activeColor:'background:'+backgroundColor"
      >1</view>
      <view
        class="stype garden2"
        :style="percent>34?'background:'+activeColor:'background:'+backgroundColor"
      >2</view>
      <view
        class="stype garden3 "
        :style="percent>35?'background:'+activeColor:'background:'+backgroundColor"
      >3</view>
      <view
        class="stype garden4"
        :style="percent>74?'background:'+activeColor:'background:'+backgroundColor"
      >4</view>

    </view>
    <view class="info-bottom">
      <view
        class="wenzi "
        :style="percent>0||percent==0?'color:'+activeColor:'color:'+backgroundColor"
      >开团</view>
      <view
        class="wenzi wenzi2"
        :style="percent>34?'color:'+activeColor:'color:'+backgroundColor"
      >邀请好友</view>
      <view
        class="wenzi wenzi3 "
        :style="percent>35?'color:'+activeColor:'color:'+backgroundColor"
      >2小时成团</view>
      <view
        class="wenzi wenzi4"
        :style="percent>74?'color:'+activeColor:'color:'+backgroundColor"
      >消费</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    progressInfo: {
      type: String,
      default () {
        return ''
      }
    },
    activeColor: {
      type: String,
      default () {
        return ''
      }
    },
    backgroundColor: {
      type: String,
      default () {
        return ''
      }
    },

  },
  data () {
    return {
      percent: 0
    }
  },
  mounted () {
    this.setPercent()
  },
  methods: {
    setPercent () {
      switch ( this.progressInfo ) {
        case '1':
          this.percent = 0
          break;
        case '2':
          this.percent = 35
          break;
        case '3':
          this.percent = 70
          break;
        case '4':
          this.percent = 100
          break;
      }
    }
  }
}
</script>

<style  scoped>
.info-top {
  width: 625upx;
  height: 38upx;
  padding-top: 38upx;
  margin-top: 20upx;
  position: relative;
  left: 50%;
  margin-left: -330upx;
}

.info-bottom {
  width: 100%;
  height: 40upx;
  position: relative;
}

.progress {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 19upx;
  transform: translate(0, -50%);
  border-radius: 10upx;
}

.stype {
  width: 38upx;
  height: 38upx;
  line-height: 38upx;
  text-align: center;
  border-radius: 50%;
  /* background: #dbdbdb; */
  font-size: 20upx;
  color: #fff;
  position: absolute;
  top: 50%;
  left: 0;
  margin-top: -19upx;
}

.garden2 {
  left: 33%;
}

.garden3 {
  left: 66%;
}

.garden4 {
  left: 100%;
}

.wenzi {
  font-size: 26upx;
  color: #9b9b9b;
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0upx;
}

.wenzi2 {
  left: 170upx;
}

.wenzi3 {
  left: 370upx;
}

.wenzi4 {
  left: 618upx;
}
</style>