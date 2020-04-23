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
      <view class="list">
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
export default {
  components: {
  },
  computed: {
  },
  data () {
    return {
      windowHeight: uni.getSystemInfoSync().windowHeight,

    }
  },
  onLoad ( options ) {

  },
  created () { },
  methods: {

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
</style>