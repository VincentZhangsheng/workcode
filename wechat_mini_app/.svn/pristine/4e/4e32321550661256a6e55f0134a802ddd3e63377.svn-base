/*
  * 结算页
  *
  * @date 2017-5-4
  * @author YuanFei
  * @param {String} _k 加密订单编号
  * @param {String} orderType 订单类型
  * @param {String} orderClass 订单类别
  *
  */
var app = getApp();
var util = require('../../utils/util.js');
var message = require('../../component/message/message');

const PAY_BTN_TXT = {normal:'微信支付',
                     paying: '支付中...',
                     submitting: '提交中...',
                     login: '登录中...',
                     };

const DEFAULT_SHIPPING_ID = 1;

Page({
  data: {
    _k : '', //加密订单编号
    orderType : '', // 订单类型
    orderClass :'' , // 订单类别
    motto: 'Hello World',
    userInfo: {},
    shippingWay:[],//快递方式
    ticketsList:[],//购买票品列表
    ticketsCount:0,//购买票品总张数
    ticketsPriceSum:0,//购买票品总价
    schedule:{},//排期信息
    payTotalMoney:0,//应付
    selectedAddress:false,
    selectedShippingId: false,
    payBusy:false,
    payBtnTxt: PAY_BTN_TXT.normal,
    selectedAddressShow:false,
    orderSn:false,
    shoppingCartInfo:false, //购物车数据
    shippingInfoMap:{},//不同的配送方式对应的配送信息，包括手机号，地址，姓名
    shippingFee:0,
    toggleGoodsListClass: '',   //合计列表伸缩列表
    toggleGoodsListStyle: '',   //合计列表伸缩列表
    toggleGoodsArrowClass: 'icon-circlearrow-up',  //合计列表伸缩箭头
    showCertificateBtn:false,   //实名认证按钮显示
    showUserCertification: false,   //用户实名认证信息显示
    userCertificationData: [],   //用户实名认证信息
    disablePayBtn: false,         //禁用支付按钮
    disablePayBtnReason: [],   //禁用支付原因
    showPage: false,
  },
  //点击确认支付
  payTap: function() {
    var that = this;

    if (that.data.payBusy)
    {
      return;
    }
    app.globalData.reloadMy = true;
    that.data.payBusy = true;
    //如果保存有订单编号，直接启动支付，否则先创建订单
    if (that.data.orderSn) 
    {
      that.setData({
        payBtnTxt: PAY_BTN_TXT.paying,
      });
      that.startPay();      
    }
    else
    {
      that.setData({
        payBtnTxt: PAY_BTN_TXT.submitting,
      });
      that.createOrder();
    }

  },
  //设置禁用支付按钮状态
  setDisablePayBtnStatus:function(reason,del)
  {
    if (reason && del)
    {
      setDisablePayBtnStatus
    }
  },
  //电子票配送方式姓名输入监听
  elecTicketShippingNameInput: function (event) {
    this.data.shippingInfoMap[2].user_name = event.detail.value;
  },
  //电子票配送方式手机输入监听
  elecTicketShippingMobileInput: function (event) {
    this.data.shippingInfoMap[2].mobile = event.detail.value;
  },
  //现场取票配送方式姓名输入监听
  presentShippingNameInput: function (event) {
    this.data.shippingInfoMap[4].user_name = event.detail.value;
  },
  //现场取票配送方式手机输入监听
  presentShippingMobileInput: function (event) {
    this.data.shippingInfoMap[4].mobile = event.detail.value;
  },
  //上门取票配送方式姓名输入监听
  locationShippingNameInput: function (event) {
    this.data.shippingInfoMap[0].user_name = event.detail.value;
  },
  //上门取票配送方式手机输入监听
  locationShippingMobileInput: function (event) {
    this.data.shippingInfoMap[0].mobile = event.detail.value;
  },
  //创建订单
  createOrder:function() {
    var that = this;

    var params = {
      _k: that.data._k,
      orderType: that.data.orderType,
      orderClass: that.data.orderClass,
      shippingId: that.data.selectedShippingId,
      
    }

    if (!that.data.shippingInfoMap[that.data.selectedShippingId])
    {
      message.show.call(that, {
        content: '请填写正确的配送信息！',
        icon: 'hidden',
        duration: 3000,
      });

      // wx.showToast({
      //   title: '请填写正确的配送信息！',
      //   showCancel: false,
      //   success: function (res) {

      //   }
      // });
      that.resetPayStatus();
      return;
    }

    //配送方式判断
    switch (that.data.selectedShippingId) 
    {
      case 0://上门取票
        var errorMsg = '';
        if (!that.data.shippingInfoMap[0].user_name) {
          errorMsg = '请填写配送表单中的姓名项！';
          // wx.showToast({
          //   title: errorMsg,
          //   showCancel: false,
          //   success: function (res) {

          //   }
          // });

          message.show.call(that, {
            content: errorMsg,
            icon: 'hidden',
            duration: 3000,
          });
          that.resetPayStatus();
          return;
        }

        if (!util.getValidateReg('mobile').test(that.data.shippingInfoMap[0].mobile)) {
          errorMsg = '请填写正确的手机号码！';
          // wx.showToast({
          //   title: errorMsg,
          //   showCancel: false,
          //   success: function (res) {

          //   }
          // });

          message.show.call(that, {
            content: errorMsg,
            icon: 'hidden',
            duration: 3000,
          });
          that.resetPayStatus();
          return;
        }

        params.shippingName   = that.data.shippingInfoMap[0].user_name;
        params.shippingMobile = that.data.shippingInfoMap[0].mobile;
      break;

      case 1://快递
        if (!that.data.selectedAddress || !that.data.selectedAddress.address_id)
        {
          message.show.call(that, {
            content: '请选择快递配送地址！',
            icon: 'hidden',
            duration: 3000,
          });

          // wx.showToast({
          //   title: '请选择快递配送地址！',
          //   showCancel: false,
          //   success: function (res) {

          //   }
          // });

          that.resetPayStatus();
          return;
        }

        params.addressId = that.data.selectedAddress.address_id;
      break;

      case 2://电子票
        var errorMsg = '';
        if (!that.data.shippingInfoMap[2].user_name) 
        {
          errorMsg = '请填写配送表单中的姓名项！';
          // wx.showToast({
          //   title: errorMsg,
          //   showCancel: false,
          //   success: function (res) {

          //   }
          // });

          message.show.call(that, {
            content: errorMsg,
            icon: 'hidden',
            duration: 3000,
          });
          that.resetPayStatus();
          return;
        }

        if (!util.getValidateReg('mobile').test(that.data.shippingInfoMap[2].mobile)) 
        {
          errorMsg = '请填写正确的手机号码！';
          // wx.showToast({
          //   title: errorMsg,
          //   showCancel: false,
          //   success: function (res) {

          //   }
          // });

          message.show.call(that, {
            content: errorMsg,
            icon: 'hidden',
            duration: 3000,
          });
          that.resetPayStatus();
          return;
        }

        params.shippingName   = that.data.shippingInfoMap[2].user_name;
        params.shippingMobile = that.data.shippingInfoMap[2].mobile;
      break;

      case 4://现场取票
        var errorMsg = '';
        if (!that.data.shippingInfoMap[4].user_name) 
        {
          errorMsg = '请填写配送表单中的姓名项！';
          // wx.showToast({
          //   title: errorMsg,
          //   showCancel: false,
          //   success: function (res) {

          //   }
          // });
          message.show.call(that, {
            content: errorMsg,
            icon: 'hidden',
            duration: 3000,
          });
          that.resetPayStatus();
          return;
        }

        if (!util.getValidateReg('mobile').test(that.data.shippingInfoMap[4].mobile)) 
        {
          errorMsg = '请填写正确的手机号码！';
          // wx.showToast({
          //   title: errorMsg,
          //   showCancel: false,
          //   success: function (res) {

          //   }
          // });

          message.show.call(that, {
            content: errorMsg,
            icon: 'hidden',
            duration: 3000,
          });
          that.resetPayStatus();
          return;
        }

        params.shippingName = that.data.shippingInfoMap[4].user_name;
        params.shippingMobile = that.data.shippingInfoMap[4].mobile;
      break;

      default:

        // wx.showToast({
        //   title: '配送方式选择有误！',
        //   showCancel: false,
        //   success: function (res) {

        //   }
        // });

        message.show.call(that, {
          content: '配送方式选择有误！',
          icon: 'hidden',
          duration: 3000,
        });
        that.resetPayStatus();
        return;

      break;
    }

    //如果排期需要进行实名认证
    if (that.data.schedule.is_real_name_certification == '1')
    {
      if (!that.data.userCertificationData || that.data.userCertificationData.length < 1) 
      {
        // wx.showToast({
        //   title: '请实名认证后购买！',
        //   showCancel: false,
        //   success: function (res) {

        //   }
        // });

        message.show.call(that, {
          content: '请实名认证后购买！',
          icon: 'hidden',
          duration: 3000,
        });

        that.resetPayStatus();
        return;
      }

      params.certificationId = that.data.userCertificationData[0].user_certification_id;
      
    }

    app.sessionRequest(
    {
        url: app.conf.url.createOrder,
        data: params,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.resetPayStatus();
          if (res.data.code == 'ok')
          {
            that.setData({
              orderSn: res.data.data.order_sn,
            });

            that.data.payBusy = true;
            that.setData({
              payBtnTxt: PAY_BTN_TXT.paying,
            });
           that.startPay();
          }
          else if (res.data.code == "needLogin")
          {
            that.data.payBusy = true;
            that.setData({
              payBtnTxt: PAY_BTN_TXT.login,
            });

            app.login({
              success: function () {
                that.resetPayStatus();
                
                that.data.payBusy = true;
                that.setData({
                  payBtnTxt: PAY_BTN_TXT.submitting,
                });

                that.createOrder();
              },
              fail:function()
              {
                that.resetPayStatus();
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
          that.resetPayStatus();
        },
        complete: function () {
          
        }
      }
    );
  },
  //支付流程退出忙碌状态，恢复正常状态
  resetPayStatus:function()
  {
    this.data.payBusy = false;
    this.setData({
      payBtnTxt: PAY_BTN_TXT.normal,
    });
  },
  //启动支付
  startPay:function()
  {
    var that = this;

    if (!that.data.orderSn)
    {
      wx.showToast({
        title: '系统繁忙，请稍后再试！ ',
        showCancel: false,
        content: '系统繁忙，请稍后再试！ ',
        success: function (res) {

        }
      });
      that.resetPayStatus();
      return;
    }

    util.startWxPay(that.data.orderSn, 
                function () {wx.redirectTo({
                  url: '/pages/myjuooo/order-detail?osn=' + that.data.orderSn,
                }); that.resetPayStatus(); }, 
                function () { that.resetPayStatus(); }
    );

  },
  //商品列表伸展
  toggleTicketsListTap:function()
  {
    var that = this;
    if (that.data.toggleGoodsArrowClass == 'icon-circlearrow-down')
    {
      
      var num = 0;
      for (var k in that.data.ticketsList)
      {
        num++
      }

      var rpx = num * 80;

      that.setData({
        toggleGoodsListClass: 'slide-down-status',
        toggleGoodsListStyle: 'max-height: ' + rpx +'rpx;overflow:hidden;',        
        toggleGoodsArrowClass: 'icon-circlearrow-up',
      })
      
    }
    else
    {
      that.setData({
        toggleGoodsListClass: 'slide-up-status',
        toggleGoodsListStyle: 'max-height: 0rpx;overflow:hidden;border:none;',
        toggleGoodsArrowClass: 'icon-circlearrow-down',
      })
    }
  },
  //选择收获地址
  selectShippingAddressTap: function () {
    wx.navigateTo({
      url: '../address/index?mode=select'
    });
  },
  //实名认证按钮
  certificateBtnTap: function () {
    wx.navigateTo({
      url: '/pages/certification/index'
    });
  },
  //获取用户实名认证信息
  getUserCertificationInfo: function () {
    var that = this;
    app.sessionRequest({
      url: app.conf.url.getUserCertificationInfo,
      //data: { _k: _k },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 'ok') 
        {
          //{ "user_certification_id":"38", "id_name":"*21", "id_number":"1221" }

          if(res.data.data && res.data.data.length > 0)
          {
            that.setData({
              userCertificationData: res.data.data,
            });

            if (that.data.schedule.is_real_name_certification == '1')
            {
              that.setData({
                showUserCertification: true,
                showCertificateBtn: false,
              });
            }
          }
          else
          {
            if (that.data.schedule.is_real_name_certification == '1')
            {
              that.setData({
                userCertificationData: [],
                showCertificateBtn: true,
                showUserCertification: false,
              });
            }
          }
        }
        else if (res.data.code == "needLogin") 
        {
          //调用登录
          app.login({
            success: function () {
              that.getUserCertificationInfo();
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
        }
        else 
        {
          var failMsg = '用户实名认证信息获取失败！';
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
      }
    })
  },
  //页面入口
  onLoad: function (options) {
    var that = this;
    var _k = options._k;
    
    _k = _k ? _k : 'bb6dd72a2dac2f833c4b3d2d9c3200b4';
    // _k = '13c15172d5c3fba6febd1ab1057a44a5';
    that.setData({
      _k: _k,
      orderType: options.order_type ? options.order_type : 1,
      orderClass: options.order_class ? options.order_class : 'buyTicket',
    });

    if (!_k)
    {
        wx.showModal({
          title: '提示',
          showCancel:false,
          content: '访问出错！',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
        return;
    }

    that.getShoppingCartInfo(_k);

  },
  //获取购物车信息
  getShoppingCartInfo: function (_k)
  {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    app.sessionRequest({
      url: app.conf.url.orderCheckInfo,
      data: { _k: _k },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 'ok')
        {
          that.data.shoppingCartInfo = res.data.data;

          var ticketsCount = 0,
            ticketsPriceSum = 0,
            ticketsList = res.data.data.buyObj.goods_list,
            shippingWayList = res.data.data.shipping_way,
            schedule = false,
            itemPriceSum = 0,
            num = 0;

          //已购票品列表
          for (var k in ticketsList)
          {
            itemPriceSum = parseFloat(ticketsList[k]['price']) * parseInt(ticketsList[k]['ticket_num']);
            ticketsPriceSum += itemPriceSum;
            ticketsCount += parseInt(ticketsList[k]['ticket_num']);

            if (!schedule)
            {
              schedule = ticketsList[k];
            }

            ticketsList[k].price = parseFloat(ticketsList[k]['price']);
            ticketsList[k].priceSum = itemPriceSum;
            num++;
          }
          
          var defaultSelectedShippingId = false, //默认选中的配送方式
              sortShippingWayList       = [],
              tempLocationShippingWay   = false;
          //配送方式列表
          for (var k in shippingWayList)
          {
            if(defaultSelectedShippingId === false)
            {
              defaultSelectedShippingId = shippingWayList[k].shippingId;
            }

            if (shippingWayList[k].shippingId == DEFAULT_SHIPPING_ID)
            {
              that.setData({
                selectedShippingId: DEFAULT_SHIPPING_ID,
              });
              defaultSelectedShippingId = DEFAULT_SHIPPING_ID;
            }

            
            if (shippingWayList[k].shippingId  === 0)
            {
              tempLocationShippingWay = shippingWayList[k];
              continue;
              //去掉上门取票的配送方式
              //shippingWayList.splice(k,1);
              //delete shippingWayList[k];
            }

            //将配送方式重新排序，把上门取票放到最后面
            sortShippingWayList.push(shippingWayList[k]);
          }

          tempLocationShippingWay && sortShippingWayList.push(tempLocationShippingWay);

          schedule.pic = app.conf.url.imgDomain + schedule.pic;

          that.setData({
            shippingWay: sortShippingWayList,
            ticketsList: ticketsList,
            ticketsCount: ticketsCount,
            ticketsPriceSum: ticketsPriceSum,
            schedule: schedule,
            toggleGoodsListStyle: 'max-height: ' + (num * 80) + 'rpx;',
            showPage: true,
          });

          that.resetPrices();

          if (defaultSelectedShippingId !== false)
          {
            that.selectShippingWay(defaultSelectedShippingId);
          }


          //如果此排期需要实名认证
          if (schedule.is_real_name_certification == '1')
          {
            that.getUserCertificationInfo();
          }
          
        }
        else if (res.data.code == "needLogin")
        {
          //调用登录
          app.login({
            success: function () {
              that.getShoppingCartInfo(_k);
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
      }
    });
  },
  //切换配送方式点击
  switchShippingWayTap:function(event)
  {
    var that = this;
    var shippingId = event.currentTarget.dataset.shipping_id;
    that.selectShippingWay(shippingId);
  },
  //重新计算各种价格
  resetPrices: function () {
    var that = this;

    var payTotalMoney = parseFloat(that.data.ticketsPriceSum) + parseFloat(that.data.shippingFee);

    that.setData({
      payTotalMoney: payTotalMoney
    });


  },
  // 选择配送方式
  selectShippingWay: function (shippingId) 
  {
    var that = this;
    this.setData({
      selectedShippingId: shippingId,
      shippingWay: this.data.shippingWay
    });

    if (that.data.shippingInfoMap[shippingId]) 
    {console.log('走缓存')
      //如果已经请求并保存了此配送方式的配送信息就直接设置数据
      var shippingFee = parseFloat(that.data.shippingInfoMap[shippingId].shipping_free);
          shippingFee = shippingFee ? shippingFee : 0;

      that.setData({
        shippingFee: shippingFee
      });

      that.resetPrices();
    }
    else 
    {
      console.log('走网络请求')
      //否则进行网络请求，并保存此配送方式的配送信息数据
      var params = {
        shippingId: shippingId,
        cityId: that.data.shoppingCartInfo.buyObj.city_id,
        venueId: that.data.shoppingCartInfo.buyObj.venue_id,
        orderType: that.data.orderType,
        orderAmount: that.data.shoppingCartInfo.buyObj.order_amount,
        cardId: that.data.shoppingCartInfo.buyObj.city_id,
      };

      app.sessionRequest(
      {
          url: app.conf.url.getShippingWayInfo,
          data: params,
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data.code == 'ok')
            {
              var current = that.data.shippingInfoMap;
              current[shippingId] = res.data.data;
              that.setData({
                shippingInfoMap: current
              });

              switch (shippingId) {
                case 0://上门取票

                break;

                case 1://快递
                  if (res.data.data.address.default && !that.data.selectedAddress)
                  {
                    //如果有默认地址，且当前填写或选中地址则进行地址自动填写
                    var defaultAdress = res.data.data.address.default;
                    defaultAdress.mergeAdress = defaultAdress.region + defaultAdress.address;
                    that.setData({
                      selectedAddress: res.data.data.address.default,
                      selectedAddressShow: true,
                    });

                  }
                break;

                case 2://电子票

                break;

                case 4://现场取票

                break;

              }

              var shippingFee = parseFloat(that.data.shippingInfoMap[shippingId].shipping_free);
                  shippingFee = shippingFee ? shippingFee : 0 ;
              that.setData({
                shippingFee: shippingFee,
                //payTotalMoney: parseFloat(that.data.shippingInfoMap[shippingId].shipping_free) + parseFloat(that.data.ticketsPriceSum),
              });

              that.resetPrices();
            }
            else if (res.data.code == "needLogin")
            {
              //调用登录
              app.login({
                success: function () {
                  that.selectShippingWay(shippingId);
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
            }
            else 
            {
              var failMsg = '获取配送信息失败';
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
          complete: function () {
          }
        }
      );
    }
  },
  //删除快递收件信息-可供地址选择页调用
  delExpressAdress: function (adressId) 
  {
    if (adressId == this.data.selectedAddress.address_id)
    {
      this.setData({
        selectedAddress: false,
        selectedAddressShow: false,
      });
    }
  },
  //重选快递收件信息-可供地址选择页调用
  selectExpressAdress: function (adress) 
  {
    var that = this;
    that.setData({
      disablePayBtn:true,
      selectedAddress: adress,
      selectedAddressShow: true,
    });
    var recieveCityId = adress.city;
    var params = 
    {
      orderAmount: that.data.shoppingCartInfo.buyObj.actual_Amount,
      consigneeId: recieveCityId,//收获地址城市ID
      method: that.data.shoppingCartInfo.buyObj.method,
      sell_status: that.data.shoppingCartInfo.buyObj.sell_status,
      shippingId: 1,
      cityId: that.data.shoppingCartInfo.buyObj.city_id,
      orderClass: that.data.orderClass,
    };
    
    app.sessionRequest(
    {
        url: app.conf.url.getExpressFee,
        data: params,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 'ok') 
          {
            that.setData({
              disablePayBtn: false,
            });

            var shippingFee = parseFloat(res.data.data.shipping_free);
            shippingFee = shippingFee ? shippingFee : 0;

            that.data.shippingInfoMap[1].shipping_free = shippingFee;
            that.setData({
              shippingFee: shippingFee,
            });

            that.resetPrices();
          }
          else if (res.data.code == "needLogin") 
          {
            //调用登录
            app.login({
              success: function () {
                that.getExpressFee(shippingId);
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
          }
          else 
          {
            var failMsg = '获取运费信息失败，请重新选择地址！';
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
          var failMsg = '获取运费信息失败，请重新选择地址！';
        
          wx.showToast({
            title: failMsg,
            showCancel: false,
            content: failMsg,
            success: function (res) {

            }
          });
        },
        complete: function () {
        }
      }
    );

  },
  onReady: function () 
  {
    // 页面渲染完成
    console.log('onReady')
  },
  onShow:function(){
    // 页面显示

    //从地址选择页跳转过来
    // this.setData({
    //   selectedAddress: app.globalData.selectedAddress,
    //   selectedAddressShow: app.globalData.selectedAddress ? true : false,
    // });

    // app.globalData.selectedAddress.address_id && this.selectShippingWay(1);

  },
  onHide:function(){
    // 页面隐藏
    console.log('onHide')
  },
  onUnload:function(){
    // 页面关闭
    console.log('onUnload')
  },
})
