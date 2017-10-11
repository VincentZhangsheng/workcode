/*
  * 环境配置项，存放所有和运行环境有关的配置项
  *
  * @date 2017-6-26
  * @author YuanFei
  *
  */
var env = require('envSwitch.js');

var conf = {
        local:{//本地开发环境
            apiDomain : 'http://wxminiapp.juooo5.com',
            domain    : 'http://www.juooo5.com',
            imgDomain : 'http://image.juooo.com.cn',
            mDomain   : 'http://m.juooo5.com',
            appId     : 'wx11af4a9056a76ba1',
            appSecret : '899f418476c888b467646559debc162d',
        },
        dev:{//线上开发环境
            apiDomain : 'http://wxminiapp.juooo.com.cn',
            domain    : 'http://www.juooo.com.cn',
            imgDomain : 'http://image.juooo.com.cn',
            mDomain   : 'http://m.juooo.com.cn',
            appId     : 'wx11af4a9056a76ba1',
            appSecret : '899f418476c888b467646559debc162d',
        },
        test:{//测试环境
            apiDomain : 'https://wxminiapp.juooo.net.cn',
            domain    : 'http://www.juooo.net.cn',
            imgDomain : 'http://image.juooo.net.cn',
            mDomain   : 'https://m.juooo.net.cn',
            appId     : 'wx11af4a9056a76ba1',
            appSecret : '899f418476c888b467646559debc162d',
        },        
        product:{//生产环境
            apiDomain : 'https://wxminiapp.juooo.com',
            domain    : 'http://www.juooo.com',
            imgDomain : 'http://image.juooo.com',
            mDomain   : 'https://m.juooo.com',
            appId     : 'wx11af4a9056a76ba1',
            appSecret : '899f418476c888b467646559debc162d',
        },
    }

module.exports = conf[env];


