<template>
  <view class="page">
    <!-- #ifdef MP-WEIXIN -->
    <view
      class="auth-box"
      v-if="isAuthFlag"
    >
      <view class="box">
        <view class="title">微信授权</view>
        <view class="info">需要获得您的用户信息,请点击确定允许授权</view>
        <button
          class="auth-btn"
          v-if="isUser"
          open-type="getUserInfo"
          @getuserinfo="wxGetUserInfo"
          withCredentials="true"
        >获取用户信息</button>
        <button
          class="auth-btn"
          v-if="isPhone"
          open-type="getPhoneNumber"
          @getphonenumber="getPhoneNumber"
        >手机号授权</button>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
import API from '@/api/config.js'
export default {
  name: 'AppletAuth',
  components: {},
  props: {

  },
  data () {
    return {
      isAuthFlag: true,
      isUser: false,
      isPhone: false
    }
  },
  created () {
    this.isAuth()
  },
  methods: {
    // 判断本地是否授权
    isAuth () {
      if ( !uni.getStorageSync( 'userInfo' ) ) {
        console.log( '没有用户信息' )
        this.isAuthFlag = true
        this.isUser = true
        this.isPhone = false
      } else {
        if ( !uni.getStorageSync( 'phoneNumber' ) ) {
          console.log( '有用户信息,没有手机号' )
          this.isAuthFlag = true
          this.isUser = false
          this.isPhone = true
        } else {
          console.log( '有用户信息,有手机号' )
          this.isAuthFlag = false
        }
      }
    },
    // 用户手机号授权加密数据
    getPhoneNumber ( res ) {
      console.log( '-------用户授权，手机号------' )
      console.log( res.detail )
      let that = this
      that.wxLogin( res.detail, 2 )
    },
    // 微信 用户信息授权 加密数据
    wxGetUserInfo ( res ) {
      let that = this
      that.wxLogin( res.detail, 1 )
      if ( !res.detail.iv ) {
        uni.showToast( {
          title: "您取消了授权,登录失败",
          icon: "none"
        } )
        return false
      }
      console.log( '-------用户授权，并获取用户基本信息和加密数据------' )
      console.log( res.detail )
    },
    // 获取 jscode
    wxLogin ( data, type ) {
      let that = this
      uni.login( {
        provider: 'weixin',
        success: function ( loginRes ) {
          console.log( '-------获取code-------' )
          console.log( loginRes.code )
          // 解码用户数据  每次请求必须需要一个新的 jscode 
          that.getUserInfo( {
            encryptedData: data.encryptedData,
            iv: data.iv,
            jsCode: loginRes.code,
            type: type
          } )
        }
      } )
    },
    /** 
     * 解码用户数据 
     * type : 1 解码用户信息   2 解码手机号信息
     */
    getUserInfo ( data ) {
      console.log( data )
      this.$request.post( API.appletAuth, {
        data
      } ).then( ( res ) => {
        console.log( '------解密后用户信息------', res )
        if ( res && res.code == 0 ) {
          if ( data.type == 1 ) {
            uni.setStorageSync( 'userInfo', res.data )
          } else if ( data.type == 2 ) {
            uni.setStorageSync( 'phoneNumber', res.data.phoneNumber )
          }
          this.isAuth()
        } else {
          uni.showToast( {
            title: res.message,
            icon: "none"
          } )
        }
      } )
    }
  }
}
</script>
<style>
/*每个页面公共css */
page {
  width: 100%;
  height: 100%;
}

.auth-box {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
}

.box {
  position: absolute;
  width: 500upx;
  height: 300upx;
  left: 50%;
  top: 50%;
  background: #fff;
  border-radius: 10upx;
  text-align: center;
  font-size: 28upx;
  transform: translate(-50%, -50%);
}

.title {
  font-size: 36upx;
  font-weight: bold;
  margin-top: 20upx;
}

.info {
  width: 80%;
  margin: 0 auto;
  margin-top: 20upx;
}

.auth-btn {
  position: absolute;
  bottom: 30upx;
  left: 50%;
  transform: translate(-50%, 0);
  width: 60%;
  line-height: 80upx;
  background: #000;
  color: #fff;
  font-size: 28upx;
}
</style>
