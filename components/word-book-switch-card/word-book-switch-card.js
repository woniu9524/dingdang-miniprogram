Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    showChangeButton: {
      type: Boolean,
      value: true
    },
    lazyDogMode: {
      type: Boolean,
      value: false
    },
    progress: {
      type: Number,
      value: 0
    },
    wordCount: {
      type: Number,
      value: 0
    },
    masteredCount: {
      type: Number,
      value: 0
    },    
  },
  data: {
    showActionSheet: false,
    sheetActive: 0,
    sheetActiveName: '列表式',
    actions: [
      { name: '列表式', mode: 'list' },
      { name: '卡片式', mode: 'card' }
    ]
  },
  methods: {
    onOpen() {
      this.setData({ showActionSheet: true });
    },
    onChangeDictionary() {
      this.triggerEvent('changeDictionary');
    },
    onLearnWords() {
      this.triggerEvent('learnWords');
    },
    onReviewWords() {
      this.triggerEvent('reviewWords');
    },
    onLazyDogModeChange(e) {
      this.setData({
        lazyDogMode: e.detail.value
      });
      this.triggerEvent('lazyDogModeChange', { value: e.detail.value });
    },
    onCloseActionSheet() {
      this.setData({ showActionSheet: false });
    },
    onSelectActionSheet(e) {
      const { mode } = e.detail;
      this.setData({
        sheetActiveName: mode === 'list' ? '列表式' : '卡片式'
      });
      this.triggerEvent('modeChange', { mode });
      this.onCloseActionSheet();
    }
  }
});
