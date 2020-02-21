// pages/localMusic/localMusic.js
//var app = getApp();
const myaudio = wx.createInnerAudioContext();
var array_one = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    issort:true,
    isplay: false,
    jslist: null,
    ar: [],
    se: 0,
    audioSeek: 0,
    audioDuration: 0,
    showTime1: '00:00',
    showTime2: '00:00',
    audioTime: 0,
    songer: null,
    mname: null,
    actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: 'Menu1', txt: '歌曲1' },
      { bindtap: 'Menu2', txt: '歌曲2' },
      { bindtap: 'Menu3', txt: '歌曲3' }
    ],
    menu: '',
    islike: false,
    curT: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
        myaudio.src = array_one[that.data.se].msrc;
        that.setData({
          songer: array_one[that.data.se].songer,
          mname: array_one[that.data.se].mname,
          ar: array_one,
          jslist: res.data
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
    //卸载页面，清除计步器
    clearInterval(this.data.durationIntval);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.pback();
  },
  pback: function(){
    wx.navigateTo({
      url: '../../pages/lcm/lcm',
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.actionSheetTap()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 播放
  play: function () {
    console.log('u');
    myaudio.play(); 
    this.Initialization();
    this.loadaudio();
    this.setData({ isplay: true, songer: array_one[this.data.se].songer, mname:array_one[this.data.se].mname });
  },
  // 停止
  stop: function () {
    myaudio.pause();
    this.setData({ isplay: false, songer: array_one[this.data.se].songer, mname: array_one[this.data.se].mname });
  },
  //上一首
  back: function(){
    if(this.data.issort==true){
    if (this.data.se > 0) {
    var j = this.data.se;
    j--;
      this.setData({ se: j, isplay: true, songer: array_one[this.data.se].songer, mname: array_one[this.data.se].mname});
    console.log(this.data.se);
    console.log(this.data.isplay);
    myaudio.src = array_one[this.data.se].msrc;
    this.play();
    }}
    else{
      if (this.data.se < array_one.length) {
        var j = this.data.se;
        j++;
        this.setData({ se: j, isplay: true, songer: array_one[this.data.se].songer, mname: array_one[this.data.se].mname });
        console.log(this.data.se);
        console.log(this.data.isplay);
        myaudio.src = array_one[this.data.se].msrc;
        this.play();
      }
    }
  },
  //下一首
  next: function () {
    if (this.data.issort == true) {
    if(this.data.se<array_one.length){
    var j = this.data.se;
    j++;
      this.setData({ se: j, isplay: true, songer: array_one[this.data.se].songer, mname: array_one[this.data.se].mname });
    console.log(this.data.se);
    console.log(this.data.isplay);
    myaudio.src = array_one[this.data.se].msrc;
    this.play();
    }}
    else{
      if (this.data.se > 0) {
        var j = this.data.se;
        j--;
        this.setData({ se: j, isplay: true, songer: array_one[this.data.se].songer, mname: array_one[this.data.se].mname });
        console.log(this.data.se);
        console.log(this.data.isplay);
        myaudio.src = array_one[this.data.se].msrc;
        this.play();
      }
    }
    },

  //初始化播放器，获取duration
  Initialization() {
    var t = this;
    if (array_one[this.data.se].msrc.length != 0) {
      //设置src
      myaudio.src = array_one[this.data.se].msrc;
      myaudio.onCanplay(() => {
        //初始化duration
        myaudio.duration = 0;
        setTimeout(function () {
          //延时获取音频真正的duration
          var duration = myaudio.duration;
          var min = parseInt(duration / 60);
          var sec = parseInt(duration % 60);
          if (min.toString().length == 1) {
            min = `0${min}`;
          }
          if (sec.toString().length == 1) {
            sec = `0${sec}`;
          }
          t.setData({ audioDuration: myaudio.duration, showTime2: `${min}:${sec}` });
        }, 1000)
      })
    }
  },
  //拖动进度条事件
  sliderChange(e) {
    var that = this;
    myaudio.src = array_one[this.data.se].msrc;
    //获取进度条百分比
    var value = e.detail.value;
    this.setData({ audioTime: value });
    var duration = this.data.audioDuration;
    //根据进度条百分比及歌曲总时间，计算拖动位置的时间
    value = parseInt(value * duration / 100);
    //更改状态
    this.setData({ audioSeek: value, isplay: true });
    //调用seek方法跳转歌曲时间
    myaudio.seek(value);
    //播放歌曲
    myaudio.play();
  },

  loadaudio() {
    var that = this;
    //设置一个计步器
    this.data.durationIntval = setInterval(function () {
      //当歌曲在播放时执行
      if (that.data.isplay == true) {
        //获取歌曲的播放时间，进度百分比
        var seek = that.data.audioSeek;
        var duration = myaudio.duration;
        var time = that.data.audioTime;
        time = parseInt(100 * seek / duration);
        //当歌曲在播放时，每隔一秒歌曲播放时间+1，并计算分钟数与秒数
        var min = parseInt((seek + 1) / 60);
        var sec = parseInt((seek + 1) % 60);
        //填充字符串，使3:1这种呈现出 03：01 的样式
        if (min.toString().length == 1) {
          min = `0${min}`;
        }
        if (sec.toString().length == 1) {
          sec = `0${sec}`;
        }
        var min1 = parseInt(duration / 60);
        var sec1 = parseInt(duration % 60);
        if (min1.toString().length == 1) {
          min1 = `0${min1}`;
        }
        if (sec1.toString().length == 1) {
          sec1 = `0${sec1}`;
        }
        //当进度条完成，停止播放，并重设播放时间和进度条
        if (time >= 100) {
          myaudio.stop();
          that.setData({ audioSeek: 0, audioTime: 0, audioDuration: duration, isplay: false, showTime1: `00:00` });
          return false;
        }
        //正常播放，更改进度信息，更改播放时间信息
        that.setData({ audioSeek: seek + 1, audioTime: time, audioDuration: duration, showTime1: `${min}:${sec}`, showTime2: `${min1}:${sec1}` });
      }
    }, 1000);
  },
//播放顺序
  suiji:function(){
    this.setData({ issort: true });
  },

  notsj: function () {
    this.setData({ issort: false });
  },
//进度条
  bindchange: function (e) {
    console.log(e.detail);
  },
  //上拉菜单
  actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenu1: function () {
    this.setData({
      menu: 1,
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenu2: function () {
    this.setData({
      menu: 2,
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenu3: function () {
    this.setData({
      menu: 3,
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  //swiper 点击跳转
  swichSwi: function(e){
    var that = this;
    if(this.data.carT == e.target.dataset.current){
      return false;
    }else{
      that.setData({
        curT: e.target.dataset.current
      })
    }
  },
  //弹出窗 暂未开通
  showicon: function () {
    wx.showToast({
      title: '本地无需下载',
      icon: 'loading',
      duration: 2000
    })
  },
  //下载点击
  waitT: function(){
    this.showicon()
  },
})