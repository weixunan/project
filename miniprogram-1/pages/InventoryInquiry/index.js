// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gno: '123',
    originalInventoryMessages: [], // 保存原始的InventoryMessages数据
    InventoryMessages: [],
    /* currentType:'全部种类', */
    InventoryType: [],
    TextColor: [],
    allTextColor: '#000000',
    searchnum: 0,
    sorted: [],
    buffer: [],
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
      sorticon: !this.data.sorticon
    });
    // this.setData({
    //   buffer: this.data.InventoryMessages,
    //   sorticon: !this.data.sorticon
    // })
    // this.setData({
    //   InventoryMessages: this.data.sorted
    // })
    // this.setData({
    //   sorted: this.data.buffer
    // })
  },

  // 新增方法，根据输入的编号查询对应项
  // 新增方法，根据输入的编号查询对应项
  searchByGno: function (e) {
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

  setSearchNum: function (e) {
    this.setData({
      searchnum: e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInventoryMessages();
    this.getInventoryType();
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
  //复制按钮
  copyText: function (e) {
    console.log(e.currentTarget.dataset.name);
    wx.showToast({
      title: '复制成功',
    });
    wx.setClipboardData({
      data: e.currentTarget.dataset.name,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data);
          }
        })
      }
    })
  },
  getInventoryType() {
    wx.request({
      url: 'http://172.29.15.95:3003/getInventoryType',
      method: 'GET',
      success: (res) => {
        const {
          data
        } = res;
        // 将获取到的预警信息更新到页面数据中
        this.setData({
          InventoryType: data,
        });
      },
      fail: (error) => {
        console.error('Failed to fetch InventoryType:', error);
        // 处理请求失败的情况，比如弹窗提示用户网络错误
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none',
          duration: 2000
        });
      },
    });
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
    // this.data.TextColor[0]='#4095e5'
    var tempColor = [];
    for (let i = 0; i < this.data.InventoryType.length; i++) {
      tempColor[i] = '#00000099';
    }
    this.setData({
      TextColor: tempColor,
      allTextColor: '#4095e5'
    })
  },
  getInventoryMessagesByType(currentType) {
    console.log(currentType);
    wx.request({
      url: "http://172.29.15.95:3003/getInventoryMessagesByType?type='食品'",
      method: 'GET',
      data: {
        type: currentType,
      },
      success: (res) => {
        const {
          data
        } = res;
        // 将获取到的预警信息更新到页面数据中
        this.setData({
          InventoryMessages: data,

        });
      },
      fail: (error) => {
        console.error('Failed to fetch InventoryMessagesByType', error);
        // 处理请求失败的情况，比如弹窗提示用户网络错误
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none',
          duration: 2000
        });
      },
    });
  },
  changeData: function (event) {
    const buttonText = event.currentTarget.dataset.text;
    const index = parseInt(event.currentTarget.dataset.index);
    var tempColor = [];
    for (let i = 0; i < this.data.InventoryType.length; i++) {
      tempColor[i] = '#00000099';
    }
    tempColor[index] = "#4095e5";
    // this.data.TextColor[index]="#4095e5";
    this.setData({
      TextColor: tempColor,
      allTextColor: '#00000099'
    })
    // console.log(this.data.TextColor);
    console.log(buttonText);
    // 修改 currentType 中的值
    /* this.setData({
      currentType: buttonText,
    });
    console.log(currentType); */
    this.getInventoryMessagesByType(buttonText);
  },

})