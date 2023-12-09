// pages/in/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ono: '',  // 订单号，会根据当前时刻自动生成
    gpicture: '../assets/plus.png',  // 图片路径
  },

  // 添加图片的按钮事件
  addImage: function() {
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        // 返回本地文件路径列表  
        var imagePath = res.tempFiles[0].tempFilePath;  
        that.uploadImage(imagePath); // 上传图片  
      }
    })
  },
  // 上传图片
  uploadImage: function(path) {
    const that = this;
    console.log("图片path->" + path);
    that.setData({
      gpicture: path,
    })
    /*wx.uploadFile({
      filePath: 'path',
      // 文件对应的 key
      name: 'file',
      // 后端接受图片文件上传的接口地址，改为自己的IP地址
      url: 'http://192.168.137.211:3003/uploadImage',  
    })*/
  },


  // form表单的submit事件
  formSubmit(e) {
    const json = e.detail.value;
    console.log("入库表单submit的JSON对象字符串->" + JSON.stringify(json));
    // console.log("入库表单gno->" + json['gno']);
    wx.request({
      method: 'POST',
      // 调试的时候改为自己的ip
      url: 'http://172.29.15.187:3003/input',
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

  // 该函数根据当前时刻（年月日时分秒）自动生成订单号
  generateOno() {
    const type = '1'; // 订单第1位是标志位，1代表入库，0代表出库
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
    // 页面加载时，根据日期自动生成订单号
    var value = this.generateOno()
    console.log("生成订单号->" + value);
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