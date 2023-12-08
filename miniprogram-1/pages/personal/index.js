// pages/personal/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eno: '',
    ename: '',
    elevel: '',
    edin: 0, //该员工今日操作的入库数量
    edout: 0, //今日操作的出库数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时，显示当前登录的员工名字和编号
    var app = getApp();
    this.setData({
      eno: app.globalData.eno,
      ename: app.globalData.ename,
      elevel: app.globalData.elevel,
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
    // 发送请求得到该员工今日操作入库的数量
    const that = this;
    wx.request({
      method: 'POST',
      // 调试的时候改为自己的ip
      url: 'http://172.29.15.95:3003/personal',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        eno: this.data.eno,
        otype: 1,
      },
      success: function (res) {
        console.log("success->" + res.data.success); 
        if (res.data.success) {            
          console.log("该员工今日入库信息获取成功");
          that.setData({
            edin: res.data.edin,
          });
        } else {
          // 失败
          wx.showToast({
            title: '获取失败',
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
    });
    // 发送请求得到该员工今日操作出库的数量
    wx.request({
      method: 'POST',
      // 调试的时候改为自己的ip
      url: 'http://172.29.15.95:3003/personal',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        eno: this.data.eno,
        otype: 0,
      },
      success: function (res) {
        console.log("success->" + res.data.success); 
        if (res.data.success) {            
          console.log("该员工今日出库信息获取成功");
          that.setData({
            edout: res.data.edin,
          });
        } else {
          // 失败
          wx.showToast({
            title: '获取失败',
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
    });
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
    //let users = wx.getStorageSync('user');
    if (res.from === 'button') {
    }
    return {
      title: '1',
      path: '/pages/login/index',
      success: function(res) {
        console.log(res);
      }
    }
  },
  goTo:function(e){
    var goUrl='/pages/'+e.currentTarget.dataset.name+'/index?mode='+e.currentTarget.dataset.mode;
    wx.navigateTo({
      url: goUrl,
    })
  }
})