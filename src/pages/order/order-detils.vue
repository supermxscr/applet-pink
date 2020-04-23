<template>
  <view
    class="pageInfo"
    :style="'min-height:'+windowHeight+'px'"
  >
    <view class="top">
      <view class="status">待支付</view>
      <view class="time">订单将于1小时30分30秒后关闭</view>
      <img
        :src="'../../static/images/order-status'+orderStatus+'.png'"
        class="statusimg"
        mode="widthFix"
      >
    </view>
    <view class="bgc">
      <view class="tit">订单商品</view>
      <view
        class="info"
        v-for="item in details"
        :key="item.id"
      >
        <img
          :src="item.productListImg"
          class="img"
          mode="widthFix"
        >
        <view class="right f-r">
          <view class="title">title</view>
          <view class="ccc-color m-t">0.8L</view>
          <view style="width:100%;"><text class="pink-color f-l">¥ {{i.orderPrice}}</text><text class="ccc-color f-r">x {{item.productQuantity}}</text></view>
        </view>
      </view>
    </view>
    <view class="bgc">
      <view class="price">
        <text class="lable ccc-color">商品金额</text>
        <text class="lable pink-color f-r">¥ 4500.00</text>
      </view>
      <view class="price m-t">
        <text class="lable ccc-color">优惠</text>
        <text class="lable pink-color f-r">- 4500.00</text>
      </view>
      <view class="price">
        <text class="lable b-color">实际支付</text>
        <text class="lable pink-color f-r f-s21">¥ 4500.00</text>
      </view>
    </view>
    <view class="bgc m-b80">
      <view class="price ccc-color ">订单编号：1565779876467</view>
      <view class="price ccc-color m-t">下单时间：2019.11.11 22:13:13</view>
      <view class="price ccc-color ">支付方式：微信支付</view>
    </view>
    <view class="bgc btm">
      <view class="btn pink-bor  pink-color f-r">立即支付</view>
      <view class="btn ccc-bor  ccc-color f-r">取消订单</view>
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
      details: [ {
        id: 1,
        productListImg: "http://yueyue.mchances.com/image/2.jpg",
        orderPrice: 1,
        productQuantity: 10
      } ],
      orderStatus: 1
    }
  },
  onLoad ( options ) {
    // this.getDetils( options.id )
  },
  created () {
  },
  methods: {
    getDetils ( id ) {
      this.$request.get( API.getBanner + "?applyTo=1" ).then( res => {
        console.log( 'detils', res.data )
        if ( res && res.code == 0 ) {

        }
      } )
    },

  }
}
</script>

<style scoped>
.pageInfo {
  width: 100%;
  box-sizing: border-box;
  background: #f1f1f1;
  font-size: 14px;
  color: #000;
}

.top {
  width: 100%;
  height: 240upx;
  background: #fa4b9b;
  color: #fff;
  margin-bottom: 20upx;
  box-sizing: border-box;
  padding-top: 52upx;
  position: relative;
}
.status {
  font-size: 24px;
  margin-left: 56upx;
}
.time {
  margin-left: 56upx;
  margin-top: 20upx;
}
.statusimg {
  width: 126upx;
  position: absolute;
  right: 52upx;
  top: 38upx;
}
.bgc {
  width: 100%;
  background: #fff;
  padding: 40upx 32upx;
  box-sizing: border-box;
  margin-bottom: 20upx;
}
.tit {
  font-weight: bold;
  margin-bottom: 20upx;
}
.info {
  height: 160upx;
  width: 100%;
  overflow: hidden;
}
.img {
  width: 160upx;
  vertical-align: top;
}
.right {
  display: inline-block;
  width: 75%;
  height: 100%;
  padding-left: 30upx;
  box-sizing: border-box;
}
.title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.f-r {
  float: right;
}
.f-l {
  float: left;
}
.pink-color {
  color: #fa4b9b;
}
.b-color {
  color: #000;
  font-size: 16px;
  font-weight: bold;
}
.f-s21 {
  font-size: 21px;
}
.ccc-color {
  color: rgba(0, 0, 0, 0.5);
}
.m-t {
  margin: 20upx 0;
}
.t-r {
  text-align: right;
}
.btm {
  position: fixed;
  bottom: 0;
  left: 0;
  margin-bottom: 0;
}
.btn {
  width: 230upx;
  line-height: 72upx;
  text-align: center;
  border-radius: 100upx;
  margin-right: 20upx;
}
.ccc-bor {
  border: 1px solid rgba(0, 0, 0, 0.5);
}
.pink-bor {
  border: 1px solid #fa4b9b;
}
.m-b80 {
  margin-bottom: 200upx;
}
</style>
