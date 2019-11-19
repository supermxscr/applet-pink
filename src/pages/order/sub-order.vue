<template>
  <view class="pageInfo">
    <view
      class="chooseAddress"
      @click="changeAddress"
    >
      <view
        class="choose-txt"
        v-if="!isAddress"
      >请选择收货地址</view>
      <view
        class="address-name"
        v-if="isAddress"
      >
        {{addressInfo.name}} {{addressInfo.phone}}
      </view>
      <view
        class="address"
        v-if="isAddress"
      >
        {{addressInfo.address}}
      </view>
    </view>
    <view class="product-info">
      <view class="title">商品订单</view>
      <view class="box-top">
        <img
          :src="detailInfo.productInfo.listImg"
          class="box-pd-img"
        >
        <view class="box-title">{{detailInfo.productInfo.title}}</view>
        <view class="box-choosesku">{{detailInfo.productInfo.productSkuList[detailInfo.chooseIndex].property}}</view>
        <view class="box-price">
          <text style="color:#FA4B9B;font-size:16px;">¥ {{detailInfo.productInfo.productSkuList[detailInfo.chooseIndex].price/100}}</text>
          <text class="count">X{{detailInfo.leasenum}}</text>
        </view>
      </view>
    </view>
    <!-- 优惠券 -->
    <view class="coupon">
      <view class="left">优惠券</view>
      <picker
        @change="couponChange"
        :value="coupoIndex"
        mode='selector'
        :range="couponData"
        class="couponPicker"
      >
        <view class="uni-input">{{couponData[coupoIndex]}}</view>
      </picker>
    </view>
    <!-- 用户协议 -->
    <view class="protocol">
      <label>
        <checkbox
          value="cb"
          checked="true"
          color="#FA4B9B"
          style="transform:scale(0.6)"
        />我同意
      </label>
      <text style="color:#000">《上海栎悦医美平台用户协议》</text>
    </view>
    <view class="tools-footer">
      <view class="tools-li price">实付金额:<text style="color:#fa4b9b;">¥ {{amount}}</text></view>
      <view
        class="tools-li subBtn"
        @click="sub"
      >立即付款
      </view>
    </view>
  </view>
</template>

<script>
import API from "@/api/config.js"
export default {
  components: {
  },
  computed: {
  },
  data () {
    return {
      detailInfo: null,
      amount: 0,//实付金额
      isAddress: false,
      addressInfo: {},
      coupoIndex: 0,
      couponData: [ '请选择优惠券', '优惠券1', '优惠券2', '优惠券3' ],
      addressId: null
    }
  },
  onLoad ( option ) {
    if ( option.addressId ) {
      this.addressId = option.addressId
    }
    this.getDetails()
    this.getAddress()
  },

  methods: {

    getDetails () {
      this.detailInfo = uni.getStorageSync( 'commodity' )
      console.log( 'this.detailInfo', this.detailInfo )
      this.amount = ( this.detailInfo.productInfo.productSkuList[ this.detailInfo.chooseIndex ].price * this.detailInfo.leasenum / 100 ).toFixed( 2 )
    },
    getAddress () {
      this.$request.get( API.getAddress + "?openid=" + API.miniprogramOpenid ).then( res => {
        console.log( '获取地址', res )
        if ( res && res.code == 0 ) {
          if ( res.data.data.length > 0 ) {
            if ( this.addressId != null ) {
              for ( let i in res.data.data ) {
                if ( res.data.data[ i ].id == this.addressId ) {
                  this.addressInfo = res.data.data[ i ]
                }
              }
            } else {
              this.addressInfo = res.data.data[ 0 ]
            }
            this.isAddress = true

          } else {
            this.isAddress = false
          }
        }
      } )
    },
    couponChange ( e ) {
      this.coupoIndex = e.detail.value
    },
    changeAddress () {
      uni.navigateTo( {
        url: '/pages/address/address-list'
      } )
    },
    sub () {

    }
  }
}
</script>

<style scoped>
page {
  height: 100%;
}
.pageInfo {
  width: 100%;
  height: 100%;
  background: #f1f1f1;
  box-sizing: border-box;
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
  float: left;
  margin-right: 50upx;
}
.price {
  font-size: 18px;
  color: #000000;
  line-height: 70upx;
}
.tools-li:nth-child(2) {
  float: right;
  margin-right: 0;
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
.subBtn {
  width: 300upx;
  height: 70upx;
  line-height: 70upx;
  text-align: center;
  color: #fff;
  background: #fa4b9b;
  font-size: 15px;
  margin: 0;
  border-radius: 4px;
}

/* 地址 */
.chooseAddress {
  width: 100%;
  padding: 28upx;
  margin-bottom: 16upx;
  color: #000;
  font-size: 14px;
  background: #fff;
  /* line-height:  */
  height: 80upx;
}
.choose-txt {
  line-height: 80upx;
}
.address {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
}
/* 商品 */
.product-info {
  width: 100%;
  padding: 30upx;
  background: #fff;
  margin-bottom: 16upx;
  color: #000;
  font-size: 14px;
  box-sizing: border-box;
}
.title {
  margin-bottom: 30upx;
}
.box-top {
  width: 100%;
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
.box-choosesku {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
}
.box-price {
  font-size: 12px;
  color: #9b9b9b;
}
.count {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  float: right;
}
/* 优惠券 */
.coupon {
  width: 100%;
  background: #fff;
  margin-bottom: 16upx;
  color: #000;
  font-size: 14px;
  box-sizing: border-box;
  line-height: 104upx;
  height: 104upx;
  padding: 0 28upx;
  position: relative;
}
.left {
  width: 120upx;
  position: absolute;
  top: 50%;
  left: 28upx;
  transform: translate(0, -50%);
}
.uni-input {
  width: 70%;
  position: absolute;
  right: 0;
  margin-right: 28upx;
  text-align: right;
}

/* 用户协议 */
.protocol {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
  padding: 10upx 28upx;
  background: #fff;
}
</style>
