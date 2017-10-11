// pages/search/index.js
var WxSearch = require('wxSearch.js')
var app = getApp()
var message = require('../../component/message/message')
var util = require('../../utils/util')

Page({
  data:{
    searchKeyword: '',    //需要搜索的字符 
    showList: [], //放置返回数据的数组 
    pageNum: 1,             //页码
    loading: false,         //"上拉加载"的变量，默认false，隐藏 
    loadingComplete: false, //“没有数据”的变量，默认false，隐藏
    imgDomain : app.conf.url.imgDomain,
    nullTip: {
      tipText: '没有相关演出',
      noAction: true,
      actionText: '返回',
      //routeUrl: '../../pages/search/search'
    },
    hiddenDeleteIcon: true,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    let that = this
    WxSearch.init(that,115);
    //联想
    WxSearch.initMindKeys(['wicked','麦斯米兰','南征北战','许冠杰']);
    //热搜词
    wx.request({
      url: app.conf.url.getHotWords,
      method: 'GET',
      header: {'content-Type': 'application/json'}, 
      success: function(res){
        console.log(res)
        WxSearch.initKeys(that,res.data);
      }
    })
    that.setData({
      scrollHeight: util.rpxHeight() - 115,
    })
  }, 
  wxSearchInput: function(e){
    var that = this
    WxSearch.wxSearchInput(e,that);
  },
  wxSerchFocus: function(e){
    console.log('focus')
    var that = this
    WxSearch.wxSearchFocus(e,that);
  },
  wxSearchKeyTap:function(e){
    var that = this
    WxSearch.wxSearchKeyTap(e,that,that.wxSearchFn);
  },
  wxSearchDeleteKey: function(e){
    var that = this
    WxSearch.wxSearchDeleteKey(e,that);
  },
  wxSearchDeleteAll: function(e){
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function(e){
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
    console.log(that.data)
  },
  clearSearch: function(){
    var that = this
    that.setData({
      hiddenDeleteIcon: true,
      searchKeyword : ''
    });
  },
  //点击搜索按钮触发事件 
  wxSearchFn: function(e){
    let that = this
    let text = that.data.searchKeyword;
    if(text){
      //参数重置
      this.setData({ 
        pageNum: 1,
        showList:[],
        loading: false,
        loadingComplete:false
      }) 
      that.fetchSearchList();
      WxSearch.wxSearchAddHisKey(that);
    }else{
      message.show.call(that, {
        content: '请输入关键字',
        icon: 'null',
        duration: 3000
      })
    }
  },
  //滚动到底部触发事件 
  searchScrollLower: function(){
    let that = this; 
    if(!that.data.loading && !that.data.loadingComplete){
      that.setData({ 
        pageNum: that.data.pageNum+1, //每次触发上拉事件，把pageNum+1 
      }); 
      that.fetchSearchList(); 
    }
  },
  //获取搜索结果
  fetchSearchList: function(){ 
    let that = this; 
    let searchKeyword = that.data.searchKeyword,
        pageNum = that.data.pageNum
      
    that.setData({ 
        loading: true,  //显示loading 
    })
    console.log(searchKeyword,pageNum)
    wx.request({
      url: app.conf.url.search,
      data: {
        k : searchKeyword,
        p : pageNum,
        city : 0,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {'content-Type': 'application/json'}, 
      success: function(res){
        if(res.statusCode == 200){
          let apiData = res.data.data
          console.log(apiData)
          if(apiData.list.length){ 
            let concatList = []; 
            concatList = that.data.showList.concat(apiData.list)
            that.setData({ 
              showList : concatList,
              resultTotal : apiData.total,
              loading : false          //请求结束 隐藏loading
            }); 
          }else{ 
            that.setData({
              loadingComplete: true,  //把“没有数据”设为true，显示 
              loading: false          //请求结束 隐藏loading
            }); 
          } 
        }
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  // 跳转详情页
  showItemTap: function(e){
    let schId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/details/index?id='+schId,
    })
  }


})