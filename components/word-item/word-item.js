Component({
  properties: {
    title: String,
    progress: Number,
    selected: Boolean,
    index: Number // 添加索引属性，用于识别项
  },
  data: {
    activeClass: ''
  },
  methods: {
    onTap(event) {
      const index = event.currentTarget.dataset.index;
      this.setData({ activeClass: 'active' });
      this.triggerEvent('select', { index: index });

      setTimeout(() => {
        this.setData({ activeClass: '' });
      }, 300); // 特效持续时间
    }
  }
});
