// pages/operRecords/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beginDate:'2021-12-06',
    endDate:'2023-12-07',
    inFontColor:'#000000',
    outFontColor:'#000000',
    chFontColor:'#000000',
    Records:[],
    currentPage:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getRecords();
  },
  getRecords(){
    console.log(this.data.beginDate);
    console.log(this.data.endDate);
    wx.request({
      url: 'http://172.29.15.95:3003/getRecords',
      method: 'GET',
      data:{
          vbeginDate:this.data.beginDate,
          vendDate:this.data.endDate,
          vcurrentPage:this.data.currentPage,
      },
      success: (res) => {
        const { data } = res;
        // 将获取到的预警信息更新到页面数据中
        this.setData({
          Records: data,
        });
      },
      fail: (error) => {
        console.error('Failed to fetch InputRecords:', error);
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

  },

  
  //点击时间选择框的事件函数
  bindBeginDateChange:function(e){
    this.setData({
      beginDate:e.detail.value
    })
    console.log(this.data.beginDate);
    this.getRecords();
  },
  bindEndDateChange:function(e){
    this.setData({
      endDate:e.detail.value
    })
    console.log(this.data.endDate);
    this.getRecords();
  },
  //出库、入库、移库三个选项的事件
  inputRecords:function(e){
    console.log("change color");
    this.resetFontColors();
    this.setData({
      inFontColor:'#4095e5'
    });
  },
  outputRecords:function(e){
    console.log("change color");
    this.resetFontColors();
    this.setData({
      outFontColor:'#4095e5'
    })
  },
  changePage:function(e){
    // this.resetFontColors();
    const Page=parseInt(e.currentTarget.dataset.text);
    this.setData({
      currentPage:Page,
    })
    console.log(this.data.currentPage);
    this.getRecords();
    
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