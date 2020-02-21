// pages/lcm/lcm.js
var app = getApp();
//const myaudio = wx.createInnerAudioContext();
var array_one = [];
Page({

  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    isPlay: false,
    se: 0,
    songer1: null,
    songerimg: null,
    mname1: null,
    num: 1,
    ar: [],
    jslist: null,
    page1: null,
    page: null,
    songer: null,
    mname: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/test_001/JDBCdemo2', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log(res.data);
        for (var i = 0; res.data.length > i; i++) {
          array_one[i] = res.data[i];
        }
        console.log(array_one);
        //myaudio.src = array_one[that.data.se].msrc;
        that.setData({
          songer1: res.data.songer,
          mname1: res.data.mname,
          ar: array_one,
          jslist: res.data,
          page1: res.data.page,
          songerimg: res.data.songerimg,
          page: array_one[that.data.se].page,
          mname: array_one[that.data.se].mname,
          songer: array_one[that.data.se].songer,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 滑动切换tab
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  // 点击tab切换
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  play: function () {
    console.log('9');
    app.playy();
    this.setData({ isplay: true });
  },
  stop: function () {
    console.log('6');
    this.setData({ isplay: false });
  },
  tzbf: function () {
    wx.navigateTo({
      url: '../../pages/localm/localm',
    })
  },
})