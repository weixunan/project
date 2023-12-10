// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    warn_num: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getWarningNum();
  },
  
  // 获取库存预警数量
  getWarningNum() {
    //const requeststr = "getWarningNumber";
    const thisfunc = this;
    wx.request({
      method: 'POST',
      url: 'http://172.29.15.95:3003/getWarningNumber',
      header: {
        'Content-Type': 'application/json',
      },
      data: {

      },
      success: function (res) {
        console.log(res);
        // console.log(res.data.warn_nums[0].warn_nums);
        //const result = res.body.json;
        //console.log(result);
        thisfunc.setData({
          warn_num: res.data.warn_nums[0].warn_nums,
        })
      },
      failed: function () {
        console.log('failed to get warning number');
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  //主页的跳转函数，用于跳转到不同的页面
  goTo:function(e){
    var app = getApp();
    if(e.currentTarget.dataset.name=="basicData"||e.currentTarget.dataset.name=="report")
    {
      if(app.globalData.elevel>=2)
      {
        var goUrl='/pages/'+e.currentTarget.dataset.name+'/index';
        wx.navigateTo({
        url: goUrl,
        })
      }
      else
      {
        wx.showToast({
          title: '权限不足',
          icon:'error'
        })
      }
    }
    else if (e.currentTarget.dataset.name=="userManage"||e.currentTarget.dataset.name=="setBaseline")
    {
      if(app.globalData.elevel>=3)
      {
        var goUrl='/pages/'+e.currentTarget.dataset.name+'/index';
        wx.navigateTo({
        url: goUrl,
        })
      }
      else
      {
        wx.showToast({
          title: '权限不足',
          icon:'error'
        })
      }
    }
    else
    {
      var goUrl='/pages/'+e.currentTarget.dataset.name+'/index';
        wx.navigateTo({
        url: goUrl,
        })
    }
  }
})