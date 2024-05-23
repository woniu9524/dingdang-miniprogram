const axiosApi = require('../../utils/axiosApi');
Page({
  data: {
    results: [],
    loading: false
  },
  onShow() {
    this.getTabBar().setData({ active: 1 });
  },
  generateText: function() {
    this.setData({ loading: true });
    axiosApi.getGenerationText().then(res => {
      console.log(res.data);
      const highlightedData = res.data.map(item => ({
        English: this.highlightText(item.English),
        Chinese: this.highlightText(item.Chinese)
      }));
      console.log(highlightedData);
      this.setData({
        results: highlightedData,
        loading: false
      });
    }).catch(err => {
      console.error(err);
      this.setData({ loading: false });
    });
  },
  highlightText: function(text) {
    return text.replace(/<([^>]+)>/g, '<span class="highlight">$1</span>');
  },
  viewHistory: function() {
    // wx.navigateTo({
    //   url: '/pages/history/history'
    // });
  }
});
