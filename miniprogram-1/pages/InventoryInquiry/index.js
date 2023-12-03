Page({
  data: {},

  onShareAppMessage() {
    return {};
  },
  onShow: function() {
    wx.hideHomeButton();  //隐藏home/返回主页按钮
  },
});