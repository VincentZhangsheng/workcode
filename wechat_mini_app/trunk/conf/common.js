/*
  * 公共配置项
  *
  * @date 2017-6-26
  * @author YuanFei
  *
  */
var env = require('env.js');

var domain        = env.domain,
    imgDomain     = env.imgDomain,
    mDomain       = env.mDomain,
    apiDomain     = env.apiDomain;

var conf = {
    appId                  : env.appId,
    appSecret              : env.appSecret,
    STATIC_SESSEION_ID_KEY : 'STATIC_SESSEION_ID', //本地固定sessionid存储key
    LOGIN_SESSION_ID_KEY   : 'LOGIN_SESSION_ID',   //本地存储登录成功时服务器返回的sessionid的key
    SERVER_SESSION_ID_KEY  : 'juooo_sessionid',    //服务器端SESSIONID的key

    //请求返回码
    CODE:{
        OK          : 'ok',           //请求成功，注意不代表有数据
        LOGIN       : 'login',        //未登录
        PHONE_LOGIN : 'phone_login',  //手机号登录
        FAIL        : 'fail',         //失败
        ERROR       : 'error',        //出错
    },
    url:{
        domain          : domain,
        imgDomain       : imgDomain,
        schedularInfo   : apiDomain + '/Schedule/getScheInfo',
        getCityInfo     : apiDomain + '/city/getCityInfo',
        getVenueInfo    : apiDomain + '/Venue/getVenueInfo',
        getAllCity      : apiDomain + '/City/getAllCitys',
        getHotCity      : apiDomain + '/city/GetHotCityList', 
        search          : apiDomain + '/search/index',                 //搜索
        getHotWords     : apiDomain + '/search/getHotWords',           //获取热搜词
        indexRecommend  : apiDomain + '/search/weightingRecommend',  //首页推荐

        //票价模块
		    getTicketsByScid   : mDomain+'/Ticket/widget',                     //获取票价

        //结算模块
        orderCheckInfo     : apiDomain + '/Buy/orderCheckInfo',     //结算页数据接口
        createOrder        : apiDomain + '/Buy/createOrder',        //结算确认下单接口
        pay                : apiDomain + '/Buy/pay',                //支付操作接口
        buyTickets         : apiDomain + '/Buy/buyTickets',          //购票接口
        getShippingWayInfo : apiDomain + '/Buy/getShippingWayInfo', //获取配送信息接口
        getExpressFee      : apiDomain + '/Buy/getExpressFee', //获取快递配送费接口
        getUserCertificationInfo : apiDomain + '/Buy/getUserCertificationInfo', //获取用户的实名认证信息
        

        //授权模块
        getMobileVerifyCode : apiDomain + '/Auth/getMobileVerifyCode',    //获取手机验证码
        login               : apiDomain + '/auth/login',                  //登录接口
        initSessionId       : apiDomain + '/auth/initSessionId',          //初始化sessionid接口

        //个人中心模块
        addUserCertification : apiDomain + '/myjuooo/addUserCertification', //绑定添加用户的实名认证信息
        getMyAddressList     : apiDomain + '/myjuooo/myAddress',   //获取用户收获地址列表
        getAllRegion         : apiDomain + '/City/getAllRegion',
        getAddress           : apiDomain + '/myjuooo/getAddress',
        updateAddress        : apiDomain + '/myjuooo/updateAddress',
        delAddress           : apiDomain + '/myjuooo/delAddress',
        myUserInfo           : apiDomain + '/myjuooo/myUserInfo',   //订单列表
        myOrderList          : apiDomain + '/myjuooo/myOrderList',   //订单列表
        deleteOrder          : apiDomain + '/myjuooo/updateOrderDelStatus',   //删除订单
        cancelOrder          : apiDomain + '/myjuooo/cancelOrder',   //取消订单
        myOrderInfo          : apiDomain + '/myjuooo/myOrderInfo',   //订单详情
        GeocodingAPI         : 'https://api.map.baidu.com/geocoder/v2/?output=json&ret_coordtype=gcj02ll&ak=BMoKrKQ5DsgBvsi2E1F3OdL8dsuMG1tG&address=',  //地址解析
        getEticketCode       : apiDomain + '/City/getEticketCode',  //电子票二维码
    }
    
}

module.exports = conf;
