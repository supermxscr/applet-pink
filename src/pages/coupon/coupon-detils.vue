
<template>
  <view
    class="pageInfo"
    :style="'min-height:'+windowHeight+'px'"
  >
    <view class="main">
      <view class="top">
        <view class="title">栎悦医美新人优惠券</view>
        <view class="top-info">满200减10优惠券</view>
        <view class="circle circle-left"></view>
        <view class="circle circle-right"></view>
      </view>
      <view class="coupon-info">
        <view class="qrcode">
          <image
            :src="poster.finalPath"
            mode="widthFix"
            class="posterImage"
          ></image>
        </view>
        <view class="info">
          <text class="lable">优惠说明</text>
          <view class="r-info">满200减30元优惠，不可与其他优惠共享满200减30元优惠，不可与其他优惠共享满200减30元优惠，不可与其他优惠共享满200减30元优惠，不可与其他优惠共享满200减30元优惠，不可与其他优惠共享</view>
        </view>
        <view class="info">
          <text class="lable">电话</text>
          <view class="r-info">021-5674201</view>
        </view>
        <view class="info">
          <text class="lable">适用商品</text>
          <view class="r-info">适用商品</view>
        </view>
        <view class="info">
          <text class="lable">不适用商品</text>
          <view class="r-info">不适用商品</view>
        </view>
        <view class="info">
          <text class="lable">可用时间</text>
          <view class="r-info">可用时间</view>
        </view>
        <view class="info">
          <text class="lable">使用须知</text>
          <view class="r-info">使用须知</view>
        </view>
      </view>
    </view>
    <view class="hideCanvasView">
      <canvas
        class="hideCanvas"
        canvas-id="default_PosterCanvasId"
        :style="{width: (poster.width||0) + 'px', height: (poster.height||0) + 'px'}"
      ></canvas>
    </view>
  </view>

</template>

<script>
import API from "@/api/config.js"
import _app from '@/util/QS-SharePoster/app.js';
import getSharePoster from '@/util/QS-SharePoster/QS-SharePoster.js';
export default {
  components: {

  },
  computed: {
  },
  data () {
    return {
      windowHeight: uni.getSystemInfoSync().windowHeight,
      details: {},
      poster: {},
      qrShow: false,
      canvasId: 'default_PosterCanvasId',
    }
  },
  onLoad ( options ) {
    this.getDetils( options.id )

  },
  created () {
  },

  methods: {

    getDetils ( id ) {
      this.$request.get( API.getBanner + "?applyTo=1" ).then( res => {
        console.log( 'detils', res.data )
        if ( res && res.code == 0 ) {
          this.inviteNewUser( '1231qewid' )
        }
      } )
    },
    async inviteNewUser ( qrcodeinfo ) {
      try {
        if ( !this.poster.finalPath ) {
          const d = await getSharePoster( {
            type: qrcodeinfo,
            posterCanvasId: this.canvasId,
            qrCodeArray: ( { bgObj, type, bgScale } ) => {
              return [ {
                text: '你好，我是取舍',
                background: '#fff',
                foreground: "#000",
                size: bgObj.width,
                dx: 0,
                dy: 0
              } ]
            },
            setCanvasWH: ( { bgObj, type, bgScale } ) => { // 为动态设置画布宽高的方法，
              this.poster = bgObj;
            }
          } )
          this.poster.finalPath = d.poster.tempFilePath;
        }

        this.qrShow = true;
      } catch ( e ) {
        _app.hideLoading();
        _app.showToast( JSON.stringify( e ) );
        console.log( JSON.stringify( e ) );
      }
    },
  }
}
</script>

<style scoped>
.pageInfo {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background: #f1f1f1;
  padding: 32upx;
}
.main {
  width: 100%;
  background: #fff;
  border-radius: 10upx;
}
.top {
  width: 90%;
  height: 230upx;
  margin: 0 auto;
  text-align: center;
  border-bottom: 1px dotted rgba(0, 0, 0, 0.25);
}
.title {
  font-size: 24px;
  color: #333333;
  font-weight: bold;
  padding-top: 50upx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.top-info {
  font-size: 14px;
  color: #333333;
  margin-top: 30upx;
}
.circle {
  width: 30upx;
  height: 30upx;
  background: #f1f1f1;
  border-radius: 50%;
  margin-top: 5px;
}
.circle-left {
  float: left;
  margin-left: -25px;
}
.circle-right {
  float: right;
  margin-right: -25px;
}
.coupon-info {
  width: 100%;
  padding: 40upx;
  box-sizing: border-box;
}
.hideCanvasView {
  position: relative;
}

.hideCanvas {
  position: fixed;
  top: -99999upx;
  left: -99999upx;
  z-index: -99999;
}
.qrcode {
  width: 300upx;
  height: 300upx;
  overflow: hidden;
  margin: 0 auto;
  margin-bottom: 40upx;
}
.posterImage {
  width: 300upx;
}

.info {
  width: 100%;
  font-size: 12px;
  color: #999999;
  text-align: left;
  line-height: 50upx;
  margin-bottom: 20upx;
}
.lable {
  display: inline-block;
  vertical-align: top;
  width: 25%;
}
.r-info {
  width: 75%;
  display: inline-block;
}
</style>
