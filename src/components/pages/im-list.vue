<template>
  <view
    class="pageInfo"
    :style="'min-height:'+windowHeight+'px'"
  >
    <uni-swipe-action
      :options="options"
      :data-id="item.id"
      @click="optionsAction"
      v-for="item in allConversation"
      :key="item.id"
      @tap="changeAction(item.id)"
    >
      <view
        class="list"
        @click="jumpPage"
      >
        <view class="headImg">
          <img
            :src="item.headImg"
            class="headImg"
            mode="widthFix"
          >
        </view>
        <view class="info">
          <view class="top">
            <text>{{item.name}}</text>
            <text class="f-r ccc-color">12:00</text>
          </view>
          <view class="ccc-color m-t10">{{item.info}}</view>
        </view>
      </view>
    </uni-swipe-action>
  </view>

</template>

<script>
import API from "@/api/config.js"
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
export default {
  components: {
    uniSwipeAction
  },
  computed: {
  },
  data () {
    return {
      windowHeight: uni.getSystemInfoSync().windowHeight,
      options: [
        {
          text: '删除',
          style: {
            backgroundColor: '#dd524d'
          }
        }
      ],
      allConversation: [ {
        id: 1,
        name: '周柏豪',
        info: '宝喺度做咩呀',
        headImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575977667950&di=5f658cffc02587eba0db5fe58ecb25ee&imgtype=0&src=http%3A%2F%2Fimg1.doubanio.com%2Fview%2Fnote%2Fl%2Fpublic%2Fp46060527.jpg'
      },
      {
        id: 2,
        name: '刘德华',
        info: '宝喺度做咩呀',
        headImg: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=4286984448,1079526532&fm=26&gp=0.jpg'
      } ]
    }
  },
  onLoad ( options ) {

  },
  created () { },
  methods: {
    optionsAction ( e ) {
      if ( e.index == 0 ) {
        console.log( 'check del', e )
      } else {

      }
    },
    changeAction ( e ) {
      console.log( 'id', e )
    },
    jumpPage () {
      uni.navigateTo( {
        url: './../conversation/conversation'
      } )
    }
  }
}
</script>

<style scoped>
.pageInfo {
  width: 100%;
  box-sizing: border-box;
  background: #f1f1f1;
  padding-top: 20upx;
}
.main {
  width: 100%;
  padding: 0 40upx;
  box-sizing: border-box;
  background: #fff;
}
.list {
  height: 140upx;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 26upx 40upx;
  box-sizing: border-box;
}
.headImg {
  width: 80upx;
  height: 80upx;
  overflow: hidden;
  border-radius: 50%;
  float: left;
}
.info {
  height: 100%;
  width: 85%;
  display: inline-block;
  float: right;
}
.top {
  width: 100%;
}
.f-r {
  float: right;
}
.ccc-color {
  color: rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.m-t10 {
  margin-top: 8upx;
}
</style>