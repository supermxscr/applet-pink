<template>
  <view
    class="pageInfo"
    :style="'height:'+windowHeight+'px'"
  >
    <view style=" background: #fff;margin-bottom:10upx;padding:40upx 20upx">
      <view class="top">
        <img
          src="./../../static/icon/success.png"
          class="top-icon"
          mode="widthFix"
        >
        <text>{{topTitle}}</text>
      </view>
      <view class="title">还差<text class="color">{{count}}人</text>赶快邀请好友来参团吧</view>
      <view>
        <text class="text">剩余</text>
        <countdown
          :timeInfo="timeInfo"
          class="countdown"
          v-if="timeInfo.endTime!=null"
        ></countdown>
      </view>
      <view class="userlist">
        <headimglist
          :listInfo="userListInfo"
          v-if="userListInfo.list.length>0"
        ></headimglist>
      </view>
      <view
        class="btn"
        v-if="count>0"
        @click="inviteNewUser"
      >邀请新用户参团</view>
      <view class="top-btxt">分享好友越多，成团越快</view>
    </view>
    <view class="btm-box">
      <view class="btm-list">
        <text class="list-left">拼团商品</text>
        <text class="list-right">{{details.activity.title}}</text>
      </view>
      <view class="btm-list">
        <text class="list-left">拼团时间</text>
        <text class="list-right">{{cartime}}</text>
      </view>
      <progressBar
        v-if="progressInfo!=null"
        :progressInfo="progressInfo"
        :activeColor="'#FA4B9B'"
        :backgroundColor="'#DBDBDB'"
      ></progressBar>
    </view>
    <!-- 海报 -->
    <view
      class="flex_row_c_c modalView"
      :class="qrShow?'show':''"
      @tap="hideQr()"
    >
      <view class="flex_column">
        <view class="backgroundColor-white padding1vh border_radius_10px">
          <image
            :src="poster.finalPath"
            mode="widthFix"
            class="posterImage"
          ></image>
        </view>
        <view class="flex_row marginTop2vh">
          <button
            class="shareBtn"
            size="small"
            @tap.prevent.stop="saveImage()"
          >保存图片</button>
          <!-- <button
            type="primary"
            size="mini"
            @tap.prevent.stop="share()"
          >分享图片</button> -->
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
import swiperC from "@/components/swiperC/swiperC.vue"
import countdown from "@/components/countdown/countdown.vue"
import uParse from '@/components/gaoyia-parse/parse.vue'
import headimglist from '@/components/other/userheadimg-list.vue'
import progressBar from '@/components/other/progress-bar.vue'
import _app from '@/util/QS-SharePoster/app.js';
import getSharePoster from '@/util/QS-SharePoster/QS-SharePoster.js';
export default {
  components: {
    swiperC,
    countdown,
    uParse,
    headimglist,
    progressBar
  },
  computed: {
  },
  data () {
    return {
      windowHeight: uni.getSystemInfoSync().windowHeight,
      topTitle: '',
      count: 0,
      timeInfo: {
        background: true,
        endTime: null,
        dianColor: true
      },
      userListInfo: {
        list: [],
        count: null
      },
      details: null,
      cartime: '',
      progressInfo: null,//进度条信息
      poster: {},
      qrShow: false,
      canvasId: 'default_PosterCanvasId',
      titleXY: { x: 0, y: 0 }
    }
  },
  onLoad ( option ) {
    console.log( option )
    this.topTitle = option.type == '1' ? '开团成功' : '拼团成功'
    this.getDetails( option.id )
  },
  methods: {
    // 拼团详情
    getDetails ( id ) {
      this.$request.get( API.startActivity + "/" + id ).then( res => {
        console.log( '拼团详情', res.data )
        if ( res && res.code == 0 ) {
          this.details = res.data
          this.count = res.data.activity.limitNum - res.data.recordList.length
          this.timeInfo.endTime = res.data.endTime
          this.userListInfo.list = res.data.recordList
          this.userListInfo.count = this.count
          for ( let i in res.data.recordList ) {
            if ( res.data.recordList[ i ].miniprogramOpenid == API.miniprogramOpenid ) {
              let time = this.$moment( res.data.recordList[ i ].createTime ).format( "YYYY-MM-DD HH:mm:ss" )
              this.cartime = time
            }
          }
          this.progressInfo = 2
        }
      } )
    },
    async inviteNewUser () {
      try {
        if ( !this.poster.finalPath ) {
          const d = await getSharePoster( {
            type: 'testShareType',
            posterCanvasId: this.canvasId,
            imagesArray: ( { bgObj, type, bgScale } ) => { //接收的第一个参数为背景图片的信息, 第二个参数是自定义标识（感觉这里用不到）, 图片为示例图片
              return [ {
                url: this.details.activity.shareImg,
                infoCallBack ( imageInfo ) {
                  let scale = bgObj.width * 0.2 / imageInfo.height;
                  return {
                    dWidth: imageInfo.width,
                    dx: ( bgObj.width - imageInfo.width ) / 2,
                    dy: ( bgObj.width - imageInfo.width ) / 2,
                  }
                }
              }, {
                url: this.details.qrcode,
                infoCallBack ( imageInfo ) {
                  console.log( 'imageInfo-------imageInfo', imageInfo )
                  let scale = bgObj.width * 0.3 / imageInfo.height;
                  return {
                    dWidth: imageInfo.width * scale,
                    dHeight: imageInfo.height * scale,
                    dx: 500,
                    dy: bgObj.height - 280
                  }
                }
              } ]
            },
            textArray: ( { bgObj, type, bgScale } ) => {
              console.log( 'bgObj----------------bgObj', bgObj )
              const fontSize = bgObj.width * 0.065;
              const lineHeight = bgObj.height * 0.04;
              return [ {
                fontStyle: 'italic',
                text: this.details.activity.title,
                size: fontSize,
                color: '#000000',
                textAlign: 'left',
                textBaseline: 'middle',
                lineFeed: {
                  maxWidth: 700,
                  lineHeight: 70,
                  lineNum: 2,
                  dx: -1
                },
                infoCallBack ( textLength ) {
                  _app.log( 'index页面的text的infocallback ，textlength:' + textLength );
                  return {
                    dx: 50,
                    dy: bgObj.height - 630
                  }
                }
              }, {
                fontStyle: 'italic',
                text: "¥ " + ( this.details.activity.integratePurchasePrice / 100 ).toFixed( 2 ),
                size: fontSize * 1.3,
                color: '#FA4B9B',
                textAlign: 'left',
                textBaseline: 'middle',
                infoCallBack ( textLength ) {
                  _app.log( 'index页面的text的infocallback ，textlength:' + textLength );
                  return {
                    dx: 50,
                    dy: bgObj.height - 480
                  }
                }
              },
              {
                fontStyle: 'italic',
                text: "¥ " + ( this.details.activity.productPrice / 100 ).toFixed( 2 ),
                size: fontSize * 0.8,
                color: '#cccccc',
                textAlign: 'left',
                textBaseline: 'middle',
                lineThrough: {
                  style: '#cccccc'
                },
                infoCallBack ( textLength ) {
                  _app.log( 'index页面的text的infocallback ，textlength:' + textLength );
                  return {
                    dx: 350,
                    dy: bgObj.height - 480
                  }
                }
              },
              {
                fontStyle: 'italic',
                text: "参与拼团",
                size: fontSize * 0.7,
                color: '#000000',
                textAlign: 'left',
                textBaseline: 'middle',
                infoCallBack ( textLength ) {
                  _app.log( 'index页面的text的infocallback ，textlength:' + textLength );
                  return {
                    dx: 50,
                    dy: bgObj.height - 180
                  }
                }
              },
              {
                fontStyle: 'italic',
                text: "长按识别小程序码",
                size: fontSize * 0.7,
                color: '#000000',
                textAlign: 'left',
                textBaseline: 'middle',
                infoCallBack ( textLength ) {
                  _app.log( 'index页面的text的infocallback ，textlength:' + textLength );
                  return {
                    dx: 50,
                    dy: bgObj.height - 120
                  }
                }
              }
              ]
            },
            setCanvasWH: ( { bgObj, type, bgScale } ) => { // 为动态设置画布宽高的方法，
              this.poster = bgObj;
            }
          } );
          console.log( '海报生成成功， 临时路径: ' + d.poster.tempFilePath )
          this.poster.finalPath = d.poster.tempFilePath;
        }
        this.qrShow = true;
      } catch ( e ) {
        _app.hideLoading();
        _app.showToast( JSON.stringify( e ) );
        console.log( JSON.stringify( e ) );
      }
    },
    saveImage () {
      // #ifndef H5
      uni.saveImageToPhotosAlbum( {
        filePath: this.poster.finalPath,
        success ( res ) {
          _app.showToast( '保存成功' );
        }
      } )
      // #endif
      // #ifdef H5
      _app.showToast( '保存了' );
      // #endif
    },
    share () {
      // #ifdef APP-PLUS
      _app.getShare( false, false, 2, '', '', '', this.poster.finalPath, false, false );
      // #endif

      // #ifndef APP-PLUS
      _app.showToast( '分享了' );
      // #endif
    },
    hideQr () {
      this.qrShow = false;
    }
  }
}
</script>

