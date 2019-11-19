<template>
  <view class="pageInfo">
    <swiper-c
      :swiperInfo="swiperInfo"
      @bannerJump="bannerJump"
      @bannerChange="bannerChange"
    ></swiper-c>
    <view class="top-info">
      <view class="top-left">
        <view class="top-price">¥ {{detailsData.productPrice/100}}</view>
        <view class="left-btm">
          <text class="btm btm-left">{{detailsData.limitNum}}人团</text>
          <text class="btm btm-right">{{userNum}}人已拼团</text>
        </view>
      </view>
      <view class="top-right">
        <view>距结束还剩</view>
        <countdown
          :timeInfo="timeInfo"
          v-if="timeInfo.endTime!=null"
        ></countdown>
      </view>
    </view>

    <view class="pd-title">
      <view>{{detailsData.title}}</view>
      <view class="description">描述信息</view>
    </view>
    <view class="info">
      <view class="tit">拼团玩法</view>
      <view class="play-info">
        <view
          class="info-c"
          v-for="(item,index) in playData"
          :key="item"
        >
          <view class="info-num">{{index+1}}</view>
          {{item}}
        </view>
      </view>
      <view
        class="tit tit-m"
        v-if="isJoinList"
      >我要参团</view>
      <view
        class="join-list"
        v-if="isJoinList"
        v-for="(item,index) in timeInfoArr"
        :key="index"
      >
        <img
          :src="item.data.sponsorHeadImg"
          class="headImg"
          mode="widthFix"
        >
        <view class="user-info">
          <view class='userName'>{{item.data.sponsorNickname}}</view>
          <view class="user-data">
            还差<text class="org">{{item.data.count}}人</text>参团
            <text>剩余</text>
            <countdown
              :timeInfo="item"
              v-if="item.endTime!=null"
            ></countdown>
          </view>
        </view>
        <view
          class="g-btn"
          @click="goJionGroup(item.data.id)"
        >去参团</view>
      </view>

      <view class="tit tit-m">拼图详情</view>
      <uParse :content="detailsData.description"></uParse>
    </view>
    <view class="footer">
      <view class="f-btn f-left">
        <view>¥ {{detailsData.productPrice/100}}</view>
        <view class="f-txt">单独购买</view>
      </view>
      <view
        class="f-btn f-tight"
        @click="subOrder"
      >
        <view>¥ {{detailsData.integratePurchasePrice/100}}</view>
        <view class="f-txt">发起拼团</view>
      </view>
    </view>
  </view>

</template>

