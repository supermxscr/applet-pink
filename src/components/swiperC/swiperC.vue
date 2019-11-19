<!-- 
{
 indicatorDots: true,       // 是否显示面板指示点 默认 true
 indicator-color:  ,        // 指示点颜色 默认 rgba(0, 0, 0, .3)
 indicator-active-color: ,  // 当前选中的指示点颜色 默认 #000
 height:150,                // swiper 高度 单位 px 默认 150
 autoplay: false,           // 是否自动播放 默认 false
 interval: 1500,            // 自动切换时间间隔 默认 1500
 duration:1000,             // 滑动动画时长 默认 1000
 imgUrls: [{
   img:'',   // 图片地址
   url:''   // 跳转地址
 }],(必填)                   // 轮播图片数组 必填
 circular:true,             // 是否采用衔接滑动 默认 true
 }
 -->
<template>
  <view
    class="page"
    :style="{height: swiperInfo.height+'px !important;'}"
  >
    <swiper
      :indicator-dots="swiperInfo.indicatorDots?swiperInfo.indicatorDots:true"
      :style="{height: swiperInfo.height+'px !important;'}"
      :autoplay="swiperInfo.autoplay"
      :interval="swiperInfo.interval?swiperInfo.interval:1500"
      :duration="swiperInfo.duration?swiperInfo.duration:1000"
      :circular="swiperInfo.circular?swiperInfo.circular:true"
      @change="bannerChange"
    >

      <swiper-item
        v-for="(item,index) in swiperInfo.imgUrls"
        :key="item"
      >
        <image
          v-bind:src="item.img"
          style="width:100%"
          mode="widthFix"
          @click="bannerJump(item,index)"
        ></image>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  name: 'SwiperC',
  props: {
    swiperInfo: {},
  },
  data () {
    return {
    }
  },
  created () {

  },
  onLoad () {
  },
  methods: {
    bannerJump ( data ) {
      // 父组件通信事件
      this.$emit( 'bannerJump', data )
    },
    bannerChange ( e ) {
      let height, windowWidth
      let that = this
      uni.getSystemInfo( {
        success: function ( res ) {
          windowWidth = res.windowWidth
          uni.getImageInfo( {
            src: that.swiperInfo.imgUrls[ e.detail.current ].img,
            success: function ( image ) {
              console.log( '图片宽', image.width )
              console.log( '图片高', image.height )
              height = windowWidth * image.height / image.width
              that.$emit( 'bannerChange', height )
            }
          } )
        }
      } )
    }
  }
}
</script>

<style>
</style>
