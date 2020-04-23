<template>
  <view class="pageInfo">
    <swiper-c
      :swiperInfo="swiperInfo"
      @bannerJump="bannerJump"
      @bannerChange="bannerChange"
    ></swiper-c>
    <view class="title">精选商品</view>
    <SlideNavTabBar
      topfixedval='0px'
      :topfixed=false
      @clickitem="navListClick"
      :data="navInfo.navList"
      :underlinecolor="navInfo.underlinecolor"
      :underlinewidth="navInfo.underlinewidth"
      :underlineopacity="navInfo.underlineopacity"
      :id="navInfo.navIndex"
      :navIndex="navInfo.navIndex"
      class="SlideNavTabBar"
    >
    </SlideNavTabBar>
    <swiper
      class="swiper"
      :current="navInfo.navIndex"
      @change="switchTab"
      :style="{height:swiperHeight+'px'}"
    >
      <swiper-item
        v-for="(item,index) in navInfo.navList"
        :key="index"
      >
        <view
          v-if="navInfo.productList.length<1"
          class="noListData"
        ></view>
        <pd-list
          v-if="navInfo.productList.length>0"
          :list="navInfo.productList"
          :width='2'
          @goDetails="goDetails"
        ></pd-list>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import API from "@/api/config.js"
import AppletAuth from "@/components/auth/applet-auth.vue"
import swiperC from "@/components/swiperC/swiperC.vue"
import SlideNavTabBar from "@/components/SlideNavTabBar/SlideNavTabBar.vue"
import PdList from "@/components/other/pd-list.vue"
export default {
  components: {
    AppletAuth,
    swiperC,
    SlideNavTabBar,
    PdList
  },
  computed: {
  },
  data() {
    return {
      // banner数据
      swiperInfo: {
        imgUrls: [],
        height: 150,
        autoplay: false
      },
      swiperHeight: 1000,
      navInfo: {
        navList: [],
        underlinecolor: "#FA4B9B",
        underlinewidth: "80%",
        underlineopacity: '0.5',
        navIndex: 0,
        productList: []
      },
      PdList: []
    }
  },
  onLoad() {
  },
  created() {
    this.getProductCategory()
    this.getBanner()
  },
  onPageScroll(e) {
    this.$refs.barTabNav._selectedTab(e.scrollTop)
  },
  methods: {
    setImageHeight(data) {
      let that = this
      let windowWidth
      uni.getSystemInfo({
        success: function (res) {
          windowWidth = res.windowWidth
          uni.getImageInfo({
            src: data,
            success: function (image) {
              that.swiperInfo.height = windowWidth * image.height / image.width
            }
          })
        }
      })
    },
    // 商品分类 and 对应商品数据
    getProductCategory() {
      this.$request.get(API.productCategory + '?needProduct=true').then(res => {
        console.log('商品分类', res.data)
        this.navInfo.navList = res.data.data
        this.navInfo.productList = res.data.data[this.navInfo.navIndex].productList
        this.changeSwiperHeight()
      })
    },
    changeSwiperHeight() {
      this.navInfo.navList[this.navInfo.navIndex].productList.length == 0 || this.navInfo.navList[this.navInfo.navIndex].productList.length < 5 ? 4 * 130 : this.swiperHeight = this.navInfo.navList[this.navInfo.navIndex].productList.length * 130
    },
    navListClick(idx, val) {
      this.navInfo.navIndex = idx
      this.navInfo.productList = this.navInfo.navList[this.navInfo.navIndex].productList
      this.changeSwiperHeight()
    },
    // 滚动切换标签样式
    switchTab(e) {
      this.navInfo.navIndex = e.detail.current
      this.navInfo.productList = this.navInfo.navList[e.detail.current].productList
      this.changeSwiperHeight()
    },
    // banner 
    getBanner() {
      this.$request.get(API.getBanner + "?applyTo=1").then(res => {
        console.log('banner', res.data)
        var data = []
        if (res && res.code == 0) {
          for (let i in res.data.data) {
            if (res.data.data[i].status == 1) {
              data.push(res.data.data[i])
            }
          }
          this.swiperInfo.imgUrls = data
          this.setImageHeight(this.swiperInfo.imgUrls[0].img)
        }
      })
    },
    // banner click
    bannerJump(data) {
      if (data) {
        uni.navigateTo({
          url: data.url
        })
      }
    },
    // banner change
    bannerChange(data) {
      console.log('banner change', data)
      this.swiperInfo.height = data
    },
    // go details
    goDetails(id) {
      uni.navigateTo({
        url: "/pages/product-details/product-details?id=" + id
      })
    }
  }
}
</script>

<style scoped>
.pageInfo {
  padding: 40upx 30upx;
  height: 100%;
}
.swiper {
  height: 100%;
}
.swiperImg {
  width: 100%;
}
.title {
  font-size: 16px;
  color: #1f1f1f;
  text-align: center;
  /* margin-top: 32upx; */
  margin-bottom: 22upx;
}
.SlideNavTabBar {
  z-index: 999;
  background: #fff;
}
.productList {
  width: 100%;
}
.noListData {
  width: 100%;
  height: 500upx;
  background: pink;
}
.tab-content {
  width: 100%;
  height: 100%;
  z-index: -1;
}
.list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: space-between;
}

.list-li {
  width: 320upx;
  margin: 0 8upx 20upx 8upx;
}
.ptitle {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #000;
}
.price {
  font-family: DINAlternate-Bold;
  font-size: 18px;
  color: #fe5975;
}
</style>
