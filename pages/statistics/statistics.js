import uCharts from '../../utils/u-charts.min';
const axiosApi = require('../../utils/axiosApi');
var uChartsInstance = {};

Page({
  data: {
    cWidth: 750,
    cHeight: 500,
    wordMasteryData: [],
    wordLearnHistoryData: []
  },
  onShow() {
    // 通过 getTabBar 接口获取组件实例，并调用 setData 更新选中态
    this.getTabBar().setData({active: 2})
  },
  onReady() {
    const cWidth = 750 / 750 * wx.getSystemInfoSync().windowWidth;
    const cHeight = 500 / 750 * wx.getSystemInfoSync().windowWidth;
    this.setData({ cWidth, cHeight });
    this.getServerData();
  },
  getServerData() {
    axiosApi.getWordLearnHistory().then(res => {
      console.log('Word Learn History Data:', res.data);
      if (res.data && res.data.length > 0) {
        this.drawAreaChart('areaChart', res.data);
      }
    }).catch(err => {
      console.error('Error fetching Word Learn History:', err);
    });

    axiosApi.getWordMastery().then(res => {
      console.log('Word Mastery Data:', res.data);
      if (res.data && res.data.length > 0) {
        this.drawRoseChart('roseChart', res.data[0]);
      }
    }).catch(err => {
      console.error('Error fetching Word Mastery:', err);
    });
  },
  drawRoseChart(id, data) {
    const ctx = wx.createCanvasContext(id, this);
    const series = [
      { name: "陌生", data: data.unfamiliar },
      { name: "困难", data: data.difficult },
      { name: "良好", data: data.good },
      { name: "容易", data: data.easy },
      { name: "掌握", data: data.mastered },
      { name: "完全掌握", data: data.fullyMastered }
    ];

    console.log('Series for Rose Chart:', series);

    uChartsInstance[id] = new uCharts({
      type: "rose",
      context: ctx,
      width: this.data.cWidth,
      height: this.data.cHeight,
      series: series,
      animation: true,
      background: "#FFFFFF",
      color: ["#FF6347", "#FFA500", "#FFD700", "#ADFF2F", "#32CD32", "#0EA8E4"], 
      padding: [5,5,5,5],
      enableScroll: false,
      legend: {
        show: true,
        position: "left",
        lineHeight: 25
      },
      extra: {
        rose: {
          type: "area",
          minRadius: 50,
          activeOpacity: 0.5,
          activeRadius: 10,
          offsetAngle: 0,
          labelWidth: 15,
          border: false,
          borderWidth: 2,
          borderColor: "#FFFFFF"
        }
      }
    });
  },
  drawAreaChart(id, data) {
    const ctx = wx.createCanvasContext(id, this);
    const categories = data.map(item => {
      const date = new Date(item.learningDate);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}-${day}`;
    });
    const series = [
      {
        name: '学习',
        data: data.map(item => item.newWordsCount)
      },
      {
        name: '复习',
        data: data.map(item => item.reviewedWordsCount)
      }
    ];

    console.log('Categories for Area Chart:', categories);
    console.log('Series for Area Chart:', series);

    uChartsInstance[id] = new uCharts({
      type: "area",
      context: ctx,
      width: this.data.cWidth,
      height: this.data.cHeight,
      categories: categories,
      series: series,
      animation: true,
      background: "#FFFFFF",
      padding: [15, 15, 0, 5],
      enableScroll: true,
      xAxis: {
        disableGrid: true,
        scrollShow: false,
        scrollAlign: 'right',
        itemCount: 5
      },
      yAxis: {
        data: [{ min: 0 }]
      },
      extra: {
        area: {
          type: "curve"
        }
      }
    });
  },
  tap(e) {
    uChartsInstance[e.target.id].touchLegend(e);
    uChartsInstance[e.target.id].showToolTip(e);
  },
  touchStart(e) {
    uChartsInstance[e.target.id].scrollStart(e);
  },
  touchMove(e) {
    uChartsInstance[e.target.id].scroll(e);
  },
  touchEnd(e) {
    uChartsInstance[e.target.id].scrollEnd(e);
    uChartsInstance[e.target.id].showToolTip(e);
  },

});
