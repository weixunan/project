// pages/question/index.js
Page({

  /**
   * 页面的初始数据
   */
   data: {
        data: [
          { id: 1, question: "Q：库存管理系统能够免费使用吗?", answer: "A：库存管理系统小程序可以免费首先使用，目前功能都是免费使用，开发者不收取任何费用，若您觉得小程序对您的工作有帮助，可以分享给您身边需要使用的朋友噢~", showAnswer: false },
          { id: 2, question: "Q：如何升级为专业版?", answer: "A:点击个人页面，再点击联系客服添加客服微信下载专业版噢~", showAnswer: false },
          { id: 3, question: "Q：免费版和专业版有什么区别？", answer: "A：【免费版】注册后所使用的功能完全免费，【专业版】支持PC端，包含一个管理员账号和五个员工账号进行协同管理，可以使用账号密码登录。", showAnswer: false },
      { id: 4, question: "Q：如果手机丢了，电脑中毒了，数据会不会丢失？", answer: "A：不会，我们的小程序使用云端存储数据，用户手机丢了或者电脑中毒了不会影响用户数据，数据安全有保障。", showAnswer: false },

      { id: 5, question: "Q：可以定制开发软件吗", answer: "A：可以通过点击个人中心中的“关于我们”添加我们的微信，提出定制开发的需求，需要合作可联系。", showAnswer: false },
        ]
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
    toggleAnswer(e) {
        const id = e.currentTarget.dataset.id;
        const data = this.data.data.map(item => {
          if (item.id === id) {
            return {
              ...item,
              showAnswer: !item.showAnswer
            };
          }
          return item;
        });
        this.setData({
          data: data
        });
      }
})