<template>
  <view
    class="pageInfo"
    :style="'min-height:'+windowHeight+'px'"
  >
    <view class="tab">
      <view
        class="tab-nav"
        v-for="(i,index) in navList"
        :key="index"
        @click="getList(i.status,index)"
      >
        <view :style="{color:[index == navIndex?'#FA58A2':'#151515']}">{{i.name}}</view>
        <view
          class="line"
          v-if="index == navIndex"
        ></view>
      </view>
    </view>
    <view class="main">
      <view
        class="list"
        v-if="listInfo.length>0"
        v-for="(i,index) in listInfo"
        :key="index"
      >
        <view
          class="left"
          @click="jumpPage(i.id)"
        >
          <img
            src="@/static/images/coupon-list.png"
            class="img"
            mode="widthFix"
          >
          <view class="f-s">
            <view>¥10</view>
            <view style="font-size:12px;">优惠券</view>
          </view>
        </view>
        <view class="right">
          <view class="r-top">
            <view class="title">{{i.title}}</view>
            <view class="top-info">满200减10优惠券</view>
            <view class="top-time">有效期：{{i.endTime}}</view>
          </view>
          <view
            class="more"
            @click="showMore(index)"
          >
            <text>更多说明</text>
            <text
              class="iconfont more-icon"
              v-if="!i.isShow"
            >&#xeb7b;</text>
            <text
              class="iconfont more-icon"
              v-if="i.isShow"
            >&#xeb7c;</text>
          </view>
        </view>
        <view
          class="more-info"
          v-if="i.isShow"
        >
          <view class="info">
            <uParse :content="i.description"></uParse>
          </view>
        </view>
      </view>
      <view
        style="text-align: center;"
        v-if="listInfo.length==0"
      >暂无数据</view>
    </view>
  </view>
</template>

<script>
import API from "@/api/config.js"
import uParse from '@/components/gaoyia-parse/parse.vue'
export default {
  components: {
    uParse,
  },
  computed: {
  },
  data () {
    return {
      windowHeight: uni.getSystemInfoSync().windowHeight,
      navIndex: 0,//tab 选中index\
      listInfo: [],
      /**
       * nav info 
       */
      navList: [ {
        name: '未使用',
        num: 0,
        status: 1
      }, {
        name: '已使用',
        num: 0,
        status: 1
      }, {
        name: '已失效',
        num: 0,
        status: 1
      } ] // 
    }
  },
  onLoad () {
    this.getList( 1, 0 )
  },
  created () { },
  methods: {
    getList ( status, index ) {
      this.navIndex = index
      this.$request.get( API.coupon + "?withoutPage=false&purpose=2&size=10&page=1000&status=" + status ).then( res => {
        console.log( 'coupon list', res.data )
        var data = []
        if ( res && res.code == 0 ) {
          if ( res.data.data.length > 0 ) {
            for ( let i in res.data.data ) {
              res.data.data[ i ].isShow = false
              res.data.data[ i ].endTime = this.$moment( res.data.data[ i ].endTime * 1000 ).format( "YYYY-MM-DD" )
            }
          }
          this.listInfo = res.data.data
        }
      } )
    },
    jumpPage ( id ) {
      uni.navigateTo( {
        url: './coupon-detils?id=' + id
      } )
    },
    showMore ( index ) {
      this.listInfo[ index ].isShow = !this.listInfo[ index ].isShow
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
.main {
  width: 100%;
  padding: 32upx;
  box-sizing: border-box;
}
.list {
  width: 100%;
  min-height: 227upx;
  background: #fff;
  box-sizing: border-box;
  border-radius: 10upx;
  margin-bottom: 20upx;
}
.left {
  width: 200upx;
  height: 227upx;
  display: inline-block;
  color: #fff;
  font-size: 30px;
  position: relative;
}
.img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.f-s {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-weight: 400;
}
.right {
  width: 465upx;
  float: right;
}
.r-top {
  height: 150upx;
  padding-top: 20upx;
  border-bottom: 1px dotted rgba(0, 0, 0, 0.25);
}
.title {
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.top-info {
  font-size: 12px;
  line-height: 60upx;
}
.top-time {
  font-size: 11px;
  color: #a0a0a0;
}
.more {
  font-size: 11px;
  display: inline-block;
  width: 465upx;
  float: right;
  color: #a0a0a0;
  line-height: 60upx;
}
.more-icon {
  font-size: 11px;
  float: right;
  margin-right: 20upx;
}
.more-info {
  width: 100%;
  margin: 0 auto;
  color: #999999;
  font-size: 12px;
  box-sizing: border-box;
  min-height: 40upx;
  padding: 20upx;
}
.info {
  width: 100%;
  min-height: 40upx;
  background: #f9f9f9;
  border-radius: 8upx;
  padding: 16upx;
}
.tab {
  width: 100%;
  height: 100upx;
  background: #fff;
  color: #151515;
  font-size: 14px;
  text-align: center;
  padding-top: 20upx;
  box-sizing: border-box;
}
.tab-nav {
  height: 100%;
  width: 32%;
  display: inline-block;
}
.line {
  width: 50upx;
  height: 6upx;
  margin: 0 auto;
  margin-top: 6upx;
  background: #fa58a2;
}
</style>