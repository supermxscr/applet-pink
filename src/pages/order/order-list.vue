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
        <view class="top">订单编号: <text class="ccc-color">{{i.orderNum}}</text><text class="pink-color f-r">{{i.status}}</text></view>
        <view
          class="info"
          v-for="item in i.details"
          :key="item.id"
        >
          <img
            :src="item.productListImg"
            class="img"
            mode="widthFix"
          >
          <view class="right f-r">
            <view class="title">title</view>
            <view class="ccc-color m-t">0.8L<text class="f-r">¥ {{i.orderPrice}}</text></view>
            <view class="ccc-color f-r">x {{item.productQuantity}}</view>
          </view>

        </view>
        <view class="t-r ccc-color m-t">
          共{{i.details.length}}件 合计:
          <text
            class="pink-color"
            style="font-size: 15px;font-weight: bold;"
          >¥ {{i.orderPrice}}</text>
        </view>
        <view style="width:100%;height:60upx;">
          <view
            class="btn pink-color f-r"
            @click="jumpPage(i.id)"
          >查看详情</view>
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
      listInfo: [ {
        id: 1
      } ],
      /**
       * nav info 
       */
      navList: [ {
        name: '全部',
        num: 0,
        status: 1
      }, {
        name: '待付款',
        num: 0,
        status: 1
      }, {
        name: '待收货',
        num: 0,
        status: 1
      }
        , {
        name: '已完成',
        num: 0,
        status: 1
      } ] // 
    }
  },
  onLoad ( options ) {
    // options.type 1  拼团订单   2  我的订单
    this.getList( 1, 0 )
  },
  created () { },
  methods: {
    getList ( status, index ) {
      this.navIndex = index
      this.$request.get( API.order ).then( res => {
        console.log( 'order list', res.data )
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
        url: './order-detils?id=' + id
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
  box-sizing: border-box;
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
  width: 25%;
  display: inline-block;
}
.line {
  width: 50upx;
  height: 6upx;
  margin: 0 auto;
  margin-top: 6upx;
  background: #fa58a2;
}
.list {
  width: 100%;
  min-height: 227upx;
  background: #fff;
  box-sizing: border-box;
  margin: 15upx 0;
  padding: 30upx;
  font-size: 14px;
  color: #000000;
}
.top {
  width: 100%;
  margin-bottom: 30upx;
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
.pink-color {
  color: #fa4b9b;
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
.btn {
  text-align: center;
  border: 1px solid #fa4b9b;
  border-radius: 100px;
  line-height: 60upx;
  font-size: 12px;
  width: 160upx;
}
</style>