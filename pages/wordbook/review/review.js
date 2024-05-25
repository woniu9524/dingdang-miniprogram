const axiosApi = require('../../../utils/axiosApi');
import Toast from '@vant/weapp/toast/toast';

Page({
  data: {
    hideTranslation: true, // 隐藏翻译开关
    needReviewCount: 0, // 需要复习的单词总数
    pageSize: 10, // 每次加载的单词数量
    lazyMode: false, // 懒加载模式
    allWords: [], // 本地存储的所有单词列表
    currentWordList: [], // 当前显示的单词列表
    language: 'en',
  },

  onLoad(options) {
    if (options.lazyMode) {
      this.setData({
        lazyMode: options.lazyMode === 'true',
        language: options.language
      });
    }
    this.loadLocalReviewList(); // 加载本地复习列表
  },

  loadLocalReviewList() {
    try {
      const localData = wx.getStorageSync('localReviewList') || {};
      const currentDate = new Date().toDateString();
      if (localData.date !== currentDate) {
        this.refreshNeedLearnList(); // 如果不是当日的数据，刷新需要复习的列表
      } else {
        const allWords = localData.words || [];
        this.setData({
          allWords,
          needReviewCount: allWords.length
        });
        this.updateCurrentWordList(); // 更新当前显示的单词列表
      }
    } catch (e) {
      this.refreshNeedLearnList(); // 如果本地没有数据，刷新需要复习的列表
    }
  },

  saveLocalReviewList(allWords) {
    const currentDate = new Date().toDateString();
    const localData = {
      date: currentDate,
      words: allWords
    };
    wx.setStorageSync('localReviewList', localData);
    this.setData({ needReviewCount: allWords.length }); // 更新需要复习的单词总数
  },

  refreshNeedLearnList() {
    axiosApi.getWordReviewToday().then(res => {
      const allWords = res.data.map(word => ({
        ...word,
        evaluated: false // 添加字段标记是否已评估
      }));
      this.setData({
        allWords,
        needReviewCount: allWords.length
      });
      this.saveLocalReviewList(allWords);
      this.updateCurrentWordList(); // 更新当前显示的单词列表
    });
  },

  updateCurrentWordList() {
    const { allWords, pageSize } = this.data;
    const currentWordList = allWords.slice(0, pageSize);
    this.setData({
      currentWordList
    });
  },

  onCheckboxChange(event) {
    this.setData({
      hideTranslation: event.detail
    });
  },

  onLearnMore() {
    if (this.data.currentWordList.length > 0) {
      Toast('先学完这组哦~');
      return;
    }
    this.updateCurrentWordList(); // 加载新的一组单词
  },

  onDelete(event) {
    const index = event.currentTarget.dataset.index;
    const currentWords = this.data.currentWordList;
    const word = currentWords[index].word;
    axiosApi.rateWord(word, 6).then(() => {
      this.processWordEvaluation(currentWords[index], 6, index);
    });
  },

  onSetMastery(event) {
    const level = event.detail.level;
    const index = event.target.dataset.index;
    const currentWords = this.data.currentWordList;
    if(!currentWords.evaluated){
      axiosApi.rateWord(currentWords.word,level);
    }
    const updatedWord = { ...currentWords[index], lastGrade: level };
    updatedWord.evaluated = true;

    this.processWordEvaluation(updatedWord, level, index);
  },

  processWordEvaluation(updatedWord, level, index) {
    let { allWords, currentWordList, needReviewCount } = this.data;

    // 从 currentWordList 中移除评估过的单词
    currentWordList.splice(index, 1);

    // 从 allWords 中移除评估过的单词
    const allWordsIndex = allWords.findIndex(word => word.word === updatedWord.word);
    allWords.splice(allWordsIndex, 1);

    if (level < 4) {
      // 评估等级 < 4，将单词移动到 allWords 的末尾
      allWords.push(updatedWord);
    } else {
      // 评估等级 >= 4，减少 needReviewCount
      needReviewCount--;
    }

    this.setData({
      allWords,
      currentWordList,
      needReviewCount // 更新需要复习的单词总数
    });

    this.saveLocalReviewList(allWords); // 保存更新后的单词列表到本地

    if (currentWordList.length === 0) {
      //this.updateCurrentWordList(); // 如果当前单词列表为空，加载更多单词
    }
  }
});
