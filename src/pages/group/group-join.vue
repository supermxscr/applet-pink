<template>
  <view
    class="pageInfo"
    :style="'min-height:'+windowHeight+'px'"
  >

    <view class="top-info">
      <swiper-c
        :swiperInfo="swiperInfo"
        @bannerJump="bannerJump"
        @bannerChange="bannerChange"
      ></swiper-c>
      <view>{{details.activity.title}}</view>
      <view class="top-price">¥ {{details.activity.productPrice/100}}<text class=" btm-left">拼团省{{(details.activity.productPrice-details.activity.integratePurchasePrice)/100}}</text></view>

      <view class=" btm-right">{{userNum}}人已拼团</view>
    </view>
    <view style=" background: #fff;margin-bottom:10upx;padding:40upx 20upx">
      <view class="top">
        - {{topText}} -
      </view>
      <view
        v-if=" details.status ==4"
        class="text"
      >{{details.endTime}}已结束</view>
      <view
        class="title"
        v-if="timeInfo.endTime!=null && details.status ==4"
      >还差<text class="color">{{count}}人</text>参团就成功啦，记得邀请好友</view>
      <view
        class="title"
        v-if="details.status ==2"
      >就差你啦，参团可以省 ¥ {{details.activity.integratePurchasePrice / 100}}</view>
      <view>
        <countdown
          :timeInfo="timeInfo"
          class="countdown"
          v-if="timeInfo.endTime!=null && details.status ==2"
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
        @click="btnClick"
      >{{btnText}}</view>
    </view>
    <view class="btm-box">
      <progressBar
        v-if="progressInfo!=null && details.status ==4"
        :progressInfo="progressInfo"
        :activeColor="'#FA4B9B'"
        :backgroundColor="'#DBDBDB'"
      ></progressBar>
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
      // banner数据
      swiperInfo: {
        imgUrls: [],
        height: 150,
        autoplay: false
      },
      windowHeight: uni.getSystemInfoSync().windowHeight,
      btnText: "",
      topText: "",
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
      userNum: 0,
      payDetail: {
        orderNo: null,
        totalAmount: null,
        unionid: API.unionid,
        openid: API.miniprogramOpenid,
        payOrderItems: [ {
          paymentType: "wechat",
          paymentTypeId: 1,
          amount: null,
          extendInfo: {
            paymentType: 3
          }
        } ]
      },
      integratePurchaseId: null
    }
  },
  onLoad ( option ) {
    console.log( option )
    this.getDetails( option.id )
    this.getActivityCountNUm( option.id )
  },
  methods: {
    setImageHeight ( data ) {
      let windowWidth
      let that = this
      uni.getSystemInfo( {
        success: function ( res ) {
          windowWidth = res.windowWidth
          uni.getImageInfo( {
            src: data,
            success: image => {
              that.swiperInfo.height = windowWidth * image.height / image.width
            }
          } )
        }
      } )
    },
    // 拼团详情
    getDetails ( id ) {
      this.$request.get( API.startActivity + "/" + id ).then( res => {
        console.log( '拼团详情', res.data )
        if ( res && res.code == 0 ) {
          this.swiperInfo.imgUrls = []
          //  <!-- 1 未开团  2 已开团 3 已成团 4 失败-->
          this.details = res.data
          this.count = res.data.activity.limitNum - res.data.recordList.length
          this.timeInfo.endTime = res.data.endTime
          this.userListInfo.list = res.data.recordList
          this.userListInfo.count = this.count
          this.details.endTime = this.$moment( this.details.endTime * 1000 ).format( "YYYY-MM-DD HH:mm:ss" )
          for ( let i in res.data.recordList ) {
            if ( res.data.recordList[ i ].miniprogramOpenid == API.miniprogramOpenid ) {
              let time = this.$moment( res.data.recordList[ i ].createTime ).format( "YYYY-MM-DD HH:mm:ss" )
              this.cartime = time
            }
          }
          res.data.activity.integratePurchaseImg = JSON.parse( res.data.activity.integratePurchaseImg )
          for ( let i in res.data.activity.integratePurchaseImg ) {
            this.swiperInfo.imgUrls.push( { img: res.data.activity.integratePurchaseImg[ i ] } )
          }
          this.setImageHeight( this.swiperInfo.imgUrls[ 0 ].img )
          this.progressInfo = 2
          this.setText()
        }
      } )
    },
    // 获取已拼团人数
    getActivityCountNUm ( id ) {
      this.$request.get( API.activityCount + id ).then( res => {
        console.log( '已拼团人数', res.data )
        if ( res && res.code == 0 ) {
          this.userNum = res.data
        }
      } )
    },
    setText () {
      switch ( this.details.status ) {
        case 2:
          this.topText = "距结束"
          this.btnText = "一键参团 ¥ " + ( this.details.activity.integratePurchasePrice / 100 ).toFixed( 2 )
          this.joinActivity()
          break;
        case 3:
          this.topText = "拼团成功"
          this.btnText = "去使用"
          uni.navigateTo( {
            url: "./../order/order-list?orderType=2"
          } )
          break;
        case 4:
          this.topText = "拼团失败"
          this.btnText = "去查看其他活动"

          break;
      }
    },
    joinActivity () {
      let data = {
        integratePurchaseId: this.details.id,
        integratePurchaseActivityId: this.details.integratePurchaseActivityId,
        sponsor: false,
        miniprogramOpenid: API.miniprogramOpenid,
        unionid: API.unionid,
        nickname: API.nickname,
        headImg: API.headImgUrl
      }
      this.$request.post( API.joinActivity, { data } ).then( res => {
        console.log( '参团', res )
        if ( res && res.code == 0 ) {
          this.payDetail.totalAmount = res.data.totalPrice
          this.payDetail.payOrderItems[ 0 ].amount = res.data.totalPrice
          this.payDetail.orderNo = res.data.orderNum
          this.integratePurchaseId = res.data.integratePurchaseId
          this.orderOnline()
        } else {
          uni.showToast( {
            title: res.msg,
            icon: none
          } )
        }
      } )
    },
    // 线上订单
    orderOnline () {
      let data = this.payDetail
      this.$request.post( API.pay, { data } ).then( res => {
        console.log( '线上订单', res )
        if ( res && res.code == 0 ) {
          uni.hideLoading()
          this.wxPay( res.data.wxMap )
        } else {
          uni.showToast( {
            title: res.msg,
            icon: none
          } )
        }
      } )
    },
    // 支付
    wxPay ( wxMap ) {
      uni.requestPayment( {
        provider: 'wxpay',
        timeStamp: wxMap.timeStamp,
        nonceStr: wxMap.nonceStr,
        package: wxMap.package,
        signType: wxMap.signType,
        paySign: wxMap.paySign,
        success: res => {
          uni.redirectTo( {
            url: "/../group-success/group-success?id=" + this.integratePurchaseId + "&type=1"
          } )
        },
        fail: err => {
          uni.showToast( {
            title: '支付失败',
            icon: none
          } )
        }
      } )
    },
    btnClick () {
      switch ( this.details.status ) {
        case 2:
          this.joinActivity()
          break;
        case 3:
          uni.navigateTo( {
            url: "./../order/order-list?orderType=2"
          } )
          break;
        case 4:
          uni.redirectTo( {
            url: "./../index/index?pageFlag=1"
          } )
          break;
      }
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
.top-info {
  width: 100%;
  background: #fff;
  text-align: left;
  color: #000;
  margin-bottom: 10upx;
  padding: 60upx;
  box-sizing: border-box;
  font-size: 15px;
}
.top-price {
  color: #fa4b9b;
  font-size: 22px;
  margin: 20upx 0;
}
.btm-right {
  color: #9b9b9b;
  font-size: 13px;
}
.btm-left {
  display: inline-block;
  background: #fce4ec;
  padding: 6upx 8upx;
  font-size: 9px;
  color: #fa4b9b;
  vertical-align: middle;
  border-radius: 6upx;
  margin-left: 20upx;
}
.top {
  text-align: center;
  font-size: 18px;
  color: #000;
  margin-bottom: 20upx;
}
.title {
  font-size: 17px;
  color: #000;
  margin-bottom: 20upx;
}
.text {
  font-size: 15px;
  color: #9b9b9b;
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
</style>
