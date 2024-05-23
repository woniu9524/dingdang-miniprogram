Component({
  properties: {
    todayWords: {
      type: Number,
      value: 0
    },
    totalWords: {
      type: Number,
      value: 0
    },
    strangeWords: {
      type: Number,
      value: 0
    },
    difficultWords: {
      type: Number,
      value: 0
    },
    goodWords: {
      type: Number,
      value: 0
    },
    easyWords: {
      type: Number,
      value: 0
    }
  },
  methods: {
    onMore() {
      this.triggerEvent('more');
    }
  }
});
