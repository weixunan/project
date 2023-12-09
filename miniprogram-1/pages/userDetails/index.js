// pages/userDetails/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ename: '',
    sex: '男',
    eno: '',
    elevel: '',
    password: '',
    status: '',
    create_date: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      eno: options.eno
    });
    //console.log(this.data.eno);
    const thisfun = this;
    wx.request({
      method: 'POST',
      url: 'http://172.29.15.95:3003/getUserDetails',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        eno: thisfun.data.eno,
      },
      success: function (res) {
        console.log(res);

        var str_elevel = '';
        var elevel = res.data.user_detailInfo[0]['elevel'];
        switch (elevel) {
          case 1:
            str_elevel = '普通员工';
            break;
          case 2:
            str_elevel = '普通管理员';
            break;
          case 3:
            str_elevel = '高级管理员';
            break;
        }

        var str_status = '';
        var status = res.data.user_detailInfo[0]['status'];
        switch (status) {
          case 0:
            str_status = '正常';
            break;
          default:
            str_status = '异常';
            break;
        }

        var originalDate = new Date(res.data.user_detailInfo[0]['create_date']);
        var formattedDate = originalDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');

        thisfun.setData({
          ename: res.data.user_detailInfo[0].ename,
          elevel: str_elevel,
          password: res.data.user_detailInfo[0].password,
          status: str_status,
          create_date: formattedDate,
        })
      },
      fail: function () {
        console.log("failed");
      }
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
  
  // 输入修改后的信息并且提交
  editEname(e){
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'输入新的姓名',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          console.log(res.content)//用户输入的值
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  editEno(e){
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'输入新的工号',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          console.log(res.content)//用户输入的值
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  editElevel(e){
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'输入新的权限',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          console.log(res.content)//用户输入的值
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  editPassword(e){
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'输入新的密码',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          console.log(res.content)//用户输入的值
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  editStatus(e){
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'输入新的用户状态',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          console.log(res.content)//用户输入的值
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  }
})