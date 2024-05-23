const axiosApi = require('../../../utils/axiosApi');
import Toast from '@vant/weapp/toast/toast';

Page({
  data: {
    hideTranslation: true, // 隐藏翻译开关
    todayReviewCount: 0, // 今日复习计数
    needReviewCount: 0, // 需要复习的单词总数
    pageSize: 10, // 每次加载的单词数量
    lazyMode: false, // 懒加载模式
    wordList: [], // 当前显示的单词列表
    allWords: [], // 本地存储的所有单词列表
    language:'en',
  },

  onLoad(options) {
    if (options.lazyMode) {
      this.setData({
        lazyMode: options.lazyMode === 'true',
        language: options.language
      });
    }
    this.loadLocalReviewList(); // 加载本地复习列表
    axiosApi.getTodayLearnCount().then((res) => {
      this.setData({
        todayReviewCount: res.data.review_count || 0
      });
    });
  },

  loadLocalReviewList() {
    try {
      const allWords = wx.getStorageSync('localReviewList') || [];
      this.setData({
        allWords,
        needReviewCount: allWords.length
      });
      this.loadMoreWords(); // 初始加载一组单词
    } catch (e) {
      this.refreshNeedLearnList(); // 如果本地没有数据，刷新需要复习的列表
    }
  },

  saveLocalReviewList(allWords) {
    wx.setStorageSync('localReviewList', allWords);
  },

  refreshNeedLearnList() {
    axiosApi.getWordReviewToday().then(res => {
      this.setData({
        allWords: res.data,
        needReviewCount: res.data.length
      });
      this.saveLocalReviewList(res.data);
      this.loadMoreWords(); // 初始加载一组单词
    });
  },

  loadMoreWords() {
    const { allWords, pageSize, wordList } = this.data;
    if (allWords.length > 0) {
      const newWords = allWords.slice(0, pageSize); // 获取新的一组单词
      this.setData({
        wordList: [...wordList, ...newWords], // 添加到当前单词列表
        allWords: allWords.slice(pageSize) // 更新剩余的所有单词列表
      });
      this.saveLocalReviewList(this.data.allWords); // 保存更新后的所有单词列表到本地
    } else {
      Toast('没有更多的单词了~');
    }
  },

  onCheckboxChange(event) {
    this.setData({
      hideTranslation: event.detail
    });
  },

  onLearnMore() {
    if (this.data.wordList.length > 0) {
      Toast('先学完这组哦~');
      return;
    }
    this.loadMoreWords(); // 加载新的一组单词
  },

  onDelete(event) {
    const index = event.currentTarget.dataset.index;
    const wordList = this.data.wordList;
    const { allWords } = this.data;

    axiosApi.rateWord(wordList[index].word, 5).then(() => {
      wordList.splice(index, 1); // 删除已复习的单词
      this.setData({
        wordList,
        todayReviewCount: this.data.todayReviewCount + 1
      });
      this.saveLocalReviewList(allWords); // 保存更新后的单词列表到本地
    });
  },

  onPronounce(event) {
    const word = event.currentTarget.dataset.word;
    // 调用发音功能
  },

  onSetMastery(event) {
    const level = event.detail.level;
    const index = event.target.dataset.index;
    const wordList = this.data.wordList;
    const { allWords } = this.data;

    axiosApi.rateWord(wordList[index].word, level).then(() => {
      wordList[index].lastGrade = level; // 更新单词的掌握等级
      wordList.splice(index, 1); // 删除已复习的单词
      this.setData({
        wordList,
        todayReviewCount: this.data.todayReviewCount + 1
      });
      this.saveLocalReviewList(allWords); // 保存更新后的单词列表到本地
    });
  }
});
