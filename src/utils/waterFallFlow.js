const computeWaterFallFlow = (ref, colums = 2) => {
  let resizeLister = null
  const computeCard = () => {
    const cards = ref.children
    const winWidth = window.innerWidth // 获取当前视域宽度
    const margin = Math.round(winWidth * 0.015) // 计算出 card 之间的间距
    const cardWidth = Math.floor((winWidth - (colums + 1) * margin) / colums) // 计算出每个 card 的宽度

    const topList = new Array(colums).fill(0) // 用于记录每一列当前顶部距离

    // 给每个 card 赋予宽度，因为 card 中的 img 高度会随着宽度自适应，所以每个 card 高度会自适应
    for (let i = 0; i < cards.length; i++) {
      cards[i].style.width = cardWidth + 'px'
    }
    // 计算每个 card 的位置偏移
    for (let i = 0; i < cards.length; i++) {
      // 判断当前哪一列比较高，card插在高的那一列
      let min = Math.min(...topList)
      const minColum = topList.indexOf(min)

      // 计算出 card 的偏移量
      let left = margin * (minColum + 1) + cardWidth * minColum
      let top = min + margin
      cards[i].style.transform = `translate(${left}px, ${top}px)`
      topList[minColum] += cards[i].clientHeight + margin
    }
    ref.style.height = Math.max(...topList) + margin + 'px'
  }

  computeCard()

  // 监听 resize 事件
  window.addEventListener('resize', () => {
    computeCard()
  })
}

export default computeWaterFallFlow
