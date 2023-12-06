// pages/in/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ono: 1234567,
    gpicture: 'https://ide.code.fun/api/image?token=656d6dedfcfbac001136a0a7&name=8e5c1454459812d46375c64fa520fde7.png',  // 图片路径

  },

  // form表单的submit事件
  formSubmit(e) {
    const json = e.detail.value;
    console.log("入库表单submit的JSON对象字符串->" + JSON.stringify(json));
    // console.log("入库表单gno->" + json['gno']);
    wx.request({
      method: 'POST',
      // 调试的时候改为自己的ip
      url: 'http://172.29.15.95:3003/input',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        json: json,
        gpicture: this.data.gpicture,
      },
      success: function (res) {
        // 返回的数据在res中，后端定义了1个返回给前端的变量：
        // 1. res.data.success表示入库操作是否成功
        console.log("success->" + res.data.success); // 这是输出到本地控制台的信息，无关紧要
        if (res.data.success) {            
          console.log("入库成功");
          wx.showToast({
            title: '入库成功',
            icon: 'success'
          });
        } else {
          // 入库失败
          wx.showToast({
            title: '入库失败',
            icon: 'error'
          });
        }
      },
      // fail: 向后端服务器请求失败，注意是请求失败，不代表数据有误
      fail: function() {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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