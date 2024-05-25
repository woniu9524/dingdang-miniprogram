const request = require('./request.js'); // 根据实际路径调整


const getWordbookList = () => {
  return request.get('/v1/wordbook/list', {});
};
const usWordBook = (bookNo)=> {
  try {
    return request.get(`/v1/wordbook/use?bookNo=${bookNo}`);
  } catch (error) {
    console.error('使用单词书失败:', error);
    throw error; // 或者处理错误
  }
};

const getNeedLearnWordList=(page,size)=>{
  try {
    return request.get(`/v1/wordbook/wordNeedLearn?page=${page}&size=${size}`);
  } catch (error) {
    console.error('获取单词列表失败:', error);
    throw error; // 或者处理错误
  }
}

const rateWord = (word, score)=> {
  try {
    return request.get(`/v1/wordbook/score?word=${word}&grade=${score}`);
  } catch (error) {
    console.error('打分单词失败:', error);
    throw error; // 或者处理错误
  }
}

const getWordReviewToday = ()=> {
  try {
    return request.get(`/v1/wordbook/wordReviewToday`);
  } catch (error) {
    console.error('wordReviewToday失败:', error);
    throw error; // 或者处理错误
  }
};

// 获取今日学习和复习单词数量
const getTodayLearnCount = ()=> {
  try {
    return request.get(`/v1/wordbook/todayLearnCount`);
  } catch (error) {
    console.error( error);
    throw error; // 或者处理错误
  }
};

// 生成文本
const getGenerationText = ()=> {
  try {
    return request.get(`/v1/wordbook/textGeneration`);
  } catch (error) {
    console.error( error);
    throw error; // 或者处理错误
  }
};

const getHistoryRecentDays = ()=> {
  try {
    return request.get(`/v1/wordbook/history/recentDays`);
  } catch (error) {
    console.error( error);
    throw error; // 或者处理错误
  }
};

const getHistoryByDay = (day)=> {
  try {
    return request.get(`/v1/wordbook/history/data?day=${day}`);
  } catch (error) {
    console.error( error);
    throw error; // 或者处理错误
  }
};
  
// 获取单词学习历史
const getWordLearnHistory = ()=> {
  try {
    return request.get(`/v1/wordbook/wordHistory/list`);
  } catch (error) {
    console.error( error);
    throw error; // 或者处理错误
  }
};
// 获取单词掌握情况
const getWordMastery = ()=> {
  try {
    return request.get(`/v1/wordbook/wordMastery`);
  } catch (error) {
    console.error( error);
    throw error; // 或者处理错误
  }
};
module.exports = {
  getWordbookList,
  usWordBook,
  getNeedLearnWordList,
  rateWord,
  getWordReviewToday,
  getTodayLearnCount,
  getGenerationText,
  getHistoryRecentDays,
  getHistoryByDay,
  getWordMastery,
  getWordLearnHistory
};