<script>
import API from "@/api/config.js"
import swiperC from "@/components/swiperC/swiperC.vue"
import countdown from "@/components/countdown/countdown.vue"
import uParse from '@/components/gaoyia-parse/parse.vue'
export default {
  components: {
    swiperC,
    countdown,
    uParse
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
      id: null,
      page: 1,
      detailsData: null,
      userNum: 0,//已拼团人数
      timeInfo: {
        background: true,
        endTime: null
      },
      timeInfoArr: [],
      playData: [ "选择商品,开团或拼团", "付款成功,邀请好友参团", "达到拼团人数,顺利开团", "若2小时内拼团不成功,全额退款" ],
      isJoinList: false,
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
    this.id = option.id
    this.getDetails( option.id )
    this.getActivityCountNUm( option.id )
    this.getActivityCountList( option.id )
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
    // banner click
    bannerJump ( data ) {
      if ( data ) {
        uni.navigateTo( {
          url: data.url
        } )
      }
    },
    // banner change
    bannerChange ( data ) {
      console.log( 'banner change', data )
      this.swiperInfo.height = data
    },
    //活动详情
    getDetails ( id ) {
      this.$request.get( API.pruchaseActivity + "/" + id ).then( res => {
        console.log( '拼团详情', res.data )
        var data = []
        this.swiperInfo.imgUrls = []
        if ( res && res.code == 0 ) {
          res.data.integratePurchaseImg = JSON.parse( res.data.integratePurchaseImg )
          this.detailsData = res.data
          for ( let i in res.data.integratePurchaseImg ) {
            this.swiperInfo.imgUrls.push( { img: res.data.integratePurchaseImg[ i ] } )
          }
          this.timeInfo.endTime = res.data.endTime
          this.setImageHeight( this.swiperInfo.imgUrls[ 0 ].img )
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
    //  当前拼团活动 参加人列表
    getActivityCountList ( id ) {
      this.$request.get( API.activityCountList + id ).then( res => {
        console.log( ' 当前拼团活动 参加人列表', res.data )
        if ( res && res.code == 0 ) {
          this.isJoinList = res.data.data.length > 0 ? true : false
          if ( res.data.data.length > 0 ) {
            for ( let i in res.data.data ) {
              this.timeInfoArr.push( {
                background: false,
                endTime: res.data.data[ i ].endTime,
                data: res.data.data[ i ]
              } )
            }
          }
        }
      } )
    },
    // 去参团
    goJionGroup ( id ) {
      uni.navigateTo( {
        url: "../group/group-join?id=" + this.integratePurchaseId
      } )
    },
    // 开团
    subOrder () {
      uni.redirectTo( {
        url: "../group/group-success?id=" + this.integratePurchaseId + "&type=1"
      } )
      uni.showLoading( {
        title: '加载中...'
      } )
      let data = {
        integratePurchaseActivityId: this.id,
        sponsorMiniprogramOpenid: API.miniprogramOpenid,
        sponsorUnionid: API.unionid,
        sponsorNickname: API.nickname,
        sponsorHeadImg: API.headImgUrl
      }
      this.$request.post( API.startActivity, { data } ).then( res => {
        console.log( '开团', res )
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
      } );
    }
  }
}
</script>

<style scoped>
.pageInfo {
  height: 100%;
  box-sizing: border-box;
  background: #f1f1f1;
  padding-bottom: 120upx;
}
.top-info {
  width: 100%;
  height: 120upx;
  color: #fff;
}
.top-left {
  width: 57%;
  height: 100%;
  background: #fa4b9b;
  float: left;
  padding: 10upx 20upx;
  font-size: 15px;
  box-sizing: border-box;
}
.top-right {
  width: 43%;
  height: 100%;
  background: #fce4ec;
  float: left;
  box-sizing: border-box;
  font-size: 12px;
  color: #000;
  text-align: center;
  padding-top: 18upx;
}
.top-price {
  font-size: 22px;
  /* margin-bottom:  */
}
.btm {
  display: inline-block;
  float: left;
}
.btm-right {
  font-size: 12px;
  float: right;
}
.pd-title {
  width: 100%;
  padding: 20upx 34upx;
  margin-bottom: 10upx;
  font-size: 15px;
  color: #000000;
  background: #fff;
  box-sizing: border-box;
}
.description {
  color: #9b9b9b;
  font-size: 12px;
  margin-top: 6upx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.info {
  padding: 20upx 34upx;
  color: #000;
  font-size: 15px;
  box-sizing: border-box;
  background: #fff;
}
.tit {
  margin: 10upx 0;
}
.tit-m {
  margin: 30upx 0;
}
.play-info {
  width: 100%;
}

.info-c {
  min-width: 43%;
  /* max-width: 50%; */
  height: 36rpx;
  color: #9b9b9b;
  font-size: 11px;
  display: inline-block;
  line-height: 36rpx;
  margin-bottom: 6px;
}

.info-num {
  display: inline-block;
  width: 26rpx;
  height: 26rpx;
  line-height: 26rpx;
  border-radius: 50%;
  text-align: center;
  color: #fe5975;
  border: 1px solid #fe5975;
  vertical-align: middle;
  margin-right: 8upx;
}
.join-list {
  width: 100%;
}
.headImg {
  width: 80upx;
  height: 80upx;
  border-radius: 50%;
  vertical-align: top;
}
.user-info {
  height: 100%;
  color: #4a4a4a;
  font-size: 13px;
  display: inline-block;
  margin-left: 22upx;
}

.userName {
  margin-bottom: 4upx;
  color: #000;
}

.user-data {
  color: #000;
}

.group-time {
  color: #4a4a4a;
  margin-left: 20upx;
}
.org {
  color: #fa4b9b;
}
.g-btn {
  width: 146upx;
  height: 64upx;
  border: 1px solid #fa4b9b;
  border-radius: 32upx;
  float: right;
  line-height: 64upx;
  text-align: center;
  color: #fa4b9b;
  margin-top: 6upx;
}
/* 底部按钮 */
.footer {
  width: 100%;
  height: 110upx;
  background: #fff;
  color: #fa4b9b;
  font-size: 22px;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
}
.f-btn {
  width: 50%;
  height: 100%;
  float: left;
  box-sizing: border-box;
  padding-top: 5upx;
}
.f-tight {
  background: #fa4b9b;
  color: #fff;
}
.f-txt {
  font-size: 12px;
}
</style>
