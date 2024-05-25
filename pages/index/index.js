const app = getApp()
const constants = require('../../utils/constants')
Page({
  data: {
    sceneCode: '',
    useScene: true,
  },
  onLoad(query) {
    var that = this;
    //wx.clearStorage()
    var scene = decodeURIComponent(query.scene)
    //scene='171662364860193914'
    if (scene == 'undefined') {
      // 普通登录
      that.setData({
        sceneCode: '',
        useScene: false
      })
      // 如果有token直接跳到workbook页面
      const token = wx.getStorageSync('token');
      if (token) {
        // TOOD 校验token
        wx.switchTab({
          url: '/pages/wordbook/wordbook'
        })
      }
    } else {
      that.setData({
        sceneCode: scene,
      })
    }

  },

  // 点击授权登录
  loginReq: function () {
    var that = this;
    console.log("xxxx");
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: constants.BASE_URL + '/v1/auth/wechat/callback',
            data: {
              code: res.code,
              scene: that.data.sceneCode,
              useScene: that.data.useScene
            },
            success(res) {
              const token = res.data.data.token;
              if (token) {
                wx.setStorageSync('token', token);
                wx.switchTab({
                  url: '/pages/wordbook/wordbook'
                })
              }
            }
          })
        }
      }
    })
  }
})