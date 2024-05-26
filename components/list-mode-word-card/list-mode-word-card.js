Component({
  properties: {
    word: {
      type: String,
      value: ''
    },
    translation: {
      type: String,
      value: ''
    },
    lazyTranslation: {
      type: String,
      value: ''
    },
    lazyMode: {
      type: Boolean,
      value: false
    },
    masteryLevel: {
      type: Number,
      value: 0
    },
    translationVisible: {
      type: Boolean,
      value: true
    },
    exampleSentence: {
      type: String,
      value: ''
    },
    sentenceTranslation: {
      type: String,
      value: ''
    },
    language:{
      type: String,
      value: ''
    }
  },
  data: {
    progress: 0,
    circleColor: '#f44', // 初始颜色设为红色
    isExpanded: false, // 控制卡片展开状态
    highlightedExampleSentence: '',
    highlightedSentenceTranslation: '',
    audioContext: null
  },
  observers: {
    'masteryLevel': function(level) {
      const progress = (level / 5) * 100;
      const color = this.calculateColor(progress);
      this.setData({ progress, circleColor: color });
    },
    'exampleSentence': function(text) {
      this.setData({ highlightedExampleSentence: this.highlightWords(text) });
    },
    'sentenceTranslation': function(text) {
      this.setData({ highlightedSentenceTranslation: this.highlightWords(text) });
    }
  },
  lifetimes: {
    attached() {
      this.setData({
        audioContext: wx.createInnerAudioContext()
      });
    },
    detached() {
      this.data.audioContext.destroy();
    }
  },
  methods: {
    onDelete(event) {
      this.triggerEvent('delete');
    },
    onPronounce(event) {
      var audioUrl = `https://dict.youdao.com/dictvoice?audio=${this.data.word}&type=1`;
      console.log(this.data.language)
      if(this.data.language=='jp'){
        audioUrl = `https://dict.youdao.com/dictvoice?le=jap&audio=${this.data.word}&type=3`;
      }
      this.data.audioContext.src = audioUrl;
      this.data.audioContext.play();
    },
    calculateColor(progress) {
      if (progress <= 0) {
        return '#eaeaea';
      } else if (progress <= 20) {
        return '#ff4d4f';
      } else if (progress <= 40) {
        return '#ff7a45';
      } else if (progress <= 60) {
        return '#556B2F';
      } else if (progress <= 80) {
        return '#73d13d';
      } else {
        return '#36cfc9';
      }
    },
    toggleExpand() {
      this.setData({
        isExpanded: !this.data.isExpanded,
        translationVisible: true
      });
    },
    onSetMastery(event) {
      const level = event.currentTarget.dataset.level;
      this.setData({
        masteryLevel: level,
        isExpanded: false // 选择后收起按钮
      });
      this.triggerEvent('setMastery', { level });
    },
    highlightWords(text) {
      const parts = text.split(/【|】/).map((part, index) => {
        if (index % 2 === 1) {
          return `<span class="highlight">${part}</span>`;
        } else {
          return part;
        }
      });
      return parts.join('');
    }
  }
});
