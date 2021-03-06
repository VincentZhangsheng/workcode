// pages/myjuooo/order-detail.js
var app = getApp();
var util = require('../../utils/util')

//倒计时毫秒
var countDownMicroSec = 0;

Page({
  data: {
    imgDomain: app.conf.url.imgDomain,
    payFlag : false,
    showMoreSeatFlag: false,
    showMoreListingFlag: false,
    showOrder: false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    //options.osn = '2017062884165501010'
    that.fetchOrderInfo(options.osn);
  },
  //获取请求结果
  fetchOrderInfo: function (orderSn) {
    let that = this;
    wx.showLoading({
      title: '加载中..'
    });
    app.sessionRequest({
      url: app.conf.url.myOrderInfo,
      data: { orderSn: orderSn },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      success: function (res) {
        console.log(res)
        if (res.data.code == 'ok') {
          let orderInfo = res.data.data;

          let seatCount = 0;
          if (orderInfo.listing) {
            for (let i in orderInfo.listing) {
              if (orderInfo.listing[i].seat_array) {
                orderInfo.listing[i].new_seat_array = [];
                for (let j in orderInfo.listing[i].seat_array) {
                  orderInfo.listing[i].new_seat_array[seatCount] = orderInfo.listing[i].seat_array[j];
                  seatCount++;
                }
              }
            }
          }
          //电子票
          if (orderInfo.shipping_id==2){
            that.getEticketCode(orderInfo.shipping_way)
          }
          console.log(orderInfo)

          let payFlag = orderInfo.order_status == 1 && orderInfo.shipping_status == 0 && orderInfo.pay_status == 0;
          that.setData({
            showOrder: true,
            orderInfo: orderInfo,
            payFlag: payFlag,
            seatCount: seatCount,
            discountListEmpty: util.isEmptyObject(orderInfo.discount_list),
            orderButtonEmpty: util.isEmptyObject(orderInfo.order_button),
            youhui_price: parseFloat(orderInfo.prefer_total - orderInfo.reckon_price).toFixed(2),
          })
          if (payFlag) {
            countDownMicroSec = orderInfo.cancel_time * 1000 - new Date().getTime();
            that.countDown(countDownMicroSec);
          }
          wx.hideLoading();
        } else if (res.data.code == "needLogin") {
          //调用登录
          app.login({
            success: function () {
              that.fetchOrderInfo(orderSn);
            },
            fail: function () {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: '登录失败',
                success: function (res) {
                }
              });
            },
            beforeRedirect: function () {

            }
          });
        } else {

        }
      },
      complete: function () { }
    });
  },
  //电子票
  getEticketCode: function (shipping_way){
    let that = this;
    if ( shipping_way.file_url || shipping_way.ticket_info_url ){
      that.setData({
        'orderInfo.mobile': shipping_way.rece_mobile,
      })
      if (shipping_way.ticket_info_url){
        wx.request({
          url: app.conf.url.getEticketCode,
          data: { url: shipping_way.ticket_info_url },
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          method: "POST",
          success: function (res) {
            if (res.data.code == 'ok') {
              // console.log(res)
              that.setData({
                eticketCode : res.data.data,
              })
            }
          }
        })
      } else if (shipping_way.file_url){
        that.setData({
          eticketCode: shipping_way.file_url,
        })
      }
    }
  },
  //倒计时
  countDown: function (countDownMicroSec) {
    var that = this;
    if (countDownMicroSec <= 0) {
      that.setData({
        countdown: "00:00:00"
      });
      return;
    }
    that.setData({
      countdown: util.formatCountDown(countDownMicroSec)
    });
    setTimeout(function () {
      // 放在最后--
      countDownMicroSec -= 1000;
      that.countDown(countDownMicroSec);
    }, 1000)
  },
  //订单按钮分流
  orderBtn: function (e) {
    let that = this,
      type = e.target.dataset.type,
      ordersn = e.target.dataset.ordersn;
    // console.log(type,ordersn)
    switch (type) {
      case 'delete':
        //删除订单
        that.deleteOrder(ordersn);
        break;
      case 'cancel':
        //取消订单
        that.cancelOrder(ordersn);
        break;
      case 'map':
        //查看地图
        that.mapOrder();
        break;
      case 'pay':
        that.payOrder(ordersn);
        break;
      default:
        break;
    }
  },
  //删除订单
  deleteOrder: function (order_sn) {
    let that = this;
    wx.showModal({
      title: '提示',
      confirmColor: '#ff7919',
      content: '删除后将无法恢复，您确定要删除订单?',
      success: function (res) {
        if (res.confirm) {
          app.sessionRequest({
            url: app.conf.url.deleteOrder,
            data: { order_sn: order_sn },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: "POST",
            success: function (res) {
              if (res.data.code == '200') {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000,
                })
                setTimeout(function () {
                  that.reloadMy();
                }, 2000)
              } else if (res.data.code == "needLogin") {
                //调用登录
                app.login({
                  success: function () {
                    that.deleteOrder(order_sn);
                  },
                  fail: function () {
                    wx.showModal({
                      title: '提示',
                      showCancel: false,
                      content: '登录失败',
                      success: function (res) {
                      }
                    });
                  },
                  beforeRedirect: function () {

                  }
                });
              } else {

              }
            },
            complete: function () { }
          });
        }
      }
    })
  },
  //取消订单
  cancelOrder: function (order_sn) {
    let that = this;
    wx.showModal({
      title: '提示',
      confirmColor: '#ff7919',
      content: '您确定要取消订单?',
      success: function (res) {
        if (res.confirm) {
          app.sessionRequest({
            url: app.conf.url.cancelOrder,
            data: { order_sn: order_sn },
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: "POST",
            success: function (res) {
              if (res.data.code == '200') {
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 2000,
                })
                setTimeout(function () {
                  that.reloadMy();
                }, 2000)
              } else if (res.data.code == "needLogin") {
                //调用登录
                app.login({
                  success: function () {
                    that.cancelOrder(order_sn);
                  },
                  fail: function () {
                    wx.showModal({
                      title: '提示',
                      showCancel: false,
                      content: '登录失败',
                      success: function (res) {
                      }
                    });
                  },
                  beforeRedirect: function () {

                  }
                });
              } else {

              }
            },
            complete: function () { }
          });
        }
      }
    })
  },
  //立即付款
  payOrder: function (order_sn) {
    let that = this;
    let successFun = function () {
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 2000,
      })
      setTimeout(function(){
        that.reloadMy();
      },2000)
    };
    let failFun = function () {
      wx.showModal({
        title: '支付失败',
        content: '很遗憾，您的订单支付失败，请稍后再试',
      })
    }
    util.startWxPay(order_sn, successFun, failFun);
  },
  //查看地图
  mapOrder: function(){
    let that = this,
        address = that.data.orderInfo.shipping_way.ticket_address;
    wx.request({
      url: app.conf.url.GeocodingAPI,
      data: { address: address },
      header: { 'content-Type': 'application/json' }, 
      method: "GET",
      success: function (res) {
        if (res.data.result.location){
          let location = res.data.result.location
          console.log(location)
          wx.openLocation({
            latitude: location.lat,
            longitude: location.lng,
            address: address,
          })
        }
      }
    })
  },
  reloadMy: function(){
    app.globalData.reloadMy = true;
    wx.switchTab({
      url: '/pages/myjuooo/index',
    })
  },

  //展开 排期
  spreadListing: function(){
    this.setData({
      showMoreListingFlag: !this.data.showMoreListingFlag
    })
  },
  //展开 Seat
  spreadSeat: function () {
    this.setData({
      showMoreSeatFlag: !this.data.showMoreSeatFlag
    })
  },
  //展开 折扣
  spreadDiscountList: function(){
    this.setData({
      showDiscountFlag: !this.data.showDiscountFlag
    })
  }

})