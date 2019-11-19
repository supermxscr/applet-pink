<template>
  <view class="list">
    <view
      class="box"
      v-for="(item,index) in list"
      :key="item"
    >
      <img
        :src="item.headImg"
        style="width:100upx;height:100upx;"
        mode="widthFix"
      >
      <text
        class="flag"
        v-if="index==0"
      >团长</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    listInfo: {
      type: Object,
      default () {
        return {}
      }
    },
  },
  data () {
    return {
      list: []
    }
  },
  created () {
    this.setList()
  },
  mounted () {

  },
  methods: {
    setList () {
      if ( this.listInfo.count > 0 ) {
        let arr = []
        for ( let i = 0; i < this.listInfo.count; i++ ) {
          arr.push( {
            headImg: '../../static/icon/wenhao.jpg'
          } )
        }
        this.list = this.listInfo.list.concat( arr )
        console.log( 'this.listInfo.list', this.list )
      }
    }
  }
}
</script>

<style  scoped>
.list {
  text-align: center;
}
.box {
  width: 100upx;
  height: 100upx;
  display: inline-block;
  border-radius: 50%;
  margin: 0 20upx;
  position: relative;
}
.flag {
  background: #fa4b9b;
  border-radius: 12upx;
  width: 64upx;
  height: 30upx;
  color: #fff;
  text-align: center;
  line-height: 30upx;
  font-size: 9px;
  display: inline-block;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>