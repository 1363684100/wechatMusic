const app = getApp();
Page({
  data: {
    dirData:'',
    imgUr:'',
    starData:'',
    phData_List:'',
    img_one: '../images/one.png',
    img_two: '../images/two.png',
    img_three:'../images/three.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    if(options.id.length == 10) {
      //  推荐
      wx.request({
        url: 'http://ustbhuangyi.com/music/api/getCdInfo?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&disstid=' + options.id + '&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0',
        method: "GET",
        data: {},
        success(res) {
          if (res.data.code == 0) {
            that.setData({
              dirData: res.data.cdlist[0],
            })
          }
        }
      })
    } else if (options.id.length == 14){
      // 歌手
      wx.request({
        url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=80&songstatus=1&singermid=' + options.id,
        method: "GET",
        success(res) {
          that.setData({
            starData: res.data.data,
            imgUrl: 'https://y.gtimg.cn/music/photo_new/T001R300x300M000' + res.data.data.singer_mid + '.jpg?max_age=2592000'
          })
        }
      })
    } else if (typeof Number(options.id) == "number"){
      wx.request({
        url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&topid=' + options.id + '&needNewCode=1&uin=0&tpl=3&page=detail&type=top&platform=h5',
        success(res) {
          that.setData({
            phData_List:res.data
          })
        }
      })
    }
  },
  // 路由传参到某个界面
  playList({currentTarget:{dataset:val}}){
    // 传值
    app.globalData.musicLink = val.musicsrc;
    app.globalData.musicImg = val.imgsrc;
    app.globalData.musicName = val.musicname;
    app.globalData.musicZz = val.ahtor;
    // 库存
    app.globalData.playArrs.push({
      musicLink: val.musicsrc,
      musicImg: val.imgsrc,
      musicName: val.musicname,
      musicZz: val.ahtor,
    })
    wx.switchTab({
      url: '../play/play'
    })
  },
  musicGS({ currentTarget: { dataset: val } }){
    // 传值
    app.globalData.musicLink = val.musicsrc;
    app.globalData.musicImg = val.imgsrc;
    app.globalData.musicName = val.musicname;
    app.globalData.musicZz = val.ahtor;

    // 库存
    app.globalData.playArrs.push({
      musicLink: val.musicsrc,
      musicImg: val.imgsrc,
      musicName: val.musicname,
      musicZz: val.ahtor,
    })

    wx.switchTab({
      url: '../play/play'
    })
  },

  musicTJ({ currentTarget: { dataset: val } }){
    // 传值
    app.globalData.musicLink = val.musicsrc;
    app.globalData.musicImg = val.imgsrc;
    app.globalData.musicName = val.musicname;
    app.globalData.musicZz = val.ahtor;
    
    // 库存
    app.globalData.playArrs.push({
      musicLink: val.musicsrc,
      musicImg: val.imgsrc,
      musicName: val.musicname,
      musicZz: val.ahtor,
    })

    wx.switchTab({
      url: '../play/play'
    })
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
  
  }
})
