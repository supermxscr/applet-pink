<template>
  <view class="pageInfo">
    <swiper-c
      :swiperInfo="swiperInfo"
      @bannerChange="bannerChange"
    ></swiper-c>
    <view class="title">{{details.title}}</view>
    <!-- 富文本 -->
    <view class="info">
      <uParse :content="details.description"></uParse>
    </view>
    <view class="tools-footer">
      <view
        class="tools-li"
        @click="setLikedOrCollected(1)"
      >
        <img
          :src="'../../static/icon/'+liked+'.png'"
          class="tools-icon"
          mode="widthFix"
        >
        点赞
      </view>
      <view
        class="tools-li"
        @click="setLikedOrCollected(2)"
      >
        <img
          :src="'../../static/icon/'+collected+'.png'"
          class="tools-icon"
          mode="widthFix"
        >
        收藏
      </view>
      <view
        class="tools-li"
        @click="setForward"
      >
        <button
          open-type="share"
          class="tools-icon shareBtn"
        >
          <img
            src="@/static/icon/share.png"
            class="tools-icon"
            mode="widthFix"
          >
        </button>

        分享
      </view>
    </view>
  </view>
</template>

<script>
import API from "@/api/config.js"
import swiperC from "@/components/swiperC/swiperC.vue"
import uParse from '@/components/gaoyia-parse/parse.vue'
export default {
  components: {
    swiperC,
    uParse
  },
  computed: {
  },
  data () {
    return {
      id: null,
      // banner数据
      swiperInfo: {
        imgUrls: [],
        height: 150,
        autoplay: false
      },
      details: null,
      collected: 'shoucang',
      liked: 'zan'
    }
  },
  onLoad ( option ) {
    this.id = option.id
    this.getDetails()
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage ( res ) {
    if ( res.from === 'button' ) {
      this.setForward()
    }
    return {
      title: this.details.title,
      path: '/page/explore-details/explore-details?id=' + this.id
    }
  },
  methods: {
    setImageHeight ( data ) {
      let that = this
      let windowWidth
      uni.getSystemInfo( {
        success: function ( res ) {
          windowWidth = res.windowWidth
          uni.getImageInfo( {
            src: data,
            success: function ( image ) {
              that.swiperInfo.height = windowWidth * image.height / image.width
            }
          } )
        }
      } )
    },
    // banner change
    bannerChange ( data ) {
      this.swiperInfo.height = data
    },
    getDetails () {
      this.$request.get( API.findDetails + "?contentId=" + this.id + "&miniprogramOpenid=" + API.miniprogramOpenid ).then( res => {
        console.log( '探索详情', res.data )
        if ( res && res.code == 0 ) {
          res.data.detailImg = JSON.parse( res.data.detailImg )
          this.details = res.data
          this.collected = res.data.collected ? 'shoucang-c' : 'shoucang'
          this.liked = res.data.liked ? 'zan-c' : 'zan'
          this.swiperInfo.imgUrls = []
          for ( let i in res.data.detailImg ) {
            res.data.detailImg[ i ] = res.data.detailImg[ i ].replace( "http:", "https:" )
            this.swiperInfo.imgUrls.push( {
              img: res.data.detailImg[ i ]
            } )
          }
          this.setImageHeight( this.swiperInfo.imgUrls[ 0 ].img )
        }
      } )
    },
    //点赞 or 收藏
    setLikedOrCollected ( type ) {
      let flag = null
      flag = type == 1 ? !this.details.liked : !this.details.collected
      let data = {
        'contentId': this.details.id,
        'miniprogramOpenid': API.miniprogramOpenid,
        'unionid': API.unionid,
        'flag': !flag,
        'type': type
      }
      this.$request.put( API.contentAndMark, {
        data
      } ).then( res => {
        console.log( '点赞or收藏', res )
        if ( res && res.code == 0 ) {
          this.getDetails()
        }
      } )
    },
    // 转发
    setForward () {
      this.$request.put( API.forward + this.id, {} ).then( res => {
        console.log( '转发', res.data )
        if ( res && res.code == 0 ) {
          // this.getDetails()
        }
      } )
    }
  }
}
</script>

<style scoped>
.pageInfo {
  width: 100%;
}
.title {
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #000000;
  text-align: center;
  width: 480upx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 auto;
  line-height: 80upx;
}
.info {
  font-size: 28upx;
  padding: 0 30upx;
  color: #000;
  line-height: 50upx;
  padding-bottom: 200upx;
}
.tools-footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  font-size: 11px;
  text-align: center;
  padding: 24upx 36upx;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.tools-li {
  width: 50upx;
  float: left;
  margin-right: 50upx;
}
.tools-li:nth-child(3) {
  float: right;
  margin-right: 0;
}
.tools-icon {
  display: inline-block;
  width: 36upx;
}
.tools-icon:nth-child(2) {
  width: 40upx;
}
.tools-icon:nth-child(3) {
  width: 32upx;
}
.shareBtn {
  background: transparent;
  line-height: 0;
  padding: 0;
  border-radius: 0;
  border: none !important;
}
button::after {
  border: none;
}
</style>
