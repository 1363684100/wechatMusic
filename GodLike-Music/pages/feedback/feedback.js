// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  onReady(){
    wx.setNavigationBarTitle({
      title: '用户反馈'
    })
  },
  formSubmit({detail:{value:val}}){
    // 三项任一项都不能为空
    if (val.users !== '' && val.numbers !== '' && val.textarea !== ''){
      console.log(val);//标记。
      wx.request({
        url: 'http://God6music.com',//示例用，并未真正提交
        data: val,
        header: {"Content-Typt":"application/json"},
        // Post是用来向服务器上传递数据，Post是将表单中的数据放在form的数据体中，按照变量和值相对应的方式，传递到action所指向URL且Post的所有操作对用户来说都是不可见的。
        method: 'POST',
        success: function(res) {
          console.log(res);
          wx.showToast({
            title: '提交成功,跳转中...',
            icon: 'success',
            duration: 2000
          })
          // 提交成功跳转到首页推荐页
          setTimeout(() =>{
            wx.switchTab({
              url: '../index/index'
            })
          },1000)
        }
      })
    }else {
      console.log("三个都是必填项不能为空")
    }
    
  }
})