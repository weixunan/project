// pages/output/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ono: '',  // 出库订单号，会根据当前时刻自动生成
    gpicture: '../assets/plus.png',  // 图片路径
  },

  // form表单的submit事件
  formSubmit(e) {
    const json = e.detail.value;
    console.log("出库表单submit的JSON对象字符串->" + JSON.stringify(json));
    wx.request({
      method: 'POST',
      // 调试的时候改为自己的ip
      url: 'http://172.29.15.187:3003/output',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        json: json,
        gpicture: this.data.gpicture,
        ono: this.data.ono,
      },
      success: function (res) {
        // 返回的数据在res中，后端定义了1个返回给前端的变量：
        // 1. res.data.success表示出库操作是否成功
        console.log("success->" + res.data.success); 
        if (res.data.success) {            
          console.log("出库成功");
          wx.showToast({
            title: '出库成功',
            icon: 'success'
          });
        } else {
          // 出库失败
          wx.showToast({
            title: '出库失败',
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

  // 该函数根据当前时刻（年月日时分秒）自动生成出库订单号
  generateOno() {
    const type = '0'; // 订单第1位是标志位，1代表入库，0代表出库
    const now = new Date();  
    const year = now.getFullYear();  
    const month = String(now.getMonth() + 1).padStart(2, '0');  
    const day = String(now.getDate()).padStart(2, '0');  
    const hours = String(now.getHours()).padStart(2, '0');  
    const minutes = String(now.getMinutes()).padStart(2, '0');  
    const seconds = String(now.getSeconds()).padStart(2, '0');  
    const dateString = `${type}${year}${month}${day}${hours}${minutes}${seconds}`;  
    return `${dateString}`;  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时，根据日期自动生成出库订单号
    var value = this.generateOno()
    console.log("生成出库订单号->" + value);
    this.setData({
      ono: value,
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

  },
  copyText:function(e){
    console.log(e.currentTarget.dataset.name);
    wx.showToast({
      title: '复制成功',
    });
    wx.setClipboardData({
      data: e.currentTarget.dataset.name,
      success:function(res){
        wx.getClipboardData({
          success:function(res){
            console.log(res.data);
          }
        })
      }
    })
  },
})