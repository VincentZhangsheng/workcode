// pages/show/show.js
var app = getApp()
var tabbar = require('../../component/tabbar/tabbar')
var util   = require('../../utils/util')
var message = require('../../component/message/message')

var pageNum = 1;
Page({
  data:{
    timeArray: {
      '全部时间': 0,
      '今天': 7,
      '明天': 8,
      '一周内': 1,
      '一月内': 2
    },
    timeIndex: 0,  //默认时间类型
    cateArray: {
      0: '全部',
      35: '流行',
      36: '古典',
      37: '舞台剧',
      38: '儿童亲子',
      79: '音乐剧'
    },
    cateIndex:0, //默认选择品类类型
    imgDomain: app.conf.url.imgDomain,
    searchKeyword: '',
    nullTip: {
      tipText: '没有相关演出',
      noAction: true,
    },
    showList: [],
  },
  onLoad:function(options){
    let that = this;
    let rpxHeight = app.globalData.rpxHeight;

    console.log(rpxHeight)

    this.setData({
      cityId: app.globalData.cityId,
      cityName:app.globalData.cityName,
      scrollHeight: rpxHeight-70-100,
      rpxHeight: rpxHeight,
    })
    // tabbar.setCurrentTabbar.call(that, '演出库');
    that.getAllCity();
    that.getHotCityList();
    that.fetchShowList();
  },
  onShow:function(){
    let that = this;
  },
  //时间选择框
  showTime: function () {
    let that = this;
    that.setData({
      showTime: !this.data.showTime,
      showMask: !this.data.showTime,
      showCity: false,
    })
  },
  //城市选择框
  showCity: function () {
    let that = this;
    that.setData({
      showCity: !this.data.showCity,
      showMask: !this.data.showCity,
      showTime: false,
    })
  },
  //背景遮罩
  hideMask: function () {
    this.setData({
      showMask: false,
      showTime: false,
      showCity: false,
    })
  },
  //切换时间
  changeTime:function(e){
    let that = this,
        curTimeIndex = e.target.dataset.timeindex;
    if (curTimeIndex != that.data.timeIndex && !that.data.loading ){
      pageNum = 1;
      that.setData({
        timeIndex: curTimeIndex,
      })
      that.fetchShowList();
    }
    that.hideMask();
  },
  //切换品类
  changeCate:function(e){
    let that = this,
        curCateIndex = e.target.dataset.cateindex;
    if (curCateIndex != that.data.cateIndex && !that.data.loading){
      pageNum = 1;
      that.setData({
        cateIndex: curCateIndex,
      })
      that.fetchShowList();
    }
    that.hideMask();
  },
  //关键字输入
  searchInput: function(e) {
    let that = this;
    that.data.searchKeyword =  e.detail.value;
  },
  searchConfirm: function() {
    let that = this;
    if (!that.data.searchKeyword) {
      that.data.searchKeyword = '';
    }
    pageNum = 1;
    that.fetchShowList();
    // if (that.data.searchKeyword){
    //   pageNum = 1;
    //   that.fetchShowList();
    // }else{
    //   message.show.call(that, {
    //     content: '请输入关键字',
    //     icon: 'null',
    //     duration: 3000
    //   })
    // }
  },
  seachFocus: function(){
    this.hideMask();
  },
  //获取演出数据
  fetchShowList:function(){
    let that = this;
    if(pageNum == 1){
      // wx.showLoading({
      //   title: '加载中...',
      // });
      message.show.call(that, {
        content: '加载中...',
        extraIconClass: 'icon-loading',
      });

      that.setData({
        showList: [],
        loadingComplete: false,
      })
    }
    that.setData({
      loading: true,
    });

    wx.request({
      url: app.conf.url.search,
      data:{
        k: that.data.searchKeyword,  //关键字
        p: pageNum,  //页码
        date: that.data.timeIndex,  //时间
        type: that.data.cateIndex,  //品类
        city: that.data.cityId,  //城市
      },
      header: { "Content-Type": "application/json" },
      method:'GET',
      success: function(res){
        that.setData({
          loading: false
        });
        message.hide.call(that);

        if( res.data.code == 'ok' ){
          let apiData = res.data.data;
          console.log(apiData)
          if (apiData.list.length) {
            let concatList = [];
            concatList = that.data.showList.concat(apiData.list)
            that.setData({
              showList: concatList,
            });
          } else {
            that.setData({
              loadingComplete: true,
            });
          } 
          if (pageNum == 1 && apiData.list.length<apiData.pageRows){
            that.setData({
              loadingComplete: true,
            });
          }
        }
      },
      fail: function(){
        that.setData({
          loading: false
        });
        message.hide.call(that);
        message.show.call(that, {
          content: '网络异常，请稍后再试',
          icon: 'null',
          duration: 3000
        })
      },
      complete: function(){
        console.log('complete')
        //wx.hideLoading();
        
      }
    });
  },
  scrollToLower: function(){
    let that = this;
    if (!that.data.loading && !that.data.loadingComplete) {
      pageNum++;
      this.fetchShowList();     
    }
  },

  //tabbar切换
  swithTab: function (e) {
    let route = getCurrentPages(),
      tapUrl = e.currentTarget.dataset.path,
      currentUrl = '/' + route[route.length - 1].route;
    if (tapUrl != currentUrl) {
      wx.redirectTo({
        url: tapUrl,
      })
    }
  },
  //选择城市
  selectCity: function (e) {
    let curCityName = e.target.dataset.name,
        curCityId = e.target.dataset.id,
        that = this;
    if (curCityId != that.data.cityId && !that.data.loading){
      app.globalData.cityId = curCityId;
      app.globalData.cityName = curCityName;
      that.setData({
        cityId: curCityId,
        cityName: curCityName
      })
      pageNum = 1;
      that.fetchShowList();
    }
    that.hideMask();
  },
  //获取全部城市
  getAllCity: function () {
    var that = this
    wx.request({
      url: app.conf.url.getAllCity,
      header: { "Content-Type": "application/json" },
      success: function (res) {
        if (res.data.code == '200') {
          that.setData({
            allCity: res.data.data
          })
        }
      }
    })
  },
  //获取热门城市列表
  getHotCityList: function () {
    var that = this
    wx.request({
      url: app.conf.url.getHotCity, //仅为示例，并非真实的接口地址
      header: { "Content-Type": "application/json" },
      success: function (res) {
        if (res.data.code == '200') {
          that.setData({
            hotCity: res.data.data
          })
        }
      }
    })
  },
})