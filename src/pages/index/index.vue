<template>
  <view class="pageInfo">
    <!-- 微信小程序授权 -->
    <!-- <applet-auth></applet-auth> -->
    <!-- <swiper-component :swiperInfo="swiperInfo"></swiper-component> -->
    <shop v-if="tabbarInfo.tabbarCurrent == 0"></shop>
    <group v-if="tabbarInfo.tabbarCurrent ==1"></group>
    <explore v-if="tabbarInfo.tabbarCurrent ==2"></explore>
    <cmd-bottom-nav
      :current="tabbarInfo.tabbarCurrent"
      :list="tabbarInfo.tabbarListInfo"
      border-color=""
      :background-color="tabbarInfo.backgroundColor"
      :font-color="tabbarInfo.fontColor"
      :active-font-color="getTabberListIinfo.activeFontColor"
      @click="currentTabber"
    ></cmd-bottom-nav>
  </view>
</template>

<script>
import API from "@/api/config.js"
import AppletAuth from "@/components/auth/applet-auth.vue"
import cmdBottomNav from "@/components/cmd-bottom-nav/cmd-bottom-nav.vue"
import shop from "@/components/pages/shop"
import group from "@/components/pages/group"
import explore from "@/components/pages/explore"
import {
  mapState
} from 'vuex'
export default {
  components: {
    AppletAuth,
    cmdBottomNav,
    shop,
    group,
    explore
  },
  computed: {
    ...mapState( [ 'tabbarList' ] )
  },
  data () {
    return {
      swiperInfo: {
        imgUrls: []
      },
      tabbarInfo: {
        backgroundColor: "#fff",
        frontColor: "#000",
        activeFontColor: "#FA4B9B",
        tabbarCurrent: 0,
        tabbarListInfo: [ {
          "pagePath": "/pages/shop/shop",
          "text": "首页",
          "icon": "",
          "src": "../../static/icon/home.png",
          "srcSelect": "../../static/icon/home-c.png"
        }, {
          "pagePath": "/pages/",
          "text": "拼团",
          "icon": "",
          "src": "../../static/icon/home.png",
          "srcSelect": "../../static/icon/home-c.png"
        }, {
          "pagePath": "/pages/",
          "text": "案例",
          "icon": "",
          "src": "../../static/icon/home.png",
          "srcSelect": "../../static/icon/home-c.png"
        } ]
      },

    }
  },
  onLoad ( option ) {
    console.log( 'indedx-----', option )
    if ( option ) {
      this.tabbarInfo.tabbarCurrent = option.pageFlag
    }
    this.setNavigationBar()
    this.getTabberListIinfo()
  },
  methods: {
    setNavigationBar () {
      uni.setNavigationBarTitle( {
        title: this.tabbarInfo.tabbarListInfo[ 0 ].text
      } )
      uni.setNavigationBarColor( {
        frontColor: '#ffffff',
        backgroundColor: '#fa4b9b',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      } )
    },
    getTabberListIinfo () {
      // this.$store.commit( 'setTabbarList', this.tabbarInfo.tabbarListInfo )
    },
    currentTabber ( e ) {
      console.log( 'tabbarCurrent', e )
      this.tabbarInfo.tabbarCurrent = e.select
      uni.setNavigationBarTitle( {
        title: e.item.text
      } )
    }
  }
}
</script>

<style scoped>
.pageInfo {
  padding-bottom: 120upx;
}
</style>
