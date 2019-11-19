<template>
  <view class="pageInfo">
    <swiper-c
      :swiperInfo="swiperInfo"
      @bannerChange="bannerChange"
    ></swiper-c>
    <view class="top-info">
      <view class="title">{{details.title}}</view>
      <view class="price"><text style="color:#FA4B9B;font-size:22px;">¥ {{details.price/100}}</text>/次</view>
      <view class="top-tools">
        <img
          src="../../static/icon/prcduct-details-1.png"
          class="top-tools-icon"
        >安全保障
      </view>
      <view class="top-tools">
        <img
          src="../../static/icon/prcduct-details-2.png"
          class="top-tools-icon"
        >闪电退款
      </view>
      <view class="top-tools">
        <img
          src="../../static/icon/prcduct-details-3.png"
          class="top-tools-icon"
        >先行赔付
      </view>
    </view>
    <view class="info">
      <view class="info-title">商品详情</view>
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
      </view>
      <view
        class="tools-li subBtn"
        @click="sub('bottom', 'share')"
      >立即购买
      </view>
    </view>
    <uni-popup
      ref="share"
      :custom="true"
      :type="type"
    >
      <view
        class="box"
        :animation="animationData"
      >
        <img
          src="../../static/icon/close.png"
          class="box-closeBtn"
          mode="widthFix"
          @click="closeBox('share')"
        >
        <view class="box-top">
          <img
            :src="details.listImg"
            class="box-pd-img"
          >
          <view class="box-title">{{details.title}}</view>
          <view class="box-price"><text style="color:#FA4B9B;font-size:16px;">¥ {{details.productSkuList[chooseIndex].price/100}}</text></view>
          <view class="box-choosesku">已选择:{{details.productSkuList[chooseIndex].property}}</view>
        </view>
        <view class="box-tit">规格</view>
        <view
          v-for="(item,index) in details.productSkuList"
          :key="item"
          :class="index==chooseIndex?'box-skubox box-active':'box-skubox'"
          @click="chooseSku(index)"
        >
          {{item.property}}
        </view>
        <view class="box-tit">数量</view>
        <view
          class="number"
          @click="setNumber('minus')"
        >-</view>
        <view class="number number1">{{numberValue}}</view>
        <view
          class="number number2"
          @click="setNumber('plus')"
        >+</view>
        <view
          class="btn"
          @click="subOrder"
        >提交订单</view>
      </view>

    </uni-popup>
  </view>
</template>

<script>
import API from "@/api/config.js"
import swiperC from "@/components/swiperC/swiperC.vue"
import uParse from '@/components/gaoyia-parse/parse.vue'
import uniPopup from '@/components/uni-popup/uni-popup.vue'
export default {
  components: {
    swiperC,
    uParse,
    uniPopup,
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
      liked: 'zan',
      isAlertBox: true,
      chooseIndex: 0,
      type: '',
      numberValue: 1
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
      path: '/page/product-details/product-details?id=' + this.id
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
      this.$request.get( API.productDetails + this.id ).then( res => {
        console.log( '商品详情', res.data )
        if ( res && res.code == 0 ) {
          res.data.img = JSON.parse( res.data.img )
          this.details = res.data
          this.swiperInfo.imgUrls = []
          for ( let i in res.data.img ) {
            res.data.img[ i ] = res.data.img[ i ].replace( "http:", "https:" )
            this.swiperInfo.imgUrls.push( {
              img: res.data.img[ i ]
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
    },
    sub ( type, open ) {
      this.type = type

      this.$refs[ open ].open()
    },
    setNumber ( value ) {
      if ( this.numberValue == 1 && value == "minus" ) {
        uni.showToast( {
          title: '数量不可小于1',
          duration: 2000
        } )
        return
      }
      this.numberValue = value == "minus" ? this.numberValue - 1 : this.numberValue + 1
    },
    chooseSku ( index ) {
      this.chooseIndex = index
    },
    closeBox ( type ) {
      this.$refs[ type ].close()
    },
    subOrder () {
      let data = {
        productInfo: this.details,
        chooseIndex: this.chooseIndex,
        leasenum: this.numberValue
      }
      uni.setStorageSync( 'commodity', data )
      uni.navigateTo( {
        url: "/pages/order/sub-order"
      } )
    }
  }
}
</script>

<style scoped>
.pageInfo {
  width: 100%;
  background: #f1f1f1;
}
.info {
  font-size: 28upx;
  padding: 0 36upx;
  color: #000;
  line-height: 50upx;
  padding-bottom: 200upx;
  background: #fff;
}
.info-title {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #1f1f1f;
  letter-spacing: 0;
  line-height: 96upx;
}
.top-info {
  padding: 36upx;
  background: #fff;
  margin-bottom: 10upx;
}
.title {
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #000000;
}
.price {
  font-size: 12px;
  color: #9b9b9b;
  margin: 20upx 0;
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
  margin-top: 17upx;
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
.top-tools {
  width: 160upx;
  display: inline-block;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #000000;
  margin-right: 34upx;
}
.top-tools-icon {
  width: 16px;
  height: 16px;
  margin-right: 20upx;
  vertical-align: middle;
}
.subBtn {
  width: 300upx;
  height: 70upx;
  line-height: 70upx;
  text-align: center;
  color: #fff;
  background: #fa4b9b;
  font-size: 15px;
  margin: 0;
}

.box {
  width: 100%;
  min-height: 800upx;
  background: #fff;
  border-radius: 24upx 24upx 0px 0px;
  position: absolute;
  bottom: 0;
  padding: 40upx;
  box-sizing: border-box;
}
.box-top {
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 34upx;
  line-height: 50upx;
}
.box-pd-img {
  width: 156upx;
  height: 156upx;
  float: left;
  margin-right: 30upx;
}
.box-title {
  font-size: 14px;
  color: #000000;
}
.box-price {
  font-size: 12px;
  color: #9b9b9b;
}
.box-choosesku {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
}
.box-closeBtn {
  position: absolute;
  right: 30upx;
  top: 30upx;
  width: 48upx;
}
.box-tit {
  font-size: 14px;
  color: #000000;
  margin: 30upx 0;
}
.box-skubox {
  width: 200upx;
  height: 66upx;
  border: 1px solid rgba(0, 0, 0, 0.1);
  line-height: 66upx;
  text-align: center;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
  margin-right: 26upx;
}

.box-active {
  background: #fce4ec;
  color: #fa4b9b;
  border: none;
}

.number {
  width: 44upx;
  height: 44upx;
  border: 1px solid #fa4b9b;
  border-radius: 2px;
  background: #fff;
  color: #fa4b9b;
  float: left;
  line-height: 33upx;
  text-align: center;
  box-sizing: border-box;
}
.number1 {
  width: 88upx;
  height: 44upx;
  border: none;
  color: #000;
  line-height: 44upx;
}
.number2 {
  color: #fff;
  background: #fa4b9b;
}
.btn {
  width: 674upx;
  height: 100upx;
  text-align: center;
  line-height: 100upx;
  color: #fff;
  background: #fa4b9b;
  font-size: 18px;
  margin-top: 70px;
  border-radius: 2px;
}
</style>
