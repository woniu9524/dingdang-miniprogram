const axiosApi = require('../../utils/axiosApi');
import Toast from '@vant/weapp/toast/toast';
Page({
  data: {
    results: [],
    loading: false
  },
  onShow() {
    this.getTabBar().setData({
      active: 1
    });
  },
  generateText: function () {
    this.setData({
      loading: true
    });
    axiosApi.getGenerationText().then(res => {
      if (res.code == 200) {
        const highlightedData = res.data.map(item => ({
          English: this.highlightText(item.English),
          Chinese: this.highlightText(item.Chinese)
        }));
        this.setData({
          results: highlightedData,
          loading: false
        });
      } else {
        this.setData({
          loading: false
        });
        console.log(res.message)
        Toast(res.message);
      }
    }).catch(err => {
      console.error(err);
      this.setData({
        loading: false
      });
    });
  },
  highlightText: function (text) {
    return text.replace(/<([^>]+)>/g, '<span class="highlight">$1</span>');
  },
  viewHistory: function () {
    wx.navigateTo({
      url: '/pages/reading/history/history'
    });
  }
});