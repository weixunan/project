// pages/setBaseline/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    InventoryMessages: [],
    originalInventoryMessages: [],
    showModalStatus: false,
    curGno: '',
    buffer: [],
    sorted: [],
    sorticon: true,
  },

  sortByNum: function (e) {
    const thisfun = this;
    var sorted = Array.from(thisfun.data.InventoryMessages);
    sorted.sort((a, b) => a.gno - b.gno); // 根据gno从大到小排序
    //console.log(this.data.Records);
    //console.log(sorted_records);
    thisfun.setData({
      sorted: sorted, // 将排序后的结果更新到页面数据中
      sorticon:!this.data.sorticon
    });
    
  },
  // 增加返回上一页面的回调函数，返回home页面时能更新加载预警信息数量
  /*wx.navigateBack({

  }),*/
  searchByGnoOrGname: function (e) {
    const input = e.detail.value; // 获取用户输入的编号
    const inventoryMessages = this.data.originalInventoryMessages; // 使用原始数据进行过滤
    const filteredMessages = inventoryMessages.filter(item => (
      item.gno.startsWith(input) || item.gname.startsWith(input)
    )); // 根据编号前缀过滤数据
    if (input === '') {
      this.setData({
        InventoryMessages: this.data.originalInventoryMessages, // 如果输入为空，则显示原始数据
      });
    } else {
      this.setData({
        InventoryMessages: filteredMessages, // 更新页面数据显示过滤后的结果
      });
    }
  },

  //表单提交函数 在这里发送请求，设置货物的基准信息
  formSubmit(e) {
    console.log('设置基准信息');
    const that = this;
    const json = e.detail.value;
    console.log("设置基准信息submit的JSON对象字符串->" + JSON.stringify(json));
    wx.request({
      method: 'POST',
      // 调试的时候改为自己的ip
      url: 'http://172.29.15.95:3003/setBaseline',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        json: json,
      },
      success: function (res) {
        console.log("success->" + res.data.success);
        if (res.data.success) {
          console.log("设置成功");
          // 更新home页面的数据
          wx.showToast({
            title: '设置成功',
            icon: 'success'
          });
        } else {
          // 入库失败
          wx.showToast({
            title: '设置失败',
            icon: 'error'
          });
        }
      },
      // fail: 向后端服务器请求失败，注意是请求失败，不代表数据有误
      fail: function () {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInventoryMessages();
  },
  getInventoryMessages() {
    var thisfun = this;
    wx.request({
      url: 'http://172.29.15.95:3003/getInventoryMessages',
      method: 'GET',
      success: (res) => {
        const {
          data
        } = res;
        // 将获取到的预警信息更新到页面数据中
        this.setData({
          InventoryMessages: data,
          originalInventoryMessages: data,
          sorted: data,
        });
        var sorted = Array.from(thisfun.data.sorted);
        sorted.sort((a, b) => a.gno - b.gno); // 根据gno从大到小排序
        //console.log(this.data.Records);
        //console.log(sorted_records);
        thisfun.setData({
          sorted: sorted, // 将排序后的结果更新到页面数据中
        });
      },
      fail: (error) => {
        console.error('Failed to fetch InventoryMessages:', error);
        // 处理请求失败的情况，比如弹窗提示用户网络错误
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none',
          duration: 2000
        });
      },
    });
  },

  // 触发或者关闭弹窗
  powerDrawer: function (e) {
    var gno = e.currentTarget.dataset.gno;
    this.setData({
      curGno: gno,
    })
    var currentStatus = e.currentTarget.dataset.statu;
    this.util(currentStatus);
  },
  //渲染显示弹窗
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200, //动画时长  
      timingFunction: "linear", //线性  
      delay: 0 //0则不延迟  
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
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
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

  }
})