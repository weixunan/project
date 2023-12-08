// pages/setBaseline/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      InventoryMessages:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInventoryMessages();
  },
  getInventoryMessages(){
    wx.request({
      url: 'http://172.29.15.95:3003/getInventoryMessages',
      method: 'GET',
      success: (res) => {
        const { data } = res;
        // 将获取到的预警信息更新到页面数据中
        this.setData({
          InventoryMessages: data,
        });
      },
      fail: (error) => {
        console.error('Failed to fetch InventoryMessages:', error);
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