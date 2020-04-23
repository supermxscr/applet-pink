<template>
  <view
    class="pageInfo"
    :style="'height:'+windowHeight+'px'"
  >
    <view class="top">
      <view class="avatar">
        <open-data type="userAvatarUrl"></open-data>
      </view>
      <view class="nickname">
        <open-data type="userNickName"></open-data>
      </view>
    </view>
    <view class="info">
      <view class="list">
        <text class="lable">昵称</text>
        <input
          type="text"
          class="input"
        >
      </view>
      <view class="list">
        <text class="lable">手机</text>
        <input
          type="number"
          class="input"
        >
      </view>
      <view class="list">
        <text class="lable">性别</text>
        <view class="input">
          <radio-group
            name="radio"
            @change="changeSex"
          >
            <label class="radio">
              <radio
                value="1"
                :checked="sex==1"
                color="#FA4B9B"
                style="scale: 0.6;"
              />男</label>
            <label class="radio">
              <radio
                value="2"
                color="#FA4B9B"
                :checked="sex==2"
                style="scale: 0.6;"
              />女</label>
          </radio-group>
        </view>
      </view>
      <view class="list">
        <text class="lable">生日</text>
        <view
          class="input"
          @tap="setBirthday"
        >{{birthday}}</view>
        <w-picker
          mode="date"
          startYear="1960"
          endYear="2025"
          :defaultVal="[nowDate[ 0 ],nowDate[ 1 ],nowDate[ 2 ]]"
          :current="false"
          @confirm="onConfirm"
          :disabledAfter="true"
          ref="date"
          themeColor="#f00"
        ></w-picker>
      </view>
    </view>
  </view>

</template>

<script>
import API from "@/api/config.js"
import wPicker from "@/components/w-picker/w-picker.vue"
import moment from "moment"
export default {
  components: {
    wPicker
  },
  computed: {
  },
  data () {
    return {
      windowHeight: uni.getSystemInfoSync().windowHeight,
      sex: 2,
      birthday: '',
      nowDate: [ '', '', '' ]
    }
  },
  onLoad () {
    // this.init()
  },
  created () {
    this.init()
  },

  methods: {
    init () {
      this.nowDate[ 0 ] = moment().format( "YYYY" )
      this.nowDate[ 1 ] = moment().format( "MM" )
      this.nowDate[ 2 ] = moment().format( "DD" )
    },
    changeSex ( e ) {
      console.log( e )
    },
    setBirthday () {
      this.$refs[ 'date' ].show()
    },
    onConfirm ( e ) {
      console.log( e.result )
      this.birthday = e.result
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
.top {
  width: 100%;
  height: 340upx;
  background: #fff;
  padding: 30upx;
  margin-bottom: 16upx;
  box-sizing: border-box;
}
.avatar {
  width: 132upx;
  height: 132upx;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
  margin-top: 38upx;
}
.nickname {
  display: block;
  font-size: 16px;
  line-height: 60upx;
  text-align: center;
  margin-top: 20upx;
}
.info {
  width: 100%;
  background: #fff;
  padding: 10upx 40upx;
  box-sizing: border-box;
}
.list {
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  line-height: 100upx;
  font-size: 14px;
  height: 100upx;
}
.lable {
  width: 25%;
  display: inline-block;
  vertical-align: top;
}
.input {
  width: 70%;
  height: 100%;
  padding-left: 5px;
  display: inline-block;
}
.radio {
  margin-right: 40upx;
}
</style>
