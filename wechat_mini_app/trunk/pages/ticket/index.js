/*
  * 结算页
  *
  * @date 2017-5-4
  * @author YuanFei
  * @param {Int} scid 排期编号 
  * @param {Int} sid 演出ID
  * @param {Int} vid 场馆ID
  * @param {Int} cid 城市ID
  *
  */
var app = getApp();
var util = require('../../utils/util.js');
var message = require('../../component/message/message');


const CONFIRM_BTN_TXT = {
  normal: '确定',
  busy: '提交中...',
  login:'登录中...'
};

const BUY_BOTTOM_BAR_HEIGHT = 110;

Page({
  data: {
   selectedQuantity:0,     //已选总张数
   selectedPrice:0,        //已选总票价
   selectedTickets:{},  //已选票品
   tickets:[],          //票品数据
   sches:[],            //接口排期票品数据
   enterScid:0,         //进入页面的排期ID
   selectedScid:'',     //已选中排期ID
   selectedSch: false,     //已选中排期
   ticketLimit:6,        //可选票总张数限制
   buyTicketsBusy:false,  //购票忙碌标识
   confirmBtnTxt: CONFIRM_BTN_TXT.normal,
   showTicket: true,
   bottomBar:0,//底部栏显示编号，1为已取消，2为正常购票，3为预定
   toggleBlockHeight: BUY_BOTTOM_BAR_HEIGHT,
  },
  //票价选择按钮
  ticketSelectTap: function(event) {
    var that = this;
    
    var tid   = event.currentTarget.dataset.tid,
        index = event.currentTarget.dataset.index;
    
    //是否可点
    if(this.data.tickets[index].past)
    {
      return;
    }
    
    if(!this.data.tickets[index].active)
    {
      if(this.data.selectedQuantity >= this.data.ticketLimit)
      {
        message.show.call(that, {
          content: '已超出可选张数限制！',
          icon: 'hidden',
          duration: 2000,
        });

        // wx.showToast({
        //   title: '已超出可选张数限制！',
        //   icon:false,
        //   duration: 2000
        // });
        return;
      }
      this.data.selectedTickets[index]          = this.data.tickets[index];
      this.data.selectedTickets[index].quantity = 1;
    }
    else
    {
      delete this.data.selectedTickets[index];
    }

    this.setData({
        selectedTickets:this.data.selectedTickets
      });

    this.data.tickets[index].active = !this.data.tickets[index].active;
    this.setData({
        tickets:this.data.tickets
      });   
    
    this.refreshSelectedTicketSum();
  },
  //删除票价按钮
  delSelectTap: function(event) {
    var index = event.currentTarget.dataset.index;

    delete this.data.selectedTickets[index];
    this.setData({
        selectedTickets:this.data.selectedTickets
      });

    this.data.tickets[index].active = !this.data.tickets[index].active;
    this.setData({
        tickets:this.data.tickets
      });
    this.refreshSelectedTicketSum();
  },
  //增加票价数量按钮
  addTicketQuantity: function(event) {
    var that = this;
    var index = event.currentTarget.dataset.index;

    if(this.data.selectedQuantity >= this.data.ticketLimit)
    {
      message.show.call(that, {
        content: '已超出可选张数限制！',
        icon: 'hidden',
        duration: 2000,
      });

      // wx.showToast({
      //   title: '已超出可选张数限制！',
      //   icon:false,
      //   duration: 2000
      // });
      return;
    }
    
    //库存判断
    if(this.data.selectedTickets[index].quantity >= this.data.selectedTickets[index].stock)
    {
      message.show.call(that, {
        content: '此票价库存不足！',
        icon: 'hidden',
        duration: 2000,
      });
      // wx.showToast({
      //   title: '此票价库存不足！',
      //   icon:false,
      //   duration: 2000
      // });
      return;
    }

    this.data.selectedTickets[index].quantity += 1;
    this.setData({
        selectedTickets:this.data.selectedTickets
      });
    this.refreshSelectedTicketSum();
  },
  //减少票价数量按钮
  minusTicketQuantity: function(event) {
    var index = event.currentTarget.dataset.index;

    if(this.data.selectedTickets[index].quantity < 2)
    {      
      return;
    }

    this.data.selectedTickets[index].quantity -= 1;
    this.setData({
        selectedTickets:this.data.selectedTickets
      });
    this.refreshSelectedTicketSum();

  },
  //刷新当前已选票张数总和以及总价
  refreshSelectedTicketSum: function(event) {
    var totalQuantity = 0,
        totalPrice    = 0;

    for(var k in this.data.selectedTickets)
    {
      totalQuantity += this.data.selectedTickets[k].quantity;
      totalPrice    += parseFloat(this.data.selectedTickets[k].price) * this.data.selectedTickets[k].quantity;
    }
    this.setData({
      selectedQuantity:totalQuantity,
      selectedPrice:totalPrice
    });
    this.changeMargin();
  },
  //日期场次选择按钮
  dateSelectTap: function(event) {
    var scid = event.currentTarget.dataset.scid;

    var that = this;

    if (that.data.selectedScid != scid && this.data.selectedQuantity > 0)
    {
        wx.showModal({
          title: '提示',
          content: '切换场次会清空已选票价，是否确认切换？',
          success: function(res) {
            if (res.confirm) 
            {
              that.selectDate(scid);
              that.data.selectedTickets = {};
              that.setData({
                selectedTickets:that.data.selectedTickets
              });
              that.refreshSelectedTicketSum();
            } 
            else if (res.cancel) 
            {

            }
          }
        });
    }
    else
    {
      this.selectDate(scid);
    }
    
  },
  //日期场次选择
  selectDate(scid)
  {
    if (this.data.sches[scid] && this.data.sches[scid].active)
    {
      return;
    }
    
    this.setData({
        selectedSch: this.data.sches[scid],
        tickets:this.data.sches[scid].ticket_list
      });
    
    this.data.sches[this.data.selectedScid].active = false;
    this.data.sches[scid].active = true;    
    this.setData({
      sches: this.data.sches
    });
    this.data.selectedScid = scid;

    var bottomBar = 0;

    //开售，预售开票
    if (this.data.selectedSch.sell_status == '1' || this.data.selectedSch.sell_status == '2' ) 
    {
      bottomBar = 2;
    }

    //预售预热，预定
    if (this.data.selectedSch.sell_status == '3' || this.data.selectedSch.sell_status == '4') 
    {
      bottomBar = 3;
    }

    //取消
    if (this.data.selectedSch.is_abolish == '1')
    {
      bottomBar = 1;
    }

    this.setData({
      bottomBar: bottomBar
    });

    //如果排期需要实名认证，则更新购票限制张数
    if (this.data.sches[scid].is_real_name_certification == '1') 
    {
      this.data.ticketLimit = this.data.sches[scid].certification_limit_ticket_num;
    }
  },
  //获取所有排期场次以及票价
  getSches(scid,showId,venueId,cityId)
  {
    var that = this;

    wx.showLoading({
      title:'加载中...'
    });
    wx.request({
        url: app.conf.url.getTicketsByScid,
        //data: { type: 6, id: scid, showId: showId, venueId: venueId, cityId: cityId, passWxWebOauth: 1},
        data: { types: 6, id: scid, show_id: showId, venue_id: venueId, city_id: cityId, passWxWebOauth: 1 },
        header:{'content-type': 'application/x-www-form-urlencoded',},
        method: 'POST',        
        success: function(res) {

          if(res.data.code == '1')
          {
            
            var sches = res.data.data;
            for(var k in sches)
            {
              
              if (sches[k].custom_show_time)
              {
                sches[k].showTimeText = sches[k].custom_show_time;
                sches[k].showTimeWeekText = '';
              }
              else
              {
                sches[k].showTimeText = util.dateFormat('Y.m.d', sches[k].show_time);
                sches[k].showTimeWeekText = util.getWeek(sches[k].show_time) + util.dateFormat(' H:i', sches[k].show_time);
              }

              //排期下所有票价库存判断
              var noStock = true;

              for(var k1=0;k1<sches[k].ticket_list.length;k1++)
              {
                sches[k].ticket_list[k1].past = false;

                sches[k].ticket_list[k1].stock = parseInt(sches[k].ticket_list[k1].stock);

                if (noStock && sches[k].ticket_list[k1].stock > 0)
                {
                  noStock = false;
                }

                if (sches[k].ticket_list[k1].stock < 1 || sches[k].ticket_list[k1].is_abolish == '1')
                {
                  sches[k].ticket_list[k1].past = true;
                }
              }

              //排期是否无法购买，判断条件包括，售罄，下架，过期，取消，
              if (noStock || sches[k].is_shelf || sches[k].is_over || sches[k].is_abolish == '1')
              {
                sches[k].past = true;
              }

              //sell_status和上面的条件分开判断，不在预售开票，和开售状态下，排期也无法购买
              if(sches[k].sell_status != '1' && sches[k].sell_status != '2' )
              {
                sches[k].past = true;
              }

              //票品根据排期判断是否无法购买
              for (var k1 = 0; k1 < sches[k].ticket_list.length; k1++) 
              {
                if (sches[k].past)
                {
                  sches[k].ticket_list[k1].past = true;
                }
              }

              if (that.data.enterScid == k) 
              {
                //如果排期需要实名认证，则更新购票限制张数
                if (sches[k].is_real_name_certification == '1')
                {
                  that.data.ticketLimit = sches[k].certification_limit_ticket_num;
                }

                //sches[k].active = true;
                that.data.selectedScid = k;
                
                // that.setData({
                //   selectedSch: sches[k],
                //   tickets: sches[k].ticket_list
                // });
              }

            }
            
            that.setData({
              sches:sches
            });

            that.selectDate(that.data.selectedScid);
          }
          else
          {
            message.show.call(that, {
              content: '系统繁忙！ 错误码：1002',
              icon: 'hidden',
              duration: 2000,
            });

            // wx.showToast({
            //   title: '系统繁忙！ 错误码：1002',
            //   showCancel:false,
            //   success: function(res) {
            //     if (res.confirm) {
            //     }
            //   }
            // });
          }            
        },
        fail: function (res) {
          console.log('getSches fail',res)
          wx.showToast({
              title: '系统繁忙！ 错误码：1001',
              showCancel:false,
              success: function(res) {
                if (res.confirm) {
                }
              }
            });
        },
        complete: function(res) {
          console.log('getSches complete', res, app.conf.url.getTicketsByScid)
          wx.hideLoading();
        }
    });
  },
  //购票确定按钮
  confirmTap: function() {
    var that = this;

    if (that.data.buyTicketsBusy)
    {
      return;
    }

    that.data.buyTicketsBusy = true;
    that.setData({
      confirmBtnTxt: CONFIRM_BTN_TXT.busy
    });

    if (that.data.selectedQuantity < 1)
    {
      message.show.call(that, {
        content: '请选择票价！',
        icon:'hidden',
        duration:3000,
      });
      // wx.showToast({
      //   title: '请选择票价！',
      //   showCancel: false,
      //   content: '请选择票价！',
      //   success: function (res) {
      //     if (res.confirm) {
      //     }
      //   }
      // });
      that.resetBuyTicketStatus();
      return;
    }

    var tickets = [];

    for (var k in that.data.selectedTickets)
    {
      var item = that.data.selectedTickets[k].id + '_' + that.data.selectedTickets[k].quantity + '_' + 2;
      tickets.push(item);
    }
    tickets = tickets.join('^');
    console.log(2222, that.data.buyTicketsBusy)
    //335918_4_2^335919_2_2
    
    
    that.buyTickets(tickets);
    

  },
  //重置购票状态至正常状态
  resetBuyTicketStatus:function()
  {
    this.data.buyTicketsBusy = false;
    this.setData({
      confirmBtnTxt: CONFIRM_BTN_TXT.normal
    });
  },
  //购票请求函数
  buyTickets:function(tickets)
  {
    var that = this;
    app.sessionRequest({
      url: app.conf.url.buyTickets,
      data: {type:1,tickets:tickets,platform:'wx_mini_app'},
      method: 'POST',
      success: function(res){
        that.resetBuyTicketStatus();
        if(res.data.code == 'ok')
        {

            var _k     = res.data.data._k,
                _type  = res.data.data.orderType,
                _class = res.data.data.orderClass;

            //_k = 'ddfa98d6e8ee7c7a9d3653299653ad29';
            wx.redirectTo({
              url: '../order_check/index?_k=' + _k + '&order_type=' + _type +'&order_class='+_class
            });
        }
        else if(res.data.code == 'needLogin')
        {

          that.data.buyTicketsBusy = true;
          that.setData({
            confirmBtnTxt: CONFIRM_BTN_TXT.login
          });
          //调用登录
          app.login({
            success:function()
            {
              that.resetBuyTicketStatus();

              that.data.buyTicketsBusy = true;
              that.setData({
                confirmBtnTxt: CONFIRM_BTN_TXT.busy
              });
              that.buyTickets(tickets);
              
            },
            fail:function()
            {
              that.resetBuyTicketStatus();
            },
            beforeRedirect:function()
            {
              that.resetBuyTicketStatus();
            }
          });
        }
        else
        {
          var failMsg = '系统繁忙，请稍后再试！';
          if (res.data.msg)
          {
              failMsg = res.data.msg;
          }

          message.show.call(that, {
            content: failMsg,
            icon: 'hidden',
            duration: 3000,
          });

          // wx.showToast({
          //     title: failMsg,
          //     showCancel: false,
          //     content: failMsg,
          //     success: function (res) {
                
          //     }
          //   });
        }
      },
      fail: function(res) 
      {
        that.resetBuyTicketStatus();
      },
      complete: function(res) {
        console.log(44444, that.data.buyTicketsBusy)
        //that.resetBuyTicketStatus();
      }
    })
  },
  //页面加载入口
  onLoad: function (options) {
    var that = this;
    var scid    = options.scid,
        showId  = options.sid,
        venueId = options.vid,
        cityId  = options.cid;
    
    //本地测试数据
    // scid = scid ? scid : 77330;
    // showId = showId ? showId : 29730;
    // venueId = venueId ? venueId : 210;
    // cityId  = cityId ? cityId : 12;

    //测试服测试数据
    scid = scid ? scid : 78649;
    showId = showId ? showId : 32495;
    venueId = venueId ? venueId : 101;
    cityId  = cityId ? cityId : 1;

    if (!scid || !showId || !venueId || !cityId)
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

    this.setData({enterScid:scid});
    console.log('getSches start')
    this.getSches(scid,showId,venueId,cityId)

  },

  changeMargin: function(){
    let that = this;
    if( that.data.showTicket )
    {
      //以下必须分成两步，避免toView先执行
      that.setData({
        toggleBlockHeight: util.objectLength(that.data.selectedTickets) * 106 + BUY_BOTTOM_BAR_HEIGHT,
      });

      that.setData({
        toView: 'toEnd',
      });
    }

  },
  showTicket: function(){
    let that = this;
    that.setData({
      showTicket: !that.data.showTicket
    })
    that.changeMargin();

  }
})
