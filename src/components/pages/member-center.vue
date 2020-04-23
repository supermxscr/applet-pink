<template>
  <view
    class="pageInfo"
    :style="'height:'+windowHeight+'px'"
  >
    <view class="top">
      <view
        class="avatar"
        @click="jumpPage('memberinfo')"
      >
        <open-data type="userAvatarUrl"></open-data>
      </view>
      <view class="nickname">
        <open-data type="userNickName"></open-data>
        <view class="hellotxt">你好,欢迎来到栎悦医美</view>
      </view>
      <view>
        <view
          class="tab"
          v-for="item in tabInfo"
          :key="item"
          @click="jumpPage(item.page)"
        >
          <view class="tabnum">{{item.num}}</view>
          <view>{{item.name}}</view>
        </view>
      </view>
    </view>
    <view class="top">
      <view class="singinbox">
        <view style="font-size: 18px;margin-bottom:6upx;width:80%;">签到领好礼</view>
        <text>连续签到7天立即领取<text style="color:#FBD200;">神秘礼品</text></text>
        <view
          class="btn"
          @click="jumpPage('sigin')"
        >立即签到</view>
      </view>
      <view
        class="list"
        @click="jumpPage('order',2)"
      >
        <text class="iconfont">&#xe612;</text>
        <text class="txt">我的订单</text>
        <text class="iconfont icon-right">&#xe639;</text>
      </view>
      <view
        class="list"
        @click="jumpPage('order',1)"
      >
        <text class="iconfont">&#xe618;</text>
        <text class="txt">拼团订单</text>
        <text class="iconfont icon-right">&#xe639;</text>
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
      windowHeight: uni.getSystemInfoSync().windowHeight,
      tabInfo: [ {
        num: 3,
        name: '卡券',
        page: 'coupon'
      },
      {
        num: 3,
        name: '积分',
        page: 'integral'
      }, {
        num: 3,
        name: '余额'
      } ]
    }
  },
  onLoad () {
  },
  created () {
  },

  methods: {
    jumpPage ( page, type ) {
      let url = ''
      switch ( page ) {
        case 'coupon':
          url = '../coupon/coupon-list'
          break;
        case 'integral':
          url = '../integral/integral-list'
          break;
        case 'sigin':
          url = '../sigin/sigin-index?type=' + type
          break;
        case 'order':
          url = '../order/order-list?type=' + type
          break;
        case 'memberinfo':
          url = '../member/member-info'
          break;
      }
      uni.navigateTo( {
        url: url
      } )
    }
  }
}
</script>

<style scoped>
.pageInfo {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background: #f1f1f1;
}
.top {
  width: 100%;
  background: #fff;
  padding: 20upx 30upx;
  margin-bottom: 16upx;
  box-sizing: border-box;
}
.avatar {
  width: 132upx;
  height: 132upx;
  border-radius: 50%;
  overflow: hidden;
  display: inline-block;
  margin-right: 22upx;
}
.nickname {
  display: inline-block;
  font-size: 18px;
  vertical-align: top;
  margin-top: 14upx;
  line-height: 60upx;
  margin-bottom: 40upx;
}
.hellotxt {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
}
.tab {
  display: inline-block;
  width: 33%;
  font-size: 16px;
  text-align: center;
}
.tabnum {
  font-weight: bold;
  font-size: 24px;
}
.singinbox {
  width: 100%;
  height: 140upx;
  background: #fa4b9b;
  color: #fff;
  padding: 20upx 36upx;
  font-size: 14px;
  box-sizing: border-box;
  border-radius: 10upx;
  margin-bottom: 10upx;
}
.btn {
  width: 188upx;
  height: 66upx;
  background: #fff;
  color: #fa4b9b;
  text-align: center;
  line-height: 66upx;
  display: inline-block;
  float: right;
  margin-top: -40upx;
  border-radius: 40upx;
}
.list {
  width: 100%;
  padding: 20upx 0;
  font-size: 17px;
}
.icon-right {
  float: right;
}
.txt {
  margin-left: 30upx;
  display: inline;
  color: #353535;
}
</style>
