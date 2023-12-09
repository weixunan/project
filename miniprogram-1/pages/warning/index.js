// pages/warning/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    warningMessagesLess: [], // 存放库存过少的预警消息
    warningMessagesMore: [], // 存放库存过多的预警消息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getWarningMessages();
  },
  getWarningMessages() {
    // 假设有一个获取商品预警信息的后台接口，返回一个包含预警信息的数据
    // 你需要根据你的实际情况调用后台接口
    // 这里用一个假数据代替
    // 库存过少
    wx.request({
      url: 'http://192.168.137.211:3003/getWarningMessages',
      method: 'POST',
      data:{
        request: "less",
      },
      header: {
        'Content-Type': 'application/json',
      },
      success: (res) => {
        const { data } = res;
        // 将获取到的预警信息更新到页面数据中
        this.setData({
          warningMessagesLess: data,
        });
      },
      fail: (error) => {
        console.error('Failed to fetch warning messages1:', error);
        // 处理请求失败的情况，比如弹窗提示用户网络错误
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none',
          duration: 2000
        });
      },
    });
     // 库存过多
     wx.request({
      url: 'http://192.168.137.211:3003/getWarningMessages',
      method: 'POST',
      data:{
        request: "more",
      },
      header: {
        'Content-Type': 'application/json',
      },
      success: (res) => {
        const { data } = res;
        // 将获取到的预警信息更新到页面数据中
        this.setData({
          warningMessagesMore: data,
        });
      },
      fail: (error) => {
        console.error('Failed to fetch warning messages1:', error);
        // 处理请求失败的情况，比如弹窗提示用户网络错误
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none',
          duration: 2000
        });
      },
    });
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

  }
})