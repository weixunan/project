// pages/userDetails/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ename: '',
    username: '',
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
      eno: options.eno,
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
          case 1:
            str_status = '在职';
            break;
          default:
            str_status = '离职';
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
          username: res.data.user_detailInfo[0].username,
        })
      },
      fail: function () {
        console.log("failed");
      }
    })
  },

  refreshUserInfo() {

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
    const that = this;
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'输入新的姓名',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          console.log(res.content)//用户输入的值
          const newValue = res.content;
          // 发送请求到后端，修改对应值
          wx.request({
            method: 'POST',
            url: 'http://172.29.15.95:3003/updateUserInfo',
            data:{
              request: "ename",
              eno: that.data.eno,
              newValue: newValue,
            },
            header: {
              'Content-Type': 'application/json',
            },
            fail: function(){
              console.log("请求失败");
            },
            success: function(res){
              console.log(res);
              that.setData({
                ename: newValue,
              })
              that.refreshUserInfo();
              wx.showToast({
                title: '修改成功',
                icon: 'success'
              });
            }
          })
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  editEno(e){
    const that = this;
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'输入新的工号',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          console.log(res.content)//用户输入的值
          const newValue = res.content;
          // 发送请求到后端，修改对应值
          wx.request({
            method: 'POST',
            url: 'http://172.29.15.95:3003/updateUserInfo',
            data:{
              request: "eno",
              eno: that.data.eno,
              newValue: newValue,
            },
            header: {
              'Content-Type': 'application/json',
            },
            fail: function(){
              console.log("请求失败");
            },
            success: function(res){
              console.log(res);
              that.setData({
                eno: newValue,
              })
            }
          })
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  editElevel(e){
    const that = this;
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'输入新的权限(1/2/3)',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          console.log(res.content)//用户输入的值
          const newValue = res.content;
          // 发送请求到后端，修改对应值
          wx.request({
            method: 'POST',
            url: 'http://172.29.15.95:3003/updateUserInfo',
            data:{
              request: "elevel",
              eno: that.data.eno,
              newValue: newValue,
            },
            header: {
              'Content-Type': 'application/json',
            },
            fail: function(){
              console.log("请求失败");
            },
            success: function(res){
              console.log(res);
              var str_elevel = '';
              if (newValue == 1) {
                str_elevel = '普通员工';
              } else if (newValue == 2) {
                str_elevel = '普通管理员';
              } else {
                str_elevel = '高级管理员';
              }
              that.setData({
                elevel: str_elevel,
              })
            }
          })
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  editUsername(e){
    const that = this;
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'输入新的用户名',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          console.log(res.content)//用户输入的值
          const newValue = res.content;
          // 发送请求到后端，修改对应值
          wx.request({
            method: 'POST',
            url: 'http://172.29.15.95:3003/updateUserInfo',
            data:{
              request: "username",
              eno: that.data.eno,
              newValue: newValue,
            },
            header: {
              'Content-Type': 'application/json',
            },
            fail: function(){
              console.log("请求失败");
            },
            success: function(res){
              console.log(res);
              that.setData({
                username: newValue,
              })
            }
          })
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  editPassword(e){
    const that = this;
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'输入新的密码',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          console.log(res.content)//用户输入的值
          const newValue = res.content;
          // 发送请求到后端，修改对应值
          wx.request({
            method: 'POST',
            url: 'http://172.29.15.95:3003/updateUserInfo',
            data:{
              request: "password",
              eno: that.data.eno,
              newValue: newValue,
            },
            header: {
              'Content-Type': 'application/json',
            },
            fail: function(){
              console.log("请求失败");
            },
            success: function(res){
              console.log(res);
              that.setData({
                password: newValue,
              })
            }
          })
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  },
  editStatus(e){
    const that = this;
    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'输入新的用户状态(1在职/0离职)',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          console.log(res.content)//用户输入的值
          const newValue = res.content;
          // 发送请求到后端，修改对应值
          wx.request({
            method: 'POST',
            url: 'http://172.29.15.95:3003/updateUserInfo',
            data:{
              request: "status",
              eno: that.data.eno,
              newValue: newValue,
            },
            header: {
              'Content-Type': 'application/json',
            },
            fail: function(){
              console.log("请求失败");
            },
            success: function(res){
              console.log(res);
              var str_status = '';
              if (newValue == 1) {
                str_status = '在职';
              } else {
                str_status = '离职';
              } 
              that.setData({
                status: str_status,
              })
            }
          })
        } else {
          console.log('用户点击了取消')
        }
      }
    })
  }
})