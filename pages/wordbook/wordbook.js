const axiosApi = require('../../utils/axiosApi'); 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wordList: [],
    activeBook: {
      title: '',
      progress: 0,
      lazyMode: false,
      masteredCount: 0,
      wordCount: 0,
      bookNo: undefined,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.refreshWordBook();
  },

  onShow() {
    // 通过 getTabBar 接口获取组件实例，并调用 setData 更新选中态
    this.getTabBar().setData({active: 0})
  },
  
  onSelect(event) {
    const index = event.detail.index;
    axiosApi.usWordBook(this.data.wordList[index].bookNo).then(res => {
      this.refreshWordBook();
    });
  },

  handelLearnWords() {
    const lazy=this.data.activeBook.lazyMode;
    wx.navigateTo({
      url: `/pages/wordbook/learn/learn?lazyMode=${lazy}`,
    });
  },

  handelReviewWords() {
    wx.navigateTo({
      url: '/pages/wordbook/review/review',
    });
  },

  refreshWordBook() {
    axiosApi.getWordbookList()
      .then(data => {
        let activeBook = null;
        const updatedList = data.data.filter(item => {
          if (item.active) {
            activeBook = {
              ...item,
              progress: item.wordCount > 0 ? Math.round((item.masteredCount / item.wordCount) * 100) : 0
            };
            return false; // 过滤掉active项
          }
          return true;
        }).map(item => {
          const newItem = {
            ...item,
            progress: item.wordCount > 0 ? Math.round((item.masteredCount / item.wordCount) * 100) : 0
          };
          return newItem;
        });

        this.setData({
          wordList: updatedList,
          activeBook: activeBook
        });
      })
      .catch(error => {
        console.error('请求失败', error);
      });
  }
});

