/*
  * 手机号登录页
  *
  * @date 2017-6-20
  * @author YuanFei
  *
  */
var app = getApp();
var util = require('../../utils/util.js');

const SUBMIT_BTN_TXT = {
        normal: '绑定并登录',
        busy: '登录中...',
      };

Page({
  data:{
    userMobile:'',
    getVerifyBusy:false,
    verifyStatusTxt:'获取验证码',
    submitTxt: SUBMIT_BTN_TXT.normal,
    submitBusy:false,
    tipsTxt:'',
    showTips:false,
  },
  //手机号输入框监听
  userMobileInput:function(event)
  {
    this.setData({
      userMobile:event.detail.value
    });
  },
  //清空手机号输入框内容
  clearUserMobileTap:function()
  {
    this.setData({
      userMobile: ''
    });
  },
  //点击获取验证码事件
  getVerifyCodeTap: function () {

    var that = this;
    if (that.data.getVerifyBusy)
    {
      return;
    }

    var mobile = that.data.userMobile;

    if (!util.getValidateReg('mobile').test(mobile)) 
    {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请填写正确的手机号码！',
        success: function (res) {
        }
      });
      return;
    }

    return;
    
    that.data.getVerifyBusy = true;
    that.setData({
      verifyStatusTxt: '获取中..'
    });

    app.getMobileVerifyCode(mobile,function(){
      var startNum = 60;
      var timer = setInterval(function(){
        if ( startNum < 1 )
        {
          clearInterval(timer);
          that.data.getVerifyBusy = false;
          that.setData({
            verifyStatusTxt: '获取验证码'
          });
          return;
        }

        that.setData({
          verifyStatusTxt: '已发送('+startNum + 's)'
        });
        startNum--;
      },1000);
      
    },function(){
      that.data.getVerifyBusy = false;
      that.setData({
        verifyStatusTxt: '获取验证码'
      });
    });
  },
  //登录提交表单按钮
  formSubmit: function (event) {
    var that = this;
    if(that.data.submitBusy)
    {
      return;
    }
    
    var formData = event.detail.value;

    that.setData({
      tipsTxt: '',
      showTips: false,
    });

    //手机号填写检测
    if (!util.getValidateReg('mobile').test(formData.user_mobile))
    {
      that.setData({
        tipsTxt: '请填写正确的手机号码！',
        showTips: true,
      });
      return;
    }

    //验证码填写检测
    if (!formData.verify_code) 
    {
      that.setData({
        tipsTxt: '请填写验证码！',
        showTips: true,
      });
      return;
    }

    that.setData({
      submitTxt: SUBMIT_BTN_TXT.busy,
      submitBusy: true,
    });

    app.login({
      moblie: formData.user_mobile,
      verifyCode: formData.verify_code,
      success: function () {

        that.setData({
          submitTxt: SUBMIT_BTN_TXT.normal,
          submitBusy: false,
        });

        let route = getCurrentPages();
        if(route[route.length - 2].route == 'pages/myjuooo/index'){
          wx.reLaunch({
            url: '/pages/myjuooo/index',
          })
        }

        //that.buyTicketsBusy = false;
        //that.buyTickets(tickets);
        var loginBackUrl = app.globalData.loginBackUrl;
        if (loginBackUrl)
        {
          app.globalData.loginBackUrl = '';
          wx.navigateTo(loginBackUrl);
        }
        else
        {
          wx.navigateBack();
        }
        
      },
      fail:function(res)
      {
          that.setData({
            submitTxt: SUBMIT_BTN_TXT.normal,
            submitBusy: false,
          });

          if (res.data.msg)
          {
            that.setData({
              tipsTxt: res.data.msg,
              showTips: true,
            });
          }
      }
    });
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  userNameInput:function(e){
    classname:"",
    console.log('11')
  }
})