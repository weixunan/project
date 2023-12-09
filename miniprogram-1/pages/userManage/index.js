// pages/userManage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [null, null, null],
    userMessages:[],
    showModalStatus:false,
    originalUserMessages:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserMessages();
  },
  getUsersByNumOrName: function(e) {
    const input = e.detail.value; // 获取用户输入的编号
    const userMessages = this.data.originalUserMessages; // 使用原始数据进行过滤
    const filteredUserMessages = userMessages.filter(item => (
      item.eno.startsWith(input) || item.ename.startsWith(input)
    )); // 根据编号前缀过滤数据
    if (input === '') {
      this.setData({
        userMessages: this.data.originalUserMessages, // 如果输入为空，则显示原始数据
      });
    } else {
      this.setData({
        userMessages: filteredUserMessages, // 更新页面数据显示过滤后的结果
      });
    }
  },
  getUserMessages() {
    // 假设有一个获取商品预警信息的后台接口，返回一个包含预警信息的数据
    // 你需要根据你的实际情况调用后台接口
    // 这里用一个假数据代替
    wx.request({
      url: 'http://172.29.15.187:3003/getUserMessages',
      method: 'GET',
      success: (res) => {
        const { data } = res;
        // 将获取到的预警信息更新到页面数据中
        this.setData({
          userMessages: data,
          originalUserMessages: data,
        });
      },
      fail: (error) => {
        console.error('Failed to fetch user messages:', error);
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
  // 触发或者关闭弹窗
 powerDrawer:function(e){
    var currentStatus=e.currentTarget.dataset.statu;
    this.util(currentStatus);
  },
  //渲染显示弹窗
  util: function(currentStatu){  
    /* 动画部分 */  
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({  
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });  
      
    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;  
  
    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();  
  
    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({  
      animationData: animation.export()  
    })  
      
    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {  
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();  
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({  
        animationData: animation  
      })  
        
      //关闭  
      if (currentStatu == "close") {  
        this.setData(  
          {  
            showModalStatus: false  
          }  
        );  
      }  
    }.bind(this), 200)  
    
    // 显示  
    if (currentStatu == "open") {  
      this.setData(  
        {  
          showModalStatus: true  
        }  
      );  
    }  
  } ,
  //表单提交函数 在这里发送请求，提交表单的方法可以参考input
  formSubmit(e){
    console.log('添加用户');
    const that = this;
    const json = e.detail.value;
    console.log("添加用户submit的JSON对象字符串->" + JSON.stringify(json));
    wx.request({
      method: 'POST',
      // 调试的时候改为自己的ip
      url: 'http://172.29.15.187:3003/addUser',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        json: json,
      },
      success: function (res) {
        console.log("success->" + res.data.success); 
        if (res.data.success) {            
          console.log("添加成功");
          // 刷新页面
          that.getUserMessages();
          wx.showToast({
            title: '添加成功',
            icon: 'success'
          });
        } else {
          // 入库失败
          wx.showToast({
            title: '添加失败',
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

  gotoDetail:function(e){
    var eno=e.currentTarget.dataset.eno;
    console.log(eno);
    wx.navigateTo({
      url: '../userDetails/index?eno='+eno
    })
  }
})