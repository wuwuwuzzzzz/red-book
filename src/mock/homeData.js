// 模拟接口请求时间
import redData from '@/mock/data.js';

const delay = (t) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, t)
  })
}

const exploreCardsMock = async (nums = 20) => {
  await delay(1000)
  return new Array(nums).fill(1).map((a, i) => {
    const randomNum = Math.floor(Math.random() * 10);
    return redData[randomNum]
  })
}

export {
  exploreCardsMock
}
