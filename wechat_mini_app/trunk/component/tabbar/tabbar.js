
// 默认的tabbar数据对象
let defaultTabbarData = [
  {
    pagePath: '/pages/index/index',
    text: "首页", //按钮名称
    iconClass: 'icon-shouye',
  },
  {
    pagePath: '/pages/show/index',
    text: "演出库", //按钮名称
    iconClass: 'icon-show',
  },
  {
    pagePath: '/pages/myjuooo/index',
    text: "我的", //按钮名称
    iconClass: 'icon-wode',
  },
];

module.exports = {
  setCurrentTabbar: function (text) {
    var that = this
    that.setData({
      tabbarData: defaultTabbarData,
      currentTabbar: text
    })
  }
}