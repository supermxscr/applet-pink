<template>
  <view
    class="pageInfo"
    :style="'height:'+windowHeight+'px'"
  >
    <checkbox-group @change="checkboxChange">
      <label
        class="uni-list-cell uni-list-cell-pd"
        v-for="item in addressData"
        :key="item.id"
      >
        <uni-swipe-action
          :options="options"
          :data-id="item.id"
          @click="optionsAction"
        >
          <!-- @click="changeAction(item.id)" -->
          <!-- <uni-list-item :show-arrow="false" title="item1" /> -->
          <view class="list">
            <checkbox
              :value="item.id"
              :checked="item.checked"
              color="#FA4B9B"
              style="transform:scale(0.6)"
              class="checkbox"
            />
            <view
              v-if="isAddress"
              class="address-txt"
            >
              {{item.name}} {{item.phone}}
            </view>
            <view
              class="address address-txt"
              v-if="isAddress"
            >
              {{item.address}}
            </view>
            <img
              src="../../static/icon/edit.png"
              class="icon"
              mode="widthFix"
            >
          </view>
        </uni-swipe-action>

      </label>
    </checkbox-group>

    <view
      class="subBtn"
      @click="crateAddress(0)"
    >新增地址
    </view>

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
      addressData: [],
      isAddress: false,
      chooseAddress: null,
      windowHeight: uni.getSystemInfoSync().windowHeight,
      options: [
        {
          text: '编辑',
          style: {
            backgroundColor: '#007aff'
          }
        }, {
          text: '删除',
          style: {
            backgroundColor: '#dd524d'
          }
        }
      ]
    }
  },
  onLoad ( option ) {
    this.getAddress()
  },
  onShow () {
    this.getAddress()
  },
  methods: {
    optionsAction ( e ) {
      if ( e.index == 0 ) {
        setTimeout( () => {
          this.crateAddress( this.chooseId )
        }, 100 )
      } else {

      }
    },
    changeAction ( e ) {
      this.chooseId = e
      console.log( 'id', this.chooseId )
    },
    getAddress () {
      this.$request.get( API.getAddress + "?openid=" + API.miniprogramOpenid ).then( res => {
        console.log( '获取地址', res )
        if ( res && res.code == 0 ) {
          if ( res.data.data.length > 0 ) {
            this.isAddress = true
            for ( let i in res.data.data ) {
              res.data.data[ i ].checked = false
            }
            this.addressData = res.data.data
          } else {
            this.isAddress = false
          }
        }
      } )
    },
    crateAddress ( id ) {
      let url = id != 0 ? '/pages/address-info/address-info?id=' + id : '/pages/address-info/address-info'
      uni.navigateTo( {
        url: url
      } )
    },
    delectAddress ( id ) {

    },
    checkboxChange ( e ) {
      console.log( 'dianji', e )
      this.chooseAddress = e.detail.value
      for ( var i = 0, lenI = this.addressData.length; i < lenI; ++i ) {
        const item = this.addressData[ i ]
        if ( this.chooseAddress.includes( item.value ) ) {
          this.$set( item, 'checked', true )
        } else {
          this.$set( item, 'checked', false )
        }
      }
      uni.redirectTo( {
        url: '../order/sub-order?addressId=' + e.detail.value
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
</style>
