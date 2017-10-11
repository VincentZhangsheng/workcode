//app.js
App({
  onLaunch: function () {
    var that = this;
    that.conf = require('conf/common.js');
    wx.setStorageSync(that.conf.STATIC_SESSEION_ID_KEY,'');
    wx.setStorageSync(that.conf.LOGIN_SESSION_ID_KEY,'');

  },
  /*
  * 获取session请求头
  *
  * @date 2017-5-4
  * @author YuanFei
  * @param {Boll} normal 是否使用固定sessionid
  * @param {Boll} contentType 数据内容格式
  * @return {Mix}
  */
  getSessionHeader:function(normal,contentType)
  {
    contentType = contentType ? contentType : 'application/x-www-form-urlencoded' ;

    var sessionId = wx.getStorageSync(this.conf.LOGIN_SESSION_ID_KEY);//登录成功后的sessionID
    if (normal)
    {
      sessionId = wx.getStorageSync(this.conf.STATIC_SESSEION_ID_KEY);//固定的sessionID
    }

    if (sessionId) 
    {
      var header = { 'content-type': contentType, 'Cookie': this.conf.SERVER_SESSION_ID_KEY+'=' + sessionId }  
    } 
    else
    {  
      var header = { 'content-type': contentType }  
    } 

    return header;
  },
  //配置项
  conf:{},
  //全局变量
  globalData:{
    userInfo:null,
    loginCode:null,
    selectedAddress:false,//已选择收货地址
    loginBackUrl:'', //登录返回地址
    orderSnPayConfMap:{},//订单号和支付配置项映射表
    cityId: 0,
    cityName: '全国',
    reloadMy: false,
    rpxHeight: 1110,
    lastCityId: -1, //前一次城市ID
  },
  /*
  * 获取手机验证码
  *
  * @date 2017-5-4
  * @author YuanFei
  * @param {String} mobile 手机号码
  * @param {Function} success 请求成功回调
  * @param {Function} fail 请求失败回调
  * @return {Mix}
  */
  getMobileVerifyCode : function (mobile,success,fail)
  {
    var that = this;    
    var postData = {mobile: mobile};

    //重新获取固定sessionid
    wx.request({
      url: that.conf.url.initSessionId,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        if (res.data.code == 'ok') 
        {
          wx.setStorageSync(that.conf.STATIC_SESSEION_ID_KEY, res.data.data);

          //再带上最新的固定sessionid发送请求
          var header = that.getSessionHeader(true);
          wx.request({
            url: that.conf.url.getMobileVerifyCode,
            data: postData,
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: header, // 设置请求的 header
            success: function (res) 
            {
              if (res.data.code == 'ok') 
              {
                 typeof success == "function" && success();
              }
              else
              {
                var failMsg = '验证码获取失败，请稍后再试！';
                if (res.data.msg) 
                {
                  failMsg = res.data.msg;
                }
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: failMsg,
                  success: function (res) {
                    
                  }
                });
                typeof fail == "function" && fail();
              }
              
            }
          });

        }
      },
      fail: function (res) {
        // fail
        typeof fail == "function" && fail();
      },
      complete: function (res) {
        // complete
      }
    });
  },

  //登录状态检测--暂时废弃
  /*
  checkLocalLogin:function(params)
  {
    if (wx.getStorageSync(this.conf.STATIC_SESSEION_ID_KEY))
    {
      typeof params.success == "function" && params.success();
      return;
    }

    typeof params.fail == "function" && params.fail();
    return;
  },
  */

  /*
  * 公共登录方法
  * 登录可能出现两种，一种是用户已经绑定手机号码，表现为静默登录，二种是未绑定，会发生页面跳转
  *
  * @date 2017-5-4
  * @author YuanFei
  * @param {Object} params 参数对象
  * @param {Function} params.success 登录成功回调
  * @param {Function} params.fail 登录失败回调-params对象成员
  * @param {Bool} params.forceRedirect 是否自动跳转到手机界面 默认自动跳转
  * @param {Function} params.beforeRedirect 界面跳转前回调
  * @param {String} params.backUrl 登录成功后的返回地址
  * @param {Bool} params.showMobileModal 是否显示绑定手机模态
  */
  login:function(params){
      var that = this;

      //首先重置登录sessionid
      wx.setStorageSync(this.conf.LOGIN_SESSION_ID_KEY, '');

      //发送登录请求方法
      var sendLoginRequst = function (postData)
      {
        var header = that.getSessionHeader(true);

        //发送登录请求到服务器
        wx.request({
          url: that.conf.url.login,
          data: postData,
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: header, // 设置请求的 header
          success: function (res) {
            console.log('sendLoginRequst network success:' , res,'===', res.data,'---');

            if (res.data.code == 'ok') 
            {
              console.log('sendLoginRequst OK SESSIONID:' + res.data);
              wx.setStorageSync(that.conf.LOGIN_SESSION_ID_KEY, res.data.data);
              typeof params.success == "function" && params.success();
              return;
            }
            else if (res.data.code == that.conf.CODE.PHONE_LOGIN)
            {
              console.log('sendLoginRequst PHONE_LOGIN:' + res.data);

              typeof params.beforeRedirect == "function" && params.beforeRedirect();

              that.globalData.loginBackUrl = params.backUrl ? params.backUrl : '';
              //需要手机号登录则跳转到手机输入框页面
              if (params.redirectConfirm)
              {
                if (!wx.getStorageSync('HIDE_MOBILE_MODAL') || params.showMobileModal ){
                  wx.showModal({
                    title: '提示',
                    showCancel: true,
                    content: '当前账号未绑定手机号，请绑定手机号进行登录。',
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '/pages/login/phone'
                        });
                      }
                    }
                  });
                  wx.setStorageSync('HIDE_MOBILE_MODAL', true);
                }
              }
              else
              {
                wx.navigateTo({
                  url: '/pages/login/phone'
                });
              }
              
            }
            else 
            {
              console.log('sendLoginRequst network OK result fail:' + res.data);

              var failMsg = '系统繁忙，请稍后再试！错误码：-1001';
              if (res.data.msg) {
                failMsg = res.data.msg;
              }

              wx.showModal({
                title: '登录失败',
                showCancel: false,
                content: failMsg,
                success: function (res) {
                }
              });

              typeof params.fail == "function" && params.fail(res);

              return;
            }
          },
          fail: function (res) {
            console.log('sendLoginRequst fail:' + res.data);

            var failMsg = '系统繁忙，请稍后再试！错误码：-1002';
            if (res.data.msg) {
              failMsg = res.data.msg;
            }

            wx.showModal({
              title: '登录失败',
              showCancel: false,
              content: failMsg,
              success: function (res) {
              }
            });

            // fail
            typeof params.fail == "function" && params.fail(res);
            return;
          },
          complete: function (res) {
            // complete
          }
        });
      }
      //登录方法
      var loginUtil = function (code,userInfoRes)
      {
        that.globalData.userInfo = userInfoRes.userInfo;

        //var code   = that.globalData.loginCode;

        var postData = { code: code, encryptedData: userInfoRes.encryptedData, iv: userInfoRes.iv };

        if (params.moblie)
        {
          if (!params.verifyCode)
          {
            console.log('手机绑定登录时请附带验证码！');
            return;
          }
          postData.mobile     = params.moblie;
          postData.verifyCode = params.verifyCode;

          //如果是手机号绑定登录，则不需要重新获取sessonid，因为获取手机验证码的时候已经获取过新的sessionid了
          sendLoginRequst(postData);
          return;
        }       

        //如果不是手机绑定登录，则重新获取固定sessionid
        wx.request({
          url: that.conf.url.initSessionId,
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          success: function (res) {
            if (res.data.code == 'ok') 
            {
              wx.setStorageSync(that.conf.STATIC_SESSEION_ID_KEY, res.data.data);
              sendLoginRequst(postData);
            }
            else
            {
              var failMsg = '系统繁忙，请稍后再试！错误码：-1003';
              if (res.data.msg) {
                failMsg = res.data.msg;
              }

              wx.showModal({
                title: '登录失败',
                showCancel: false,
                content: failMsg,
                success: function (res) {
                }
              });

              typeof params.fail == "function" && params.fail(res);
            }
          },
          fail: function (res) {

            var failMsg = '系统繁忙，请稍后再试！错误码：-1004';
            if (res.data.msg) {
              failMsg = res.data.msg;
            }

            wx.showModal({
              title: '登录失败',
              showCancel: false,
              content: failMsg,
              success: function (res) {
              }
            });

            typeof params.fail == "function" && params.fail(res);
          },
          complete: function (res) {
            // complete
          }
        });
      };


      //之前认为以目前微信的官方文档逻辑来看，用处就只有一点,就是在于wx.login获取到的code的那五分钟有效期的判断，但是后面调试了很久，早就过了5分钟了，这时候checksession还是会走到success里面，这时候code早就过期了，所以之前的那个用处也就推翻了，目前并未发现checksession有什么用处。。。而且wx.getUserInfo()也和这个checkSession()没有任何关系
      /*wx.checkSession({
      success: function(){

      },
      fail: function(){

      }
      });*/

      wx.login({
        success: function (loginRes) {
          var code = loginRes.code;
          that.globalData.loginCode = code;

          wx.getUserInfo({
            success: function (userInfoRes) {
              loginUtil(code,userInfoRes);
            },
            fail: function(){
              wx.showModal({
                title: '提示',
                content: '为正常使用，聚橙网希望获得您的公开信息(昵称、头像等),请 前往授权 勾选用户信息后确定。',
                // cancelText: '返回首页',
                confirmText: '前往授权',
                success: function(res) {
                  if (res.confirm) 
                  {
                    wx.openSetting({
                      success: function (res) 
                      {
                        if (res.authSetting["scope.userInfo"]) 
                        {
                          that.login(params);
                        }
                        else
                        {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'loading',
                            duration: 2000,
                            mask: true,
                          })
                        }
                      }
                    });
                  }
                  else if (res.cancel) 
                  {
                    typeof params.fail == "function" && params.fail(res);
                  }
                },
              })
            }
          });
        }
      });
  },
  /*
  * 带上登录后的sessionid的网络请求
  *
  * @date 2017-5-4
  * @author YuanFei
  * @param {Object} params 请求参数，同wx.request()请求的参数
  * @return {Mix}
  */
  sessionRequest:function(params)
  {
    if(params.header)
    {
      params.header = Object.assign(params.header,this.getSessionHeader());
    }
    else
    {
      params.header = this.getSessionHeader();
    }
    
    wx.request(params);
  }
})