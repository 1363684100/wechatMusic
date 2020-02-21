const app = getApp();
var index = 0;
var timer = null
Page({
  data: {
    playLists: true,
    starLists: true,
    musicTitle: "GODLIKE MUSIC",
    author: "暂时还没有播放的音乐",
    musicImg: "",
    musicSrc: '',
    alertTitle: "收藏成功",
    durations: "00:00",
    currentTime: "00:00",
    scrollLine: 0,
    getLineWidth: 0,
  },
  onShow() {
    wx.setNavigationBarTitle({
      title: '播放'
    })
    if (app.globalData.musicLink) {
      this.MusicDatas(app.globalData.musicName, app.globalData.musicImg, app.globalData.musicZz, app.globalData.musicLink)
      this.setData({ playLists: false })
    } else {
      return false
    }

    // 获取进度条的宽度
    let query = wx.createSelectorQuery();
    var that = this;
    query.select('.line').boundingClientRect(function (rect) {
      that.setData({
        getLineWidth: rect.width
      })
    }).exec();

  },

  // 播放器函数
  MusicDatas(name,imgUrl,epname,src){
    this.setData({
      musicTitle: name,
      author: epname,
      // 专辑封面
      musicImg: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + imgUrl + '.jpg'
    })

    let music = wx.getBackgroundAudioManager()
    console.log(src);
    music.title = name //name
    music.coverImgUrl = 'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + imgUrl + '.jpg',  //imgUrl
    music.epname = epname, // epname

    wx.request({
      url: `https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&data=%7B%22req_0%22%3A%7B%22module%22%3A%22vkey.GetVkeyServer%22%2C%22method%22%3A%22CgiGetVkey%22%2C%22param%22%3A%7B%22guid%22%3A%22358840384%22%2C%22songmid%22%3A%5B%22${app.globalData.musicLink}%22%5D%2C%22songtype%22%3A%5B0%5D%2C%22uin%22%3A%221443481947%22%2C%22loginflag%22%3A1%2C%22platform%22%3A%2220%22%7D%7D%2C%22comm%22%3A%7B%22uin%22%3A%2218585073516%22%2C%22format%22%3A%22json%22%2C%22ct%22%3A24%2C%22cv%22%3A0%7D%7D`,
      method: "GET",
      success(res) {
        let music = wx.getBackgroundAudioManager()
        music.src = `http://dl.stream.qqmusic.qq.com/${res.data.req_0.data.midurlinfo[0].purl}`
      }
    })
      music.play()
    this.setData({ playLists: false })


    music.onEnded(e => {
      console.log('播放结束，进行下一步操作')
      
      if (app.globalData.playArrs.length > 1){
        this.setData({ playLists: false })
        this.nextMusic()
      }else{
        this.setData({ playLists: true })
        wx.showToast({
          title: '请添加其他音乐',
          duration: 1000
        })
      }
    })

    music.onStop(e => {
      console.log('停止')
      this.setData({ playLists: true })
      music.stop();
    })

    music.onPause(e => {
      console.log('暂停')
      this.setData({ playLists: true })
      music.pause();
    })

    music.onPlay(e => {
      console.log('播放')
      this.setData({ playLists: false })
      music.play();
    })

    music.onNext(e =>{
      console.log('下一曲')
      this.setData({ playLists: false })
      this.nextMusic();
    })

    music.onPrev(e => {
      console.log('上一曲')
      this.setData({ playLists: false })
      this.fristMusic();
    })
    //什么视频？？？？？
    // 获取视频总时长
    setTimeout(() => {
      let minute = "" + parseInt(music.duration / 60) < 10 ? "0" + parseInt(music.duration / 60) : '' + parseInt(music.duration / 60);
      let second = "" + parseInt(music.duration % 60) < 10 ? "0" + parseInt(music.duration % 60) : "" + parseInt(music.duration % 60);
      this.setData({ durations: minute + ':' + second })
    }, 1500)

    // 获取当前时间
    clearInterval(timer);
    timer = setInterval(() => {
      let currentM = Math.floor(music.currentTime / 60);
      let min = "" + currentM < 10 ? currentM = "0" + currentM : currentM;
      let miao = parseInt(music.currentTime % 60);
      let srcollLine = this.data.getLineWidth / music.duration * music.currentTime
      miao < 10 ? miao = "0" + miao : miao;
      let curremtTimer = min + ":" + miao;
      this.setData({
        currentTime: curremtTimer,
        scrollLine: srcollLine,
      })
    }, 1000);
  },
  playList() {
    if (app.globalData.musicLink) {
      let music = wx.getBackgroundAudioManager()
      if (!this.data.playLists) {
        // 暂停
        this.setData({ playLists: true })
        music.pause()
      } else {
        // 播放
        this.setData({ playLists: false })   
        let _this = this;

        // 调用音乐播放函数
        music.play()

      }
    } else {
      wx.showToast({
        title: '请先添加音乐',
        icon: 'loading',
        duration: 1000
      })
    }

  },
  fristMusic() {
    index--;
    let datas = app.globalData.playArrs;
    if (index < 0) {
      index = 0;
      wx.showToast({
        title: '请先添加歌曲',
        duration: 1000
      })
    } else {
      this.MusicDatas(datas[index].musicName, datas[index].musicImg, datas[index].musicZz, datas[index].musicLink)
      this.setData({ playLists: false })
    }
  },
  nextMusic() {
    index++;
    let datas = app.globalData.playArrs;
    if (index > datas.length - 1) {
      index = datas.length - 1;
      wx.showToast({
        title: '请先添加歌曲',
        duration: 1000
      })

    } else {
      this.MusicDatas(datas[index].musicName, datas[index].musicImg, datas[index].musicZz, datas[index].musicLink)
      this.setData({ playLists: false })
    }
  },
  starList(e) {
    this.data.starLists ? this.setData({ starLists: false }) : this.setData({ starLists: true });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})
