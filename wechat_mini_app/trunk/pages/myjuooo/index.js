// pages/myjuooo/index.js
var tabbar = require('../../component/tabbar/tabbar')
var app = getApp();
var util = require('../../utils/util')
var message = require('../../component/message/message')

Page({
  data:{
    imgDomain: app.conf.url.imgDomain,
    orderList: [],
    pageNum: 1,             //页码
    loading: false,         //"上拉加载"的变量，默认false，隐藏 
    loadingComplete: false, //“没有数据”的变量，默认false，隐藏
    nullTip: {
      tipText: '登录后可查看订单信息',
      noAction: true,
    },
    showMyinfo: true,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    let rpxHeight = app.globalData.rpxHeight;
    // tabbar.setCurrentTabbar.call(that, '我的')
    that.setData({
      scrollHeight: rpxHeight - 210 - 80,
    })
    that.fetchUserInfo();
  },
  onShow: function(){
    let that = this
    if (that.data.userInfo && app.globalData.reloadMy){
      that.data.pageNum = 1;
      that.fetchOrderList();
      app.globalData.reloadMy = false;
    }
  },
  //用户信息
  fetchUserInfo: function(){
    let that = this;
    if(that.data.loading){
      return;
    }

    console.log('fetchUserInfo')
    message.show.call(that, {
      content: '登录中...',
      extraIconClass: 'icon-loading',
    });

    that.setData({
      loading: true,  //显示loading 
    })
    app.sessionRequest({
      url: app.conf.url.myUserInfo,
      method: 'GET',
      header: { 'content-Type': 'application/json' },
      success: function (res) {
        message.hide.call(that);
        that.setData({
          loading: false,  //显示loading 
        })
        // console.log(res)
        if (res.data.code == 'ok') {
          
          that.fetchOrderList();
          let apiData = res.data.data
          console.log(apiData)
          if(apiData.phone){
            apiData.phone = apiData.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
          }
          that.setData({
            userInfo: apiData,
            showMyinfo: true,
            'nullTip.tipText': '您还没有订单',
          })
        } else if (res.data.code == "needLogin") {
          message.show.call(that, {
            content: '登录中...',
            extraIconClass: 'icon-loading',
          });

          //调用登录
          app.login({
            redirectConfirm: true,
            success: function () {
              message.hide.call(that);

              that.data.loading = false;
              that.fetchUserInfo();
            },
            fail: function () {
              message.hide.call(that);
              that.data.loading = false;
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
      fail:function()
      {
        message.hide.call(that);
        console.log('fetchUserInfo fail')
        message.show.call(that, {
          content: '网络异常，请稍后再试',
          icon: 'null',
          duration: 3000
        })
        

        that.setData({
          loading: false,  //显示loading 
        })
      },
      complete: function () {
        console.log('fetchUserInfo complete')
        
      }
    });
  },
  //获取请求结果
  fetchOrderList: function(){
    let that = this;
    let pageNum = that.data.pageNum;
    if (pageNum == 1) {
      that.setData({
        orderList: [],
        loadingComplete: false,
      })
    }
    that.setData({
      loading: true,  //显示loading 
    })

    message.hide.call(that);
    message.show.call(that, {
      content: '加载中...',
      extraIconClass: 'icon-loading',
    });

    app.sessionRequest({
      url: app.conf.url.myOrderList,
      data: {
        p: pageNum,
      },
      method: 'GET',
      header: { 'content-Type': 'application/json' }, 
      success: function (res) {
        message.hide.call(that);
        that.setData({
          loading: false,  //显示loading 
        })

        // console.log(res)
        if (res.data.code == 'ok') {
          let apiData = res.data.data
          console.log(apiData)
          if (apiData.length) {
            for (let i in apiData) {
              apiData[i].isEmptyButton = util.isEmptyObject(apiData[i].order_button)
            }
            let concatList = that.data.orderList.concat(apiData)
            that.setData({
              orderList: concatList,
            });
          } else {
            that.setData({
              loadingComplete: true,  //把“没有数据”设为true，显示 
            });
          }
        }else if (res.data.code == "needLogin") {
          //调用登录
          app.login({
            success: function () {
              that.fetchOrderList();
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
      fail:function()
      {
        message.hide.call(that);
        console.log('fetchOrderList fail')
        message.show.call(that, {
          content: '网络异常，请稍后再试',
          icon: 'null',
          duration: 3000
        })

        that.setData({
          loading: false,  //显示loading 
        })
      },
      complete: function () {
        
      }
    });
  },

  scrolltolower: function(){
    let that = this; 
    if(!that.data.loading && !that.data.loadingComplete){
      that.setData({ 
        pageNum: that.data.pageNum+1, //每次触发上拉事件，把pageNum+1 
      }); 
      that.fetchOrderList();
    }
  },
  bindscroll: function(e){
    return;
    let curScrollTop = e.detail.scrollTop,
        that  = this;
    if (curScrollTop > that.data.oldScrollTop ){
      that.setData({
        showMyinfo: false,
        scrollHeight: util.rpxHeight() - 80 - 90,
      })
    }else{
      that.setData({
        showMyinfo: true,
        scrollHeight: util.rpxHeight() - 210 - 80 - 90,
      })
    }
    that.data.oldScrollTop = curScrollTop
  },
  //订单按钮分流
  orderBtn: function(e){
    let that    = this,
        index   = e.target.dataset.index,
        type    = e.target.dataset.type,
        ordersn = e.target.dataset.ordersn;
    // console.log(index,type,ordersn)
    switch(type){
      case 'delete':
        //删除订单
        that.deleteOrder(ordersn, index);
        break;
      case 'cancel':
        //取消订单
        that.cancelOrder(ordersn, index);
        break;
      case 'pay':
        //立即付款
        that.payOrder(ordersn, index);
        break;
      default:
        break;
    }
  },
  //删除订单
  deleteOrder: function(order_sn, index){
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
                that.data.orderList.splice(index, 1)
                that.setData({
                  orderList: that.data.orderList
                })
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000,
                })
              } else if (res.data.code == "needLogin") {
                //调用登录
                app.login({
                  success: function () {
                    that.deleteOrder(order_sn, index);
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
    });
  },
  //取消订单
  cancelOrder: function (order_sn, index) {
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
                that.data.orderList[index].order_group_status = '交易取消'
                that.data.orderList[index].order_button = { 'delete': '删除订单' }
                that.setData({
                  orderList: that.data.orderList
                })
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 2000,
                })
              } else if (res.data.code == "needLogin") {
                //调用登录
                app.login({
                  success: function () {
                    that.cancelOrder(order_sn, index);
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
  payOrder: function(order_sn, index){
    let that = this;
    let successFun = function(){
      that.data.orderList[index].order_group_status = '等待发货'
      that.data.orderList[index].order_button = { 'delete': '删除订单' }
      that.setData({
        orderList: that.data.orderList
      })
      wx.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 2000,
      })
    };
    let failFun = function(){
      wx.showModal({
        title: '支付失败',
        content: '很遗憾，您的订单支付失败，请稍后再试',
      })
    }
    util.startWxPay(order_sn, successFun, failFun);
  },
  //tabbar切换
  swithTab: function(e) {
    let route = getCurrentPages(),
        tapUrl = e.currentTarget.dataset.path,
        currentUrl = '/'+route[route.length-1].route;
    if(tapUrl != currentUrl){
      wx.redirectTo({
        url: tapUrl,
      })
    }
  },
  loginButton: function(){
    let that = this;

    if (that.data.loading)
    {
      return;
    }

    
    if(that.data.userInfo){
      return;
    }

    message.hide.call(that);
    message.show.call(that, {
      content: '登录中...',
      extraIconClass: 'icon-loading',
    });

    that.data.loading = true;
    app.login({
      redirectConfirm: true,
      showMobileModal: true,
      success: function () {
        message.hide.call(that);
        that.data.loading = false;
        that.fetchUserInfo();
      },
      fail: function () {
        that.data.loading = false;
        message.hide.call(that);
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
  }
})