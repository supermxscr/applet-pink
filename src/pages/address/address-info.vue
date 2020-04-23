<template>
  <view
    class="pageInfo"
    :style="'height:'+windowHeight+'px'"
  >
    <form @submit="submitCheck">
      <view class="uni-form-item">
        <view class="title">姓名</view>
        <input
          class="uni-input"
          name="name"
          v-model="addressInfo.name"
          placeholder="请输入姓名"
        />
      </view>
      <view class="uni-form-item">
        <view class="title">手机号</view>
        <input
          class="uni-input"
          name="phone"
          v-model="addressInfo.phone"
          placeholder="请输入手机号"
        />
      </view>
      <view class="uni-form-item">
        <view class="title">收货地址</view>
        <input
          class="uni-input"
          name="address"
          v-model="addressInfo.address"
          placeholder="请输入收货地址"
        />
      </view>
      <view
        class="subBtn"
        v-if="addressInfo.flag"
      ><button form-type="submit">新增地址</button>
      </view>
      <view
        class="subBtn"
        v-if="!addressInfo.flag"
      ><button form-type="submit">编辑地址</button>
      </view>
    </form>

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
      addressInfo: {
        openid: API.miniprogramOpenid,
        unioind: API.unionid,
        name: null,
        phone: null,
        address: null,
        flag: null, // true 新增 false 更新
        id: null
      }
    }
  },

  onLoad ( option ) {
    let titleText
    if ( option.id ) {
      this.addressInfo.flag = false
      this.addressInfo.id = option.id
      titleText = "编辑地址"
      this.getAddress()
    } else {
      this.addressInfo.flag = true
      titleText = "新增地址"
    }
    uni.setNavigationBarTitle( {
      title: titleText
    } )
    console.log( 'this.addressInfo', this.addressInfo )
  },

  methods: {
    // 获取地址 
    getAddress () {
      this.$request.get( API.getAddress + "?openid=" + API.miniprogramOpenid + "&id=" + this.addressInfo.id ).then( res => {
        console.log( '获取地址', res )
        if ( res && res.code == 0 ) {
          if ( res.data.data.length > 0 ) {
            for ( let i in res.data.data ) {
              if ( res.data.data[ i ].id == this.addressInfo.id ) {
                this.addressInfo.name = res.data.data[ i ].name
                this.addressInfo.phone = res.data.data[ i ].phone
                this.addressInfo.address = res.data.data[ i ].address
              }
            }
          }
        }
      } )
    },
    submitCheck ( e ) {
      var formdata = e.detail.value
      console.log( 'form发生了submit事件，携带数据为：', formdata )
      if ( formdata.name == '' ) {
        uni.showToast( {
          title: '请填写姓名',
          icon: 'none',
          duration: 2000
        } )
        return
      } else if ( formdata.phone == '' ) {
        uni.showToast( {
          title: '请填写手机号',
          icon: 'none',
          duration: 2000
        } )
        return
      } else if ( formdata.address == '' ) {
        uni.showToast( {
          title: '请填写地址',
          icon: 'none',
          duration: 2000
        } )
        return
      } else {
        if ( this.addressInfo.flag ) {
          this.crateAddress()
        } else {
          this.editAddress()
        }
      }

    },
    crateAddress () {
      let data = this.addressInfo
      delete data.id
      this.$request.post( API.getAddress, { data } ).then( res => {
        console.log( '新增地址', res )
        if ( res && res.code == 0 ) {
          uni.navigateBack( {
            delta: 1,
            animationType: 'pop-out',
            animationDuration: 200
          } )
        }
      } )
    },
    editAddress () {
      let data = this.addressInfo
      this.$request.put( API.getAddress, { data } ).then( res => {
        console.log( '编辑地址', res )
        if ( res && res.code == 0 ) {
          uni.navigateBack( {
            delta: 1,
            animationType: 'pop-out',
            animationDuration: 200
          } )
        }
      } )
    }
  }
}
</script>

<style scoped>
.pageInfo {
  width: 100%;
  box-sizing: border-box;
  padding: 16upx 0;
  background: #f1f1f1;
}
.list {
  width: 100%;
  height: 140upx;
  background: #fff;
  padding: 30upx 36upx;
  color: #000;
  font-size: 14px;
  box-sizing: border-box;
  position: relative;
}
.address {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
}
.subBtn {
  width: 100%;
  height: 100upx;
  line-height: 100upx;
  text-align: center;
  color: #fff;
  background: #fa4b9b;
  font-size: 15px;
  position: fixed;
  bottom: 0;
  z-index: 999;
}
.address-txt {
  width: 70%;
  margin-left: 80upx;
  line-height: 40upx;
}
.checkbox {
  position: absolute;
  top: 32%;
}
.icon {
  width: 30upx;
  position: absolute;
  top: 50%;
  right: 36upx;
  transform: translate(0, -50%);
}
button {
  background: transparent;
  color: #fff;
}
button::after {
  border: none;
}
.uni-form-item {
  width: 100%;
  height: 100upx;
  background: #fff;
  line-height: 100upx;
  padding: 0 40upx;
  border-bottom: 1px solid #f1f1f1;
  font-size: 14px;
}
.title {
  width: 140upx;
  float: left;
}
.uni-input {
  width: 70%;
  float: left;
  line-height: 100upx;
  height: 100upx;
}
</style>
