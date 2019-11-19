<template>
  <view class="pageInfo">
    <swiper-c
      :swiperInfo="swiperInfo"
      @bannerJump="bannerJump"
      @bannerChange="bannerChange"
    ></swiper-c>

    <view class="tab-nav">
      <view
        class="tab left"
        @click="getList(1)"
      >全民参与</view>
      <view
        class="tab right"
        @click="getList(2)"
      >老带新团</view>
    </view>
    <view
      class="list"
      v-for="(item,index) in listData"
      :key="index"
    >
      <img
        :src="item.listImg"
        style="width:100%;"
        mode="widthFix"
      >
      <view class="list-btm">
        <view class="title">{{item.title}}</view>
        <view class="price">¥ {{item.integratePurchasePrice / 100}}元
          <text class="old-price">¥ {{item.productPrice/100}}元</text>
          <text class="three">{{item.limitNum}}人团</text>
          <text
            class="btn"
            @click="goDetails(item.id)"
          >去开团</text>
        </view>
      </view>
    </view>
  </view>

</template>

<script>
import API from "@/api/config.js"
import swiperC from "@/components/swiperC/swiperC.vue"
export default {
  components: {
    swiperC,

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
      page: 1,
      listData: []
    }
  },
  onLoad () {
    this.getBanner()
    this.getList( 1 )
  },
  created () {
    this.getBanner()
    this.getList( 1 )
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
    // banner 
    getBanner () {
      this.$request.get( API.getBanner + "?applyTo=2" ).then( res => {
        console.log( 'banner', res.data )
        var data = []
        if ( res && res.code == 0 ) {
          for ( let i in res.data.data ) {
            if ( res.data.data[ i ].status == 1 ) {
              data.push( res.data.data[ i ] )
            }
          }
          this.swiperInfo.imgUrls = data
          this.setImageHeight( this.swiperInfo.imgUrls[ 0 ].img )
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
    getList ( type ) {
      this.$request.get( API.pruchaseActivity + "?page=" + this.page + "&size=100&status=1&type=" + type ).then( res => {
        console.log( '拼团活动列表', res )
        if ( res && res.code == 0 ) {
          this.listData = res.data.data
        }
      } )
    },
    goDetails ( id ) {
      uni.navigateTo( {
        url: '../group/group-details?id=' + id
      } )
    }
  }
}
</script>

<style scoped>
.pageInfo {
  padding: 40upx 30upx;
  height: 100%;
  box-sizing: border-box;
}
.tab-nav {
  width: 100%;
  height: 200upx;
  background: skyblue;
}
.tab {
  width: 50%;
  height: 100%;
  float: left;
  text-align: center;
  line-height: 200upx;
}
.list {
  width: 100%;
  min-height: 504upx;
  margin: 16upx 0;
  box-shadow: 0 -2px 20px 0 rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
.list-btm {
  padding: 24upx;
}
.title {
  color: #000;
  margin-bottom: 30upx;
}
.price {
  font-size: 22px;
  color: #fe5975;
  height: 90upx;
}
.old-price {
  font-size: 30rpx;
  color: #acacac;
  text-decoration: line-through;
  margin: 0 20rpx;
}
.three {
  background: #fe5975;
  border-radius: 2px;
  display: inline-block;
  color: #fff;
  font-size: 10px;
  padding: 6upx 10upx;
}
.btn {
  width: 176upx;
  height: 80upx;
  color: #fff;
  line-height: 80upx;
  float: right;
  font-size: 18px;
  display: inline-block;
  background: #fa4b9b;
  border-radius: 2px;
  text-align: center;
}
</style>