<style scoped>
.pageInfo {
  height: 100%;
  box-sizing: border-box;
  text-align: center;
  background: rgba(0, 0, 0, 0.04);
}
.top {
  text-align: center;
  font-size: 25px;
  color: #fa4b9b;
  margin-bottom: 40upx;
}
.top-icon {
  width: 60upx;
  height: 60upx;
  vertical-align: sub;
  margin-right: 20upx;
}
.title {
  font-size: 17px;
  color: #000;
  margin-bottom: 20upx;
}

.color {
  color: #fa4b9b;
}
.countdown {
  display: inline-block;
  vertical-align: middle;
  color: #000;
}
.text {
  font-size: 15px;
  margin-right: 10upx;
}

.userlist {
  margin: 50upx 0;
}
.btn {
  width: 100%;
  height: 100upx;
  line-height: 100upx;
  text-align: center;
  color: #fff;
  background: #fa4b9b;
  font-size: 18px;
  border-radius: 4upx;
  margin-bottom: 30upx;
}
.top-btxt {
  font-size: 13px;
  color: #9b9b9b;
}
.btm-box {
  width: 100%;
  background: #fff;
  padding: 30upx 40upx;
  box-sizing: border-box;
}
.btm-list {
  height: 80upx;
  width: 100%;
  font-size: 15px;
  color: #9b9b9b;
  text-align: left;
}
.list-left {
  display: inline-block;
  line-height: 80upx;
  text-align: left;
}
.list-right {
  float: right;
  color: #000;
  line-height: 80upx;
  width: 80%;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 海报 */
.shareBtn {
  color: #fff;
  background: #fa4b9b;
  font-size: 14px;
  border-radius: 40upx;
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

.flex_row_c_c {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.modalView {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  outline: 0;
  transform: scale(3);
  perspective: 2500upx;
  background: rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease-in-out;
  pointer-events: none;
  backface-visibility: hidden;
  z-index: 999;
}

.modalView.show {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
}

.flex_column {
  display: flex;
  flex-direction: column;
}

.backgroundColor-white {
  background-color: white;
}

.border_radius_10px {
  border-radius: 10px;
}

.padding1vh {
  padding: 1vh;
}

.posterImage {
  width: 60vw;
}

.flex_row {
  display: flex;
  flex-direction: row;
}

.marginTop2vh {
  margin-top: 2vh;
}
</style>
