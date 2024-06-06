const app = getApp()
const constants = require('../../utils/constants')

Page({
  data: {
    sceneCode: '',
    useScene: true,
    loginMessage: '登录',
    showModal: false ,// 控制模态框显示隐藏
  },
  onLoad(query) {
    var that = this;
    var scene = query.scene ? decodeURIComponent(query.scene.toString()):undefined;
    // scene='171749494658415207'
    if (scene == undefined) {
      // 普通登录
      that.setData({
        sceneCode: '',
        useScene: false
      })
      // 如果有token直接跳到workbook页面
      const token = wx.getStorageSync('token');
      if (token) {
        // TODO 校验token
        wx.switchTab({
          url: '/pages/wordbook/wordbook'
        })
      }
    } else {
      that.setData({
        loginMessage: '授权登录',
        sceneCode: scene,
      })
    }
  },

  // 显示授权模态框
  showAuthModal: function () {
    this.setData({
      showModal: true
    });
  },

  // 取消授权
  cancelAuth: function () {
    this.setData({
      showModal: false
    });
  },

  // 确认授权
  confirmAuth: function () {
    this.setData({
      showModal: false
    });
    this.loginReq(); // 调用登录请求
  },

  // 点击授权登录
  loginReq: function () {
    var that = this;
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
