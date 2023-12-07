// pages/operRecords/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beginDate:'2023-12-06',
    endDate:'2023-12-07',
    inFontColor:'#000000',
    outFontColor:'#000000',
    chFontColor:'#000000',
    mode:'all'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //判断进来时是想要三种中的哪种记录
    this.setData({
      mode:options.mode
    });
    console.log(this.data.mode);
    if(this.data.mode=='in')
    {
      this.inputRecords();
    }
    else if(this.data.mode=='out')
    {
      this.outputRecords();
    }
    else if(this.data.mode=='change')
    {
      this.changeRecords();
    }
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
  //出库、入库、移库三个选项的事件
  inputRecords:function(e){
    this.resetFontColors();
    this.setData({
      inFontColor:'#4095e5'
    });
  },
  outputRecords:function(e){
    this.resetFontColors();
    this.setData({
      outFontColor:'#4095e5'
    })
  },
  changeRecords:function(e){
    this.resetFontColors();
    this.setData({
      chFontColor:'#4095e5'
    })
  },
  //重置颜色 用于体现选项效果
  resetFontColors:function(e){
    this.setData({
      inFontColor:'#000000',
      outFontColor:'#000000',
      chFontColor:'#000000'
    })
  }

})