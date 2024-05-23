Page({
  data: {
    hasBook: false,
    bookTitle: '',
  },
  onLoad() {
  
  },
  handleChangeDictionary() {
    // 更换词库的处理逻辑
    console.log('更换词库');
  },
  
  handleLearnWords() {
    // 学单词的处理逻辑
    console.log('学单词');
  },
  
  handleReviewWords() {
    // 背单词的处理逻辑
    console.log('背单词');
  },
  handleMore() {
    wx.showToast({
      title: '获取更多详细信息',
      icon: 'none'
    });
  }
});
