// pages/basicData/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beginDate:'2023-12-06',
    endDate:'2023-12-07',
    din: 0,
    dout: 0,
    snum: 0,
    warn_num: 0,
    total_cost: 0,
    total_din: 0,
    total_dout: 0,
    total_income: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(2);
    const thispage = this;
    wx.request({
      method: 'POST',
      url: 'http://172.29.15.95:3003/basicData',
      data:{
        request: "getBasicMessageByTime",
        beginDate: thispage.data.beginDate,
        endDate: thispage.data.endDate,
      },
      header: {
        'Content-Type': 'application/json',
      },

      fail: function(){
        console.log("failed to get message between "+thispage.data.beginDate+" and "+thispage.data.endDate);
      },

      success: function(res){
        console.log(res);
        //result = res.data.day_info[0];
        thispage.setData({
          total_cost: res.data.day_info[0].total_cost,
          total_din: res.data.day_info[0].total_din,
          total_dout: res.data.day_info[0].total_dout,
          total_income: res.data.day_info[0].total_income,
        })
      }
    });

    wx.request({
      //使用POST方法发送请求给server.js
      method: 'POST',
      // 调试的时候改为自己的ip
      url: 'http://172.29.15.95:3003/basicData',
      //此处暂时还不需要传输数据给server.js
      data: {
        request: "getBasicMessage",
      },
      header: {
        'Content-Type': 'application/json',
      },
      //res为当连接成功时server.js传输的变量，这里具体为出库dout、入库din、仓库总量snum以及预警数量warn_num
      success: function(res){
        console.log(res);
        //访问res中的变量方式如下
        console.log(res.data.day_info[0].dout);
        thispage.setData({
          dout: res.data.day_info[0].dout,
          din: res.data.day_info[0].din,
          snum: res.data.snum[0].snum,
          warn_num: res.data.day_info[0].warn_num,
        })
      },
      //连接失败，输出错误信息
      fail: function(){
        console.log("failed");
      }

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
  //TODO
  //选中时间的时候触发的事件
  bindBeginDateChange:function(e){
    this.setData({
      beginDate:e.detail.value
    })
    console.log(this.data.beginDate);
    console.log(2);
    const thispage = this;
    wx.request({
      method: 'POST',
      url: 'http://172.29.15.95:3003/basicData',
      data:{
        request: "getBasicMessageByTime",
        beginDate: thispage.data.beginDate,
        endDate: thispage.data.endDate,
      },
      header: {
        'Content-Type': 'application/json',
      },

      fail: function(){
        console.log("failed to get message between "+thispage.data.beginDate+" and "+thispage.data.endDate);
      },

      success: function(res){
        console.log(res);
        //result = res.data.day_info[0];
        thispage.setData({
          total_cost: res.data.day_info[0].total_cost,
          total_din: res.data.day_info[0].total_din,
          total_dout: res.data.day_info[0].total_dout,
          total_income: res.data.day_info[0].total_income,
        })
      }
    })
  },
  bindEndDateChange:function(e){
    this.setData({
      endDate:e.detail.value
    })
    console.log(this.data.endDate);
    console.log(2);
    const thispage = this;
    wx.request({
      method: 'POST',
      url: 'http://172.29.15.95:3003/basicData',
      data:{
        request: "getBasicMessageByTime",
        beginDate: thispage.data.beginDate,
        endDate: thispage.data.endDate,
      },
      header: {
        'Content-Type': 'application/json',
      },

      fail: function(){
        console.log("failed to get message between "+thispage.data.beginDate+" and "+thispage.data.endDate);
      },

      success: function(res){
        console.log(res);
        //result = res.data.day_info[0];
        thispage.setData({
          total_cost: res.data.day_info[0].total_cost,
          total_din: res.data.day_info[0].total_din,
          total_dout: res.data.day_info[0].total_dout,
          total_income: res.data.day_info[0].total_income,
        })
      }
    })
  }
})