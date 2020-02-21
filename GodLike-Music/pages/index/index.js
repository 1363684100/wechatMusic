//获取应用实例
const app = getApp();
Page({
  data: {
    navBar: ["推荐", "歌手", "排行", "搜索"],
    navIndex: 0,
    autoplay: true,
    interval: 3000,
    duration: 400,
    recommendList: [],
    sliderData: [],
    singerData: [],
    searchData: [],
    phDataList: '',
    searchTitle:'',
    searchBody:'',
    musicLink:'',



    putSearch: "",//input框内值
    listarr: [],//创建数组
    SearchTextb: '取消',
    keydown_number: 0,//检测input框内是否有内容
    searchTitle: "",//value值
    /*hostarr: [],   热门搜索接收请求存储数组  */
    name_focus: true//获取焦点
  },
  onLoad() {
    
    /*=================================
     *          首页数据请求模块           
     =================================*/

    let that = this;
    wx.setNavigationBarTitle({
      title: '搜索'
    });
    wx.getStorage({
      key: 'list_arr',
      success: function (res) {
        that.setData({
          listarr: res.data
        })
      }
    })
    
    
    
    
    //  请求首页列表数据
    wx.request({
      url: "http://ustbhuangyi.com/music/api/getDiscList?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&categoryId=10000000&rnd=0.9519853334085604",
      method: "GET",
      success(res) {
        that.setData({
          recommendList: res.data.data.list
        })
        // console.log(res.data.data.list)
      }
    })

    // 请求轮播图
    wx.request({
      url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&platform=h5&uin=0&needNewCode=1&jsonpCallback',
      method: "GET",
      success(res) {
        that.setData({
          sliderData: res.data.data
        })
        // console.log(res.data.data)
      }
    })
    // 请求歌手数据 
    wx.request({
      url: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0',
      method: "GET",
      success(res) {
        that.setData({
          singerData: res.data.data.list
        })
        // console.log(res.data.data.list)
      }
    })

    // 搜索数据请求
    wx.request({
      url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5&jsonpCallback',
      method: "GET",
      success(res) {
        that.setData({
          searchData: res.data.data.hotkey.splice(0, 10),
        })
      }
    })
    // 排行
    wx.request({
      url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5&jsonpCallback=data',
      method: "GET",
      success(res) {
        let datas = res.data;
        const spliceData = datas.substring(5, datas.lastIndexOf(')'));
        that.setData({
          phDataList: JSON.parse(spliceData).data,
        })
        // console.log(JSON.parse(spliceData).data)
      }
    })
    wx.getStorage({
      key: 'list_arr',
      success: function (res) {
        that.setData({
          listarr: res.data
        })
      }
    })
  },


  /*=================================
   *             事件模块            
   =================================*/

  // 导航栏事件
  navBarIndex(e) {
    this.setData({
      navIndex: e.currentTarget.dataset.index
    })
  },

  // swiper
  clickSwiper(e) {
    this.setData({
      navIndex: e.detail.current,
    })
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onShareAppMessage: function () {

  },
  addVal(e){
    let sub = e.currentTarget.dataset.searchtitle;
    this.setData({
      searchTitle: sub.substr(0, sub.length - 1)
    })
    let postData = this.data.searchTitle
    let that = this;
    wx.request({
      url: 'http://ustbhuangyi.com/music/api/search?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&w=' + postData + '&p=1&perpage=20&n=20&catZhida=1&zhidaqu=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&remoteplace=txt.mqq.all&uin=0&needNewCode=1&platform=h5',
      success(res) {
        that.setData({
          searchBody: res.data
        })
      }
    })
  },
  clearInputVal(){
    this.setData({
      searchTitle:''
    })
  },
  // 搜索页面 搜索功能
  putSearch(e){
    // 设置状态
    this.setData({
      searchTitle: e.detail.value
    })
     if (e.detail.cursor != 0) {
      this.setData({
        SearchTextb: "搜索",
        keydown_number: 1
      })
    } else {
      this.setData({
        SearchTextb: "取消",
        keydown_number: 0
      })
    }
  

    // 每输入一次就请求一次
    let that = this;
    wx.request({
      url: 'http://ustbhuangyi.com/music/api/search?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&w=' + e.detail.value + '&p=1&perpage=20&n=20&catZhida=1&zhidaqu=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&remoteplace=txt.mqq.all&uin=0&needNewCode=1&platform=h5',
      success(res) {
        that.setData({
          searchBody: res.data
        })
      }
    })
  },
 




  search: function () {
    if (this.data.keydown_number == 1) {
      let that = this;
      //把获取的input值插入数组里面
      let arr = this.data.listarr;
      console.log(this.data.putSearch)
      console.log(this.data.searchTitle)
      //判断取值是手动输入还是点击赋值
      if (this.data.searchTitle == "") {
        // console.log('进来第er个')
        // 判断数组中是否已存在
        let arrnum = arr.indexOf(this.data.putSearch);
        console.log(arr.indexOf(this.data.putSearch));
        if (arrnum != -1) {
          // 删除已存在后重新插入至数组
          arr.splice(arrnum, 1)
          arr.unshift(this.data.putSearch);

        } else {
          arr.unshift(this.data.putSearch);
        }

      } else {
        console.log('进来第一个')
        let arr_num = arr.indexOf(this.data.searchTitle);
        console.log(arr.indexOf(this.data.searchTitle));
        if (arr_num != -1) {
          arr.splice(arr_num, 1)
          arr.unshift(this.data.searchTitle);
        } else {
          arr.unshift(this.data.searchTitle);
        }

      }
      console.log(arr)

      //存储搜索记录
      wx.setStorage({
        key: "list_arr",
        data: arr
      })
      //取出搜索记录
      wx.getStorage({
        key: 'list_arr',
        success: function (res) {
          that.setData({
            listarr: res.data
          })
        }
      })

 





      this.setData({
        searchTitle: '',
      })
    } else {
      console.log("取消")
    }

  },
  //清除搜索记录
  delete_list: function () {
    //清除当前数据
    this.setData({
      listarr: []
    });
    //清除缓存数据
    wx.removeStorage({
      key: 'list_arr'
    })
  },
  //点击赋值到input框
  this_value: function (e) {
    this.setData({
      name_focus: true
    })
    let value = e.currentTarget.dataset.text;
    this.setData({
      searchTitle: value,
      SearchTextb: "搜索",
      keydown_number: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  


  /*=================================
   *             路由模块            
   =================================*/

  // 首页列表路由
  duration(e) {
    wx.navigateTo({
      url: "../details/details?id=" + e.currentTarget.dataset.id,
    })
  },
  // 歌手列表路由
  singerList(e) {
    wx.navigateTo({
      url: "../details/details?id=" + e.currentTarget.dataset.singerid,
    })
  },
  // 排行路由
  ph_routers(e) {
    wx.navigateTo({
      url: "../details/details?id=" + e.currentTarget.dataset.id
    })
  },
goToPlay({currentTarget:{dataset:val}}){
    this.setData({
      musicLink: val.musiclink,
    })

    // 库存
    app.globalData.playArrs.push({
      musicLink: val.musiclink,
      musicImg: val.musicimg,
      musicName: val.name,
      musicZz: val.zz,
    })

    // 传值
    app.globalData.musicLink = val.musiclink;
    app.globalData.musicImg = val.musicimg;
    app.globalData.musicName = val.name;
    app.globalData.musicZz = val.zz;
    wx.switchTab({
      url: '../play/play'
    })
  }
})
 