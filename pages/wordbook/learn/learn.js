const axiosApi = require('../../../utils/axiosApi'); 
import Toast from '@vant/weapp/toast/toast';
Page({
  data: {
    hideTranslation: true,
    todayLearnedCount: 0,
    page: 1,
    pageSize: 10,
    lazyMode: false,
    language:'en',
    wordList: [
      {
        id: 1,
        word: "example",
        translation: "例子",
        exampleSentence: "This is an example sentence.",
        sentenceTranslation: "这是一个例句。",
        masteryLevel: 3
      },
      {
        id: 2,
        word: "test",
        translation: "测试",
        exampleSentence: "This is a test sentence.",
        sentenceTranslation: "这是一句测试句。",
        masteryLevel: 2
      }
    ],
  },
  onLoad(options) {
    if (options.lazyMode) {
      this.setData({
        lazyMode: options.lazyMode == 'true',
        language: options.language
      });
    }
    this.refreshNeedLearnList();
    axiosApi.getTodayLearnCount().then((res)=>{
      this.setData({todayLearnedCount:res.data.learn_count||0})
    })
  },
  
  refreshNeedLearnList() {
    axiosApi.getNeedLearnWordList(this.data.page, this.data.pageSize).then(res => {
      const wordSet = new Set();
      const uniqueWords = [];
      res.data.forEach(word => {
        if (!wordSet.has(word.word)) {
          uniqueWords.push(word);
          wordSet.add(word.word);
        }
      });

      this.setData({ wordList: uniqueWords });
    });
  },

  // 隐藏翻译
  onCheckboxChange(event) {
    this.setData({
      hideTranslation: event.detail
    });
  },

  // 在学一组
  onLearnMore() {
    // TODO 判断这组学没学完
    if(this.data.wordList.length>0){
      Toast('先学完这组哦~');
      return;
    }
    this.refreshNeedLearnList();
  },

  // 删除单词
  onDelete(event) {
    const index = event.currentTarget.dataset.index;
    const wordList = this.data.wordList;
 
    axiosApi.rateWord(wordList[index].word,6).then((res)=>{
      wordList.splice(index, 1);
      this.setData({ wordList });
      this.setData({todayLearnedCount:this.data.todayLearnedCount+1})
    });
    
  },

  // 朗读
  onPronounce(event) {
    const word = event.currentTarget.dataset.word;
    // 调用发音功能
  },

  // 评估单词
  onSetMastery(event) {
    const level=event.detail.level;
    const index=event.target.dataset.index;
    const wordList = this.data.wordList;
    // TODO 实现评估
    axiosApi.rateWord(wordList[index].word,level).then((res)=>{
      wordList.splice(index, 1);
      this.setData({ wordList });
      this.setData({todayLearnedCount:this.data.todayLearnedCount+1})
    });

  }
});
