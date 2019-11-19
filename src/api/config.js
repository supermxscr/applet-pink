import Channel from '@/api/requestConfig.js'
module.exports = {
  miniprogramOpenid: "o6GcK46Gfayk_-6sIxnSHNJJWPxw",
  unionid: "",
  nickname: '周柏豪',
  headImgUrl: '',
  /**
   * Auth 微信小程序授权数据 解密
   * 请求方式 : post
   * {
   *  encryptedData: ,
   *  iv: ,
   *  jsCode: ,
   *  type: 1
   * }
   * type : 1  用户信息授权解密
   * type : 2  手机号授权解密
   * */
  appletAuth: 'miniprogram/user',
  /**
   * Auth 微信 公众号 授权
   */
  h5Auth: 'wechat/' + Channel.Channel + '/auth',
  /**
   * Auth 微信 公众号 jsapi
   */
  jsapi: 'wechat/' + Channel.Channel + '/jsapi',
  //商品分类
  productCategory: "product/category",
  //商品详情
  productDetails: "product/",
  //banner
  getBanner: "banner",
  //探索列表
  findList: "content",
  //探索详情
  findDetails: "content/get",
  // 点赞或者收藏 type 1 点赞  2收藏  put
  contentAndMark: "content/mark",
  // 转发 put
  forward: "content/forward/",
  // 查询个人地址 post 新增  put 更新
  getAddress: "user/address",
  // 拼团活动列表
  pruchaseActivity: "integrate_pruchase/activity",
  // 当前拼团活动 人数
  activityCount: "integrate_pruchase/activity/count/",
  // 当前拼团活动 参加人列表
  activityCountList: "integrate_pruchase?status=2&activityId=",
  // 我要参团
  joinActivity: "integrate_pruchase/record",
  // 我要开团
  startActivity: "integrate_pruchase",
  //支付
  pay: "pay/pay",
}