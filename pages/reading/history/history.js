const axiosApi = require('../../../utils/axiosApi');
Page({
  data: {
    day: '',  // 当前选择的日期
    historyDay: [],  // 可选择的历史日期列表
    results: [],
    showPicker: false  // 控制日期选择器显示
  },

  onLoad() {
    this.loadHistoryDays();  // 初始化加载历史日期
  },

  loadHistoryDays() {
    axiosApi.getHistoryRecentDays().then(res => {
      if (res.code === 200 && res.data.length > 0) {
        this.setData({
          historyDay: res.data, 
          day: res.data[0]  // 默认选择第一个日期
        });
        this.loadDayDetails(this.data.day);
      }
    });
  },

  // 显示日期选择器
  showDatePicker() {
    this.setData({ showPicker: true });
  },

  // 日期选择器改变事件处理
  onPickerConfirm(event) {
    const selectedDay = event.detail.value;
    this.setData({
      day: selectedDay,
      showPicker: false  // 关闭选择器
    });
    this.loadDayDetails(selectedDay);
  },

  // 关闭日期选择器
  onPickerCancel() {
    this.setData({ showPicker: false });
  },

  loadDayDetails(day) {
    axiosApi.getHistoryByDay(day).then(res => {
      if (res.code === 200) {
        const highlightedData = res.data.map(item => ({
          original: this.highlightText(item.original),
          translation: this.highlightText(item.translation)
        }));
        this.setData({
          results: highlightedData
        });
      }
    });
  },

  highlightText(text) {
    console.log(text)
    return text.replace(/<([^>]+)>/g, '<span class="highlight">$1</span>');
  }
});
