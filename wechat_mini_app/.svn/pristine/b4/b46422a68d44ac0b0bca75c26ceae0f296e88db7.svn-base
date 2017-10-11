// pages/address/index.js
//var message = require('../../component/message/message')
var app = getApp();
var util = require('../../utils/util')

var mode = '';
Page({
  data:{
    addressList : [],
    nullTip: {
      tipText: '您还没有添加地址',
      noAction: true,
    },
    showAddr: false,
    haveAddr: false,
  },
  //页面加载入口
  onLoad:function(options){ 
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    mode = options.mode ? options.mode : '';
    if (mode=='select'){
      let selectedAddress = app.globalData.selectedAddress;
      if (selectedAddress){
        let Aid = selectedAddress.address_id ? selectedAddress.address_id : 0;
        that.setData({
          selectedAid: Aid,
        })
      }
      
      wx.setNavigationBarTitle({
        title: '选择地址'
      })
    }
    that.setData({
      scrollHeight: util.rpxHeight()-110,
      mode: mode,
    })
  },
  onShow:function(){
    //调用onLoad，用于编辑后刷新
    let that = this;
    that.fetchAddress();
  },
  fetchAddress: function(){
    let that = this;
    wx.showLoading({
      title: '加载中..'
    });
    app.sessionRequest({
      url: app.conf.url.getMyAddressList,
      method: 'GET',
      header: { 'content-Type': 'application/json' },
      success: function (res) {
        console.log(res)
        if (res.data.code == '200') {
          var addressList = res.data.data;
          var addressListMap = {};
          // console.log(addressList)
          if ( addressList && addressList.length ) {
            for (var k = 0; k < addressList.length; k++) {
              addressListMap[addressList[k].address_id] = addressList[k];
            }
            that.setData({
              haveAddr: true,
              addressList: addressListMap,
            })
          }else{
            that.setData({
              haveAddr: false,
              addressList: [],
            })
          }

          that.setData({
            showAddr: true,
          })
        } else if (res.data.code == "needLogin") {
          //调用登录
          app.login({
            success: function () {
              that.fetchAddress();
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
      complete: function () {
        wx.hideLoading();
       }
    });
  },
  //选择地址项
  selectItemTap:function(event){
    if( mode != 'select' ){
      return;
    }
    var that = this;
    var aid = event.currentTarget.dataset.aid;

    //调用结算页地址选择回调方法
    var pages = getCurrentPages();
    if (pages.length > 1) 
    {
      var prePage = pages[pages.length - 2];
      var selectedAddress = that.data.addressList[aid];
      selectedAddress.mergeAdress = selectedAddress.region + ' ' + selectedAddress.address;
      prePage.selectExpressAdress && prePage.selectExpressAdress(that.data.addressList[aid]);
    }

    //app.globalData.selectedAddress = that.data.addressList[aid];
    /*
    app.globalData.selectedAddress = {
      address_id: that.data.addressList[aid],
      consignee: '哈哈哈',
      mobile: '18620381207',
      address: '广东省深圳市南山区常兴南路5号'
    };*/
    wx.navigateBack()
  },
  //新增/编辑地址
  editAddrTap:function(e){
    let aid = e.currentTarget.dataset.aid
    let url = '/pages/address/edit'
    if (aid) {
      url += '?aid=' + aid
    }
    if( mode == 'select'){
      url += (aid ? '&' : '?')+'mode=select';
      wx.redirectTo({
        url: url
      })
    }else{
      wx.navigateTo({
        url: url
      })
    }
    
  }
})