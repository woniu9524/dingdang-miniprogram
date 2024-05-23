// request.js
const constants = require('./constants')


// 获取本地存储的token
const getToken = () => {
  try {
    return wx.getStorageSync('token');
  } catch (e) {
    console.log('获取token失败', e);
    return '';
  }
};

const request = (url, method, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${constants.BASE_URL}${url}`,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}` // 将token添加到请求头中
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

const get = (url, params) => {
  return request(url, 'GET', params);
};

const post = (url, data) => {
  return request(url, 'POST', data);
};

module.exports = {
  get,
  post
};
