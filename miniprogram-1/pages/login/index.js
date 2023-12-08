// pages/Output/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'1234',   // 用户名
    password:'123',    // 密码
    isRemember: false, // 是否记住密码
    status: 0,         // 该用户的登录状态
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
    // 页面加载时，判断用户是否选择了记住密码选项，如果是则自动填充用户名和密码
    // 获取本地保存的记住密码选项
    console.log("show->" + wx.getStorageSync('username'));
    console.log("show->" + wx.getStorageSync('password'));
    console.log("show->" + wx.getStorageSync('isRemember'));
    const isRemember = wx.getStorageSync('isRemember');
    // 如果用户选择了记住密码，则填充用户名和密码
    if (isRemember) {
      this.setData({
        username: wx.getStorageSync('username'),
        password: wx.getStorageSync('password'),
        isRemember: true,
      })
    } else {
      this.setData({
        username: wx.getStorageSync('username'),
        password: '',
        isRemember: false,
      })
    }
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
  // 得到输入框中的用户名和密码
  getUsername: function (e) {
    var value=e.detail.value;
    this.setData({
      username:value,
    })
    wx.setStorageSync('username', value);
  },
  getPassword: function(e){
    var value=e.detail.value;
    this.setData({
      password:value,
    })
    wx.setStorageSync('password', value);
  },
    // 记住密码的选项勾选发生变化时的处理
  changeRemember: function(e) {
    var value = e.detail.value;
    var flag = false;
    // 用户勾选了记住密码
    if (value.indexOf("cb1") !== -1) {
      flag = true;
    } 
    this.setData({
      isRemember: flag,
    })
    console.log("change记住密码->" + flag);
    wx.setStorageSync('isRemember', flag);
  },
  // 需要在这个函数中与后端交互，验证数据库中是否有这个用户，
  // 得到用户信息，设置一个全局变量，标记已经登录 
  doLogin: function(e) {
    // 验证用户名和密码不能为空
    // 不需要用到数据库的简单业务逻辑可以在本地直接处理
    if (!this.data.username || !this.data.password) {
      wx.showToast({
        title: '不能为空',
        icon: 'error'
      });
      return;
    }
    // 查看是否选择记住密码
    if (this.data.isRemember) {
      // 将用户名和密码保存在本地缓存中，便于下次自动填入
      wx.setStorageSync('username', this.data.username);
      wx.setStorageSync('password', this.data.password);
      wx.setStorageSync('isRemember', true);
    } else {
      // 没有选择记住密码，则要清除本地的用户名和密码
      // wx.removeStorageSync('username');
      wx.removeStorageSync('password');
      wx.setStorageSync('isRemember', false);
    }
    // 如果要在request中用到页面对象Page的data或者函数，在进入request前要保存this，否则request里面的this不是指向Page对象，this.setData时会出错（这是我遇到的问题，仅作参考）
    const that = this;
    // 发送请求到服务器验证用户名是否已存在
    wx.request({
      // POST请求
      method: 'POST',
      // url路由，也就是后端接口所在的位置
      // 调试时可在自己电脑的server文件夹启动nodejs本地服务器，将请求发到自己电脑的IP地址，可在本地的终端查看console.log的输出信息，便于调试
      // 例如，我的电脑IP地址是172.26.95.40，server文件夹配置了nodejs本地服务器，运行了node server.js后，就可以将请求发到172.26.95.40:3003/login
      // /login是我们在后端自定义的接口/login，类似的在后端还可以自定义其他接口，如/search等
      url: 'http://172.29.15.95:3003/login',
      // POST请求需要header，GET请求则可有可无
      header: {
        'Content-Type': 'application/json',
      },
      // 发送给后端服务器的数据username和password
      // 如果要给后端传数据，一定要用POST请求不要用GET请求
      data: {
        username: this.data.username,
        password: this.data.password,
      },
      // 发送请求后，分为success和fail两种情况，各写一个处理函数
      // success: 请求服务器成功
      success: function (res) {
      // 返回的数据在res中，后端定义了两个返回给前端的变量：
      // 1. res.data.success表示用户是否存在
      // 2. res.data.status表示登录状态，如果用户登录成功则返回1，否则返回0
        console.log(res.data.success+" "+res.data.status); // 这是输出到本地控制台的信息，无关紧要
        if (res.data.success) {
          // 登录成功，则更新登录状态，然后跳转到功能台主界面
          // 这是我上面提到的，如果使用this.setData会出错
          that.setData({
            status: 1,
          })
          console.log("登录状态->" + that.data.status);
          console.log("记住密码->" + that.data.isRemember);
          // 登录成功后，获取用户数据，更新全局变量的值
          var app = getApp();
          app.globalData.eno = res.data.userData[0];
          app.globalData.ename = res.data.userData[1];
          app.globalData.elevel = res.data.userData[2];
          console.log("用户信息->" + app.globalData.eno + "," + app.globalData.ename + "," + app.globalData.elevel);
          // 进入tabBar页面需要用switchTab，不支持返回
          wx.switchTab({
            url: '/pages/home/index',
          })
          // 进入非tabBar页面可用，支持返回上一个页面
          // wx.navigateTo({
          //   url: '/pages/input/index',
          // })
        } else {
          // 数据库不存在这个用户，登录失败
          that.setData({
            status: 0,
          })
          wx.showToast({
            title: '输入有误',
            icon: 'error'
          });
        }
      },
      // fail: 向后端服务器请求失败，注意是请求失败，不代表用户名和密码有误
      fail: function() {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
      }
    });
    this.setData({username: '', password: ''});
  }
})