<template>

  <view class="free-WaterfallFlow">
    <view
      class="flex-wrap"
      v-for="item in list"
      :key='item.id'
      v-if="item.id%2!=''"
    >
      <img
        mode="widthFix"
        :src="item.listImg"
        @click="goActivityDetails(item)"
      />
      <view>{{item.title}}</view>
      <view class="text">
        <!-- <img
            src="@/static/icon/kong-xin.png"
            class="xin"
            @click="Collection(item)"
            v-if="!item.liked"
          />
          <img
            src="@/static/icon/xin-active.png"
            class="xin"
            @click="Collection(item)"
            v-if="item.liked"
          > -->
        <text style="margin-left:6rpx;">{{item.like}}</text>
      </view>
    </view>
    <view
      class="flex-wrap"
      v-for="item in list"
      :key='item.id'
      v-if="item.id%2==''"
    >
      <img
        mode="widthFix"
        :src="item.listImg"
        @click="goActivityDetails(item)"
      />
      <view>{{item.title}}</view>
      <view class="text">
        <!-- <img
            src="@/static/icon/kong-xin.png"
            class="xin"
            @click="Collection(item)"
            v-if="!item.liked"
          />
          <img
            src="@/static/icon/xin-active.png"
            class="xin"
            @click="Collection(item)"
            v-if="item.liked"
          /> -->
        <text style="margin-left:6rpx;">{{item.like}}</text>
      </view>
    </view>
  </view>
  </view>
</template>

<script>
import API from "@/api/config.js"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
export default {
  components: {
    MescrollUni
  },
  props: {
    // 数据列表
    // list: {
    //   type: Array,
    //   default () {
    //     return []
    //   }
    // }
  },
  data () {
    return {
      mescroll: null, //mescroll实例对象
      downOption: {
        auto: false, // 不自动加载
      },
      upOption: {
        auto: false, // 不自动加载

        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
      },
      page: 1,
      list: []
    }
  },
  watch: {},
  created () {
    // this.getList( 1 )
  },
  methods: {
    getList ( page ) {
      this.$request.get( API.findList + "?size=10&page=" + page ).then( res => {
        if ( res && res.code == 0 ) {
          console.log( '探索列表', res.data )

          if ( res.data.data.length > 0 ) {
            this.list = this.list.concat( res.data.data )
          }
          if ( res.data.data.length == 0 ) {
            console.log( 'wushuju ', this.mescroll )
            this.mescroll.isDownLoading = true
            this.mescroll.isUpNoMore = true
            this.mescroll.isUpLoading = false
            return
          }


        }
      } )
    },
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit ( mescroll ) {
      this.mescroll = mescroll;
    },
    /*下拉刷新的回调 */
    downCallback ( mescroll ) {
      // 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
      mescroll.resetUpScroll()
    },
    /*上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10 */
    upCallback ( mescroll ) {
      mescroll.endSuccess( curPageData.length );
      //设置列表数据
      if ( mescroll.num == 1 ) this.pdList = []; //如果是第一页需手动制空列表
      this.pdList = this.pdList.concat( curPageData ); //追加新数据

    },
    // 选中
    choose ( e ) {
      let index = e.currentTarget.dataset.index;
      this.$emit( 'click', this.newList[ index ] );
    }
  }
}
</script>

<style lang="scss" scoped>
.free-WaterfallFlow {
  width: 99%;
  column-count: 2;
  padding: 20rpx;
  box-sizing: border-box;
}

.free-WaterfallFlow .flex-wrap {
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
}

.text {
  float: right;
}
</style>
