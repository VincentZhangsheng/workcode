// pages/error/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    let tipText = options.tipText,
        actionText = options.actionText,
        routeUrl = options.routeUrl;
    that.setData({
      nullTip: {
        tipText: tipText ? tipText : '出错了',
        actionText: actionText ? actionText : '返回首页',
        routeUrl: routeUrl ? routeUrl : '/pages/index/index',
      },
    })
  },
})