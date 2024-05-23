Component({
  data: {
    active: 0,
    list: [
      { icon: 'notes-o', text: '词书', url: '/pages/wordbook/wordbook' },
      { icon: 'smile-o', text: '阅读', url: '/pages/reading/reading' },
      { icon: 'bar-chart-o', text: '统计', url: '/pages/statistics/statistics' },
      { icon: 'setting-o', text: '设置', url: '/pages/settings/settings' }
    ]
  },
  methods: {
    onChange(event) {
      const index = event.detail;
      this.setData({ active: index });
      wx.switchTab({ url: this.data.list[index].url });
    }
  }
});
