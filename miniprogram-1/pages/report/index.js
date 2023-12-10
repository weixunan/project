// pages/report/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beginDate:'2021-12-06',
    endDate:'2023-12-07',
  },

  // 下载仓库每日数据汇总Excel表
  downloadExcel_dayInfo(e) {
    console.log("下载excel");
    wx.downloadFile({
      url: 'http://172.29.15.95:3003/downloadExcel/dayInfo',
      success: function(res) {  
        if (res.statusCode === 200) {
          // 可以使用临时文件路径保存后端res发过来的文件，也可以指定路径  
          var filePath = res.tempFilePath; 
          // 文件下载成功后，使用wx.openDocument打开文件  
          wx.openDocument({  
            filePath: filePath,  
            success: function(res) {  
              console.log('打开文件成功');  
            }  
          })  
        } else {
          console.log("获取Excel文件失败");
        } 
      }  
    })
  },
  // 下载货库库存表Excel表
  downloadExcel_goodsInfo(e) {
    console.log("下载excel");
    wx.downloadFile({
      url: 'http://172.29.15.95:3003/downloadExcel/goodsInfo',
      success: function(res) {  
        if (res.statusCode === 200) {
          // 可以使用临时文件路径保存后端res发过来的文件，也可以指定路径  
          var filePath = res.tempFilePath; 
          // 文件下载成功后，使用wx.openDocument打开文件  
          wx.openDocument({  
            filePath: filePath,  
            success: function(res) {  
              console.log('打开文件成功');  
            }  
          })  
        } else {
          console.log("获取Excel文件失败");
        } 
      }  
    })
  },
  // 下载入库订单表Excel表
  downloadExcel_inputInfo(e) {
    console.log("下载excel");
    wx.downloadFile({
      url: 'http://172.29.15.95:3003/downloadExcel/inputInfo',
      success: function(res) {  
        if (res.statusCode === 200) {
          // 可以使用临时文件路径保存后端res发过来的文件，也可以指定路径  
          var filePath = res.tempFilePath; 
          // 文件下载成功后，使用wx.openDocument打开文件  
          wx.openDocument({  
            filePath: filePath,  
            success: function(res) {  
              console.log('打开文件成功');  
            }  
          })  
        } else {
          console.log("获取Excel文件失败");
        } 
      }  
    })
  },
  // 下载出库订单表Excel表
  downloadExcel_outputInfo(e) {
    console.log("下载excel");
    wx.downloadFile({
      url: 'http://172.29.15.95:3003/downloadExcel/outputInfo',
      success: function(res) {  
        if (res.statusCode === 200) {
          // 可以使用临时文件路径保存后端res发过来的文件，也可以指定路径  
          var filePath = res.tempFilePath; 
          // 文件下载成功后，使用wx.openDocument打开文件  
          wx.openDocument({  
            filePath: filePath,  
            success: function(res) {  
              console.log('打开文件成功');  
            }  
          })  
        } else {
          console.log("获取Excel文件失败");
        } 
      }  
    })
  },
  // 下载利润表Excel表
  downloadExcel_profitInfo(e) {
    console.log("下载excel");
    wx.downloadFile({
      url: 'http://172.29.15.95:3003/downloadExcel/profitInfo',
      success: function(res) {  
        if (res.statusCode === 200) {
          // 可以使用临时文件路径保存后端res发过来的文件，也可以指定路径  
          var filePath = res.tempFilePath; 
          // 文件下载成功后，使用wx.openDocument打开文件  
          wx.openDocument({  
            filePath: filePath,  
            success: function(res) {  
              console.log('打开文件成功');  
            }  
          })  
        } else {
          console.log("获取Excel文件失败");
        } 
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

  },
   //点击时间选择框的事件函数
   bindBeginDateChange:function(e){
    this.setData({
      beginDate:e.detail.value
    })
    console.log(this.data.beginDate);
  },
  bindEndDateChange:function(e){
    this.setData({
      endDate:e.detail.value
    })
    console.log(this.data.endDate);
  },
})