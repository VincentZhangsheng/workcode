//获取应用实例
var app = getApp();
var WxParse = require('../../component/wxParse/wxParse.js');
var util = require('../../utils/util')

Page({
  data: {
    showDesc: false,
    showSche: false,
  },
  //页面加载
  onLoad: function (options) {
    var that = this,
        scid = options.id;
    scid = scid ? scid : 78558;
    that.getScheInfo(scid);
  },
  //获取排期信息
  getScheInfo: function(scid){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    if( scid > 0 ){
      wx.request({
        url: app.conf.url.schedularInfo,
        data: {
          scid : scid,
          domain: 'miniapp'
        },
        header: { "Content-Type": "application/json" },
        method: "GET",  
        success: function(res) {
          if(res.data.code == 'ok'){
            let scheInfo = res.data.data
            if (scheInfo){
              console.log(scheInfo)
              that.setData({
                scheInfo: res.data.data,
              })
              wx.setNavigationBarTitle({
                title: scheInfo.schedular_name
              })
              that.queryWidget(scheInfo);
            } else {
              util.error('演出信息错误')
            }
          }else{
            util.error(res.data.msg ? res.data.msg : '演出信息错误' )
          }
        }
      }) 
    } else {
      util.error('演出信息错误')
    }
  },
  queryWidget: function(scheInfo){
    let that = this;
    scheInfo.types = '2,3,4,7,8';
    if(typeof scheInfo == 'object')
    {
      delete scheInfo.intro;
      delete scheInfo.tips;
      delete scheInfo.schedular_name;
      delete scheInfo.pic;
      delete scheInfo.ticket_url;
      delete scheInfo.venue_name;
    }
    scheInfo.passWxWebOauth = 1;
    wx.request({
      url: app.conf.url.getTicketsByScid,
      data: scheInfo,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      success: function (res) {
        // console.log(res)
        if (res.data.code == '1') {
          wx.hideLoading();
          let apiData = res.data.data;
          apiData.schedular_desc && that.handleRichText(apiData.schedular_desc);
          if (apiData.sche_support_type && apiData.sche_support_type.length){
            let tmpIndex = apiData.sche_support_type.indexOf('年卡')
            if (tmpIndex != -1){
              apiData.sche_support_type.splice(tmpIndex,1)
            }
          }
          // console.log(apiData)
          Object.assign(that.data.scheInfo, apiData)
          console.log(that.data.scheInfo)
          that.setData({
            scheInfo: that.data.scheInfo,
            showSche: true,
          })
        }else{
          util.error('演出信息错误')
        }
      }
    })
  },
  handleRichText: function(richText){
    let that = this;
    let content = '<div style="font-size:14px;line-height:25px;">' + richText + "</div>";
    WxParse.wxParse('desc', 'html', content, that, 15);
  },
  // 跳转票价
  gotoSelectTicket: function () {
    let scheInfo = this.data.scheInfo
    wx.navigateTo({
      url: '/pages/ticket/index?scid=' + scheInfo.id + '&sid=' + scheInfo.show_id + '&vid=' + scheInfo.venue_id + '&cid=' + scheInfo.city_id
    })
  },
  // 查看详情
  lookDesc:function(){
    this.setData({
      showDesc: !this.data.showDesc
    })
  },

  openLocation:function(){
    let venueId = this.data.scheInfo.venue_id
    wx.request({
      url: app.conf.url.getVenueInfo,
      data: {venueId:venueId},
      header:{"Content-Type":"application/x-www-form-urlencoded"},
      method: "POST",  
      success: function(res) {
        if(res.data.code=='ok'){
          let venue = res.data.data;
          wx.openLocation({
            longitude: venue.coordinate[0],
            latitude: venue.coordinate[1],
            name: venue.name,
            address: venue.address,
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
    let scheInfo = this.data.scheInfo;
    return {
      title: scheInfo.schedular_name,
      path: '/pages/detail/index?id=' + scheInfo.id
    }
  }
})
