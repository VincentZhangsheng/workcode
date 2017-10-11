/*
  * 用户实名认证页
  *
  * @date 2017-6-26
  * @author YuanFei
  *
  */
var app = getApp();
const SUBMIT_BTN_TXT = {
  normal: '验证并绑定',
  busy: '提交中...',
};

Page({
  data: {
    submitTxt: SUBMIT_BTN_TXT.normal,
    submitBusy: false,
    tipsTxt: '',
    showTips: false,
    },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },  
  //登录提交表单按钮
  formSubmit: function (event) {

    var that = this;
    if (that.data.submitBusy) {
      return;
    }

    var formData = event.detail.value;

    that.setData({
      tipsTxt: '',
      showTips: false,
    });

    //姓名填写检测
    if (!formData.id_card_name) {
      that.setData({
        tipsTxt: '请填写姓名！',
        showTips: true,
      });
      return;
    }

    //身份证号码填写检测
    if (!formData.id_card_no) {
      that.setData({
        tipsTxt: '请填写身份证号码！',
        showTips: true,
      });
      return;
    }

    that.setData({
      submitTxt: SUBMIT_BTN_TXT.busy,
      submitBusy: true,
    });

    app.sessionRequest({
      url: app.conf.url.addUserCertification,
      data: { idCardNo: formData.id_card_no, idCardName: formData.id_card_name },
      method:'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          submitTxt: SUBMIT_BTN_TXT.normal,
          submitBusy: false,
        });

        if (res.data.code == 'ok')
        {
          //调用结算页获取用户认证信息的回调方法
          var pages = getCurrentPages();
          if (pages.length > 1) 
          {
            var prePage = pages[pages.length - 2];
            prePage.getUserCertificationInfo && prePage.getUserCertificationInfo()
          }

          wx.navigateBack()
        }
        else if (res.data.code == "needLogin")
        {
          that.setData({
            submitTxt: SUBMIT_BTN_TXT.busy,
            submitBusy: true,
          });

          //调用登录
          app.login({
            success: function () {
              that.setData({
                submitTxt: SUBMIT_BTN_TXT.normal,
                submitBusy: false,
              });
              that.formSubmit(event);
            },
            fail: function () {
              that.setData({
                submitTxt: SUBMIT_BTN_TXT.normal,
                submitBusy:false,
              });

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
        else 
        {

          var failMsg = '系统繁忙，请稍后再试！';
          if (res.data.msg) {
            failMsg = res.data.msg;
          }

          wx.showToast({
            title: failMsg,
            showCancel: false,
            content: failMsg,
            success: function (res) {

            }
          });
        }
      },
      fail:function()
      {
        that.setData({
          submitTxt: SUBMIT_BTN_TXT.normal,
          submitBusy: false,
        });
      },
      complete:function(res)
      {
        console.log(res);        
      }
    })
  },
  onUnload: function () {
    // 页面关闭
  }
})