<!-- 商品列表组件 <pd-list :list="xx"></pd-list> -->
<template>
  <view class="pd-list">
    <view
      :class="'pd-li '+ 'width-'+width"
      v-for="pd in list"
      :key="pd.id"
      @click="goDetails(pd.id)"
    >
      <image
        class="pd-img"
        :src="pd.listImg"
        mode="widthFix"
      />
      <view class="pd-name">{{pd.title}}</view>
      <text class="pd-price">¥{{pd.price/100}} 元</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    list: { // 数据列表
      type: Array,
      default () {
        return []
      }
    },
    width: {
      type: String,
      default () {
        return ''
      }
    }
  },
  methods: {
    goDetails ( data ) {
      // 父组件通信事件
      this.$emit( 'goDetails', data )
    },
  }
}
</script>

<style>
/*数据列表*/
.pd-list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: space-between;
}
.pd-li {
  margin: 0 10upx 20upx 10upx;
}
.width-2 {
  width: 325upx;
}
.width-3 {
  width: 210upx;
}
.pd-li .pd-img {
  width: 100%;
  border-radius: 4px;
}
.pd-name {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #000;
}
.pd-price {
  font-family: DINAlternate-Bold;
  font-size: 18px;
  color: #fe5975;
}
</style>
