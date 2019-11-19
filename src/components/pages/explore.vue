<template>

  <view class="free-WaterfallFlow">

    <view
      class="flex-wrap"
      v-for="item in list"
      :key='item.id'
      v-if="item.id%2!=''"
    >
      <image
        mode="widthFix"
        :src="item.listImg"
        @click="goActivityDetails(item)"
      />
      <view>{{item.title}}</view>
      <view class="text">
        <image
          :src="'../../static/icon/zan.png'"
          class="xin"
          @click="Collection(item)"
          v-if="!item.liked"
        />
        <image
          :src="'../../static/icon/zan-c.png'"
          class="xin"
          @click="Collection(item)"
          v-if="item.liked"
        >
          <text style="margin-left:6rpx;">{{item.like}}</text>
      </view>
    </view>
    <view
      class="flex-wrap"
      v-for="item in list"
      :key='item.id'
      v-if="item.id%2==''"
    >
      <image
        mode="widthFix"
        :src="item.listImg"
        @click="goActivityDetails(item)"
      />
      <view>{{item.title}}</view>
      <view class="text">
        <image
          :src="'../../static/icon/zan.png'"
          class="xin"
          @click="Collection(item)"
          v-if="!item.liked"
        />
        <image
          :src="'../../static/icon/zan-c.png'"
          class="xin"
          @click="Collection(item)"
          v-if="item.liked"
        >
          <text style="margin-left:6rpx;">{{item.like}}</text>
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
      downOption: {
        auto: false //是否在初始化后,自动执行下拉回调callback; 默认true
      },
      list: [],
      page: 1
    }
  },

  created () {
    this.getList( this.page )
  },
  methods: {
    getList () {
      this.$request.get( API.findList + "?size=8&page=" + this.page + "&miniprogramOpenid=" + API.miniprogramOpenid ).then( res => {
        if ( res && res.code == 0 ) {
          console.log( '探索列表', res.data )
          if ( res.data.data.length > 0 ) {
            this.page = this.page++
            this.list = this.list.concat( res.data.data )
          }
          if ( res.data.data.length == 0 ) {
            return
          }
        }
      } )
    },
    Collection ( data ) {
      console.log( 'dianji----', data )
      let subInfo = {
        'contentId': data.id,
        'miniprogramOpenid': API.miniprogramOpenid,
        'unionid': API.unionid,
        'flag': !data.liked,
        'type': 1
      }
      this.$request.put( API.contentAndMark, { subInfo } ).then( res => {
        console.log( '点赞', res )
        if ( res && res.data.code == 0 ) {
          // for ( let i in that.data.findList ) {
          //   if ( event.currentTarget.dataset.id == that.data.findList[ i ].id ) {
          //     that.data.findList[ i ].liked = !event.currentTarget.dataset.flag
          //     if ( !event.currentTarget.dataset.flag == true ) {
          //       console.log( "++", that.data.findList[ i ].like )
          //       that.data.findList[ i ].like = that.data.findList[ i ].like + 1
          //     } else if ( !event.currentTarget.dataset.flag == false ) {
          //       console.log( "--", that.data.findList[ i ].like )
          //       that.data.findList[ i ].like = that.data.findList[ i ].like - 1
          //     }

          //   }
          //   that.setData( {
          //     findList: that.data.findList
          //   } )
          // }
        }
      } )
    },
    goActivityDetails ( data ) {
      uni.navigateTo( {
        url: "/pages/explore-details/explore-details?id=" + data.id
      } )
    }
  }
}
</script>

<style scoped>
.pageInfo {
  width: 100%;
  height: 100%;
}
.free-WaterfallFlow {
  width: 99%;
  column-count: 2;
  padding: 20rpx;
  box-sizing: border-box;
}

.flex-wrap {
  display: inline-block;
  width: 98%;
  margin-bottom: 2%;
  padding: 2%;
  padding-top: 5%;
  margin-right: 2%;
  text-align: left;
}

.flex-wrap image {
  width: 100%;
  margin: 0 auto;
  border-radius: 8upx;
}

.flex-wrap view:nth-child(2) {
  font-size: 28rpx;
  padding: 2% 0;
  color: #000;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.flex-wrap view:nth-child(3) {
  font-size: 12px;
  padding: 2% 0;
  color: #aaa;
  text-align: left;
  display: inline-block;
  width: 97%;
}

.xin {
  height: 25rpx;
  width: 25rpx !important;
  margin: 0;
  display: inline-block;
  vertical-align: middle;
  border-radius: none;
}

.text {
  float: right;
}
</style>
