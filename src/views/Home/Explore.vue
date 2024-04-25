<script setup>
import MiniCard from '@/components/MiniCard/index.vue'
import LoadPannel from '@/components/LoadPannel/index.vue'
import { nextTick, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { exploreCardsMock } from '@/mock/homeData.js';
import computeWaterFallFlow from '@/utils/waterFallFlow.js';
import useHooks from '@/hooks/useHooks.js';

const { changeRefresh } = useHooks
const { isRefresh } = toRefs(useHooks.state)

let exploreCards = reactive([])
let imgLen
let imgCount = 0 // 记录 card 中的 image 是否已经加载完毕

// 初始化 exploreCards 数据
const initData = async () => {
  imgCount = 0
  let res = await exploreCardsMock()
  exploreCards.splice(0, exploreCards.length)
  await nextTick(() => {
    imgLen = res.length
    res.forEach(item => {
      exploreCards.push(item)
    })
  })
}

initData()

// 瀑布流计算每个 card 的位置
const exploreRef = ref(null)

const addImgCount = () => {
  imgCount++
  if (imgCount === imgLen) {
    computeWaterFallFlow(exploreRef.value)
  }
}

// 加载更多
const searchMore = async (callback) => {
  let res = await exploreCardsMock(5)
  res.forEach(item => {
    exploreCards.push(item)
  })
  imgLen = exploreCards.length
  callback ? callback() : ''
}

// 刷新
const refreshRef = ref(null)
const exploreRefresh = async () => {
  exploreRef.value.parentNode.parentNode.scrollTop = 0
  refreshRef.value.style.height = '100px'
  refreshRef.value.style.transition = 'all 0.3s linear'
  refreshCanvasRef.value.style.animation = 'refreshAni 1.2s ease infinite'
  refreshAnimate()
  await initData()
  refreshCanvasRef.value.style.animation = ''
  refreshRef.value.style.height = '0'
  cancelAnimationFrame(requestID)
  setTimeout(() => {
    refreshRef.value.style.transition = ''
  }, 300)
}

// refresh 动画
const refreshCanvasRef = ref(null)
let ctx
let direction = 1
const R = 10
let angle = 0
const speed = 0.05
let centerX = 0
let centerY = 0
let requestID

// 自转动画
const refreshAnimate = () => {
  ctx.clearRect(0, 0, refreshCanvasRef.value.width, refreshCanvasRef.value.height)

  ctx.beginPath()
  ctx.storkStyle = 'rgb(204, 204, 204)'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.arc(centerX, centerY, R, Math.PI / 2 - angle / 2, Math.PI / 2 + angle / 2)
  ctx.stroke()
  ctx.closePath()

  ctx.beginPath()
  ctx.storkStyle = 'rgb(204, 204, 204)'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.arc(centerX, centerY, R, Math.PI * 3 / 2 - angle / 2, Math.PI * 3 / 2 + angle / 2)
  ctx.stroke()
  ctx.closePath()

  if (angle > Math.PI - 0.4) {
    direction = -1
  } else if (angle <= 0.4) {
    direction = 1
  }

  angle += speed * direction

  requestID = requestAnimationFrame(() => {
    refreshAnimate()
  })
}

// 下拉动画
const refreshAnimateDown = (range) => {
  let angle = (range / 110) * (range / 110) * Math.PI
  ctx.clearRect(0, 0, refreshCanvasRef.value.width, refreshCanvasRef.value.height)

  ctx.beginPath()
  ctx.storkStyle = 'rgb(204, 204, 204)'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.arc(centerX, centerY, R, Math.PI / 2 - angle / 2, Math.PI / 2 + angle / 2)
  ctx.stroke()
  ctx.closePath()

  ctx.beginPath()
  ctx.storkStyle = 'rgb(204, 204, 204)'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.arc(centerX, centerY, R, Math.PI * 3 / 2 - angle / 2, Math.PI * 3 / 2 + angle / 2)
  ctx.stroke()
  ctx.closePath()
}

watch(() => isRefresh.value, async (newValue, oldValue) => {
  if (newValue) {
    await exploreRefresh()
    changeRefresh(false)
  }
})

onMounted(() => {
  ctx = refreshCanvasRef.value.getContext('2d')
  centerX = refreshCanvasRef.value.width / 2
  centerY = refreshCanvasRef.value.height / 2

  const isTop = () => {
    const t = exploreRef.value.parentNode.parentNode.scrollTop
    return t === 0
  }

  // 下拉刷新
  let startY = 0
  let endY = 0
  let topFlag = false
  exploreRef.value.addEventListener('touchstart', function (e) {
    if (isTop()) {
      topFlag = true
      startY = e.touches[0].pageY
    }
  })
  exploreRef.value.addEventListener('touchmove', function (e) {
    let y = e.touches[0].pageY - startY
    if (topFlag && y > 0) {
      if (y <= 100) {
        refreshRef.value.style.height = y + 'px'
        refreshAnimateDown(y)
      } else {
        refreshRef.value.style.height = '100px'
      }
    }
  })

  exploreRef.value.addEventListener('touchend', async function () {
    if (topFlag) {
      let refreshDivH = refreshRef.value.style.height
      if (refreshDivH.substring(0, refreshDivH.length - 2) / 1 <= 99) {
        refreshRef.value.style.transition = 'all 0.3s linear'
        refreshRef.value.style.height = '0'
        setTimeout(() => {
          refreshRef.value.style.transition = ''
        }, 300)
      } else {
        refreshCanvasRef.value.style.animation = 'refreshAni 1.2s ease infinite'
        refreshAnimate()
        imgCount = 0
        await initData()
        refreshCanvasRef.value.style.animation = ''
        refreshRef.value.style.transition = 'all 0.3s linear'
        refreshRef.value.style.height = '0'
        cancelAnimationFrame(requestID)
        setTimeout(() => {
          refreshRef.value.style.transition = ''
        }, 300)
      }
    }
  })

  exploreRefresh()
})
</script>

<template>
  <LoadPannel @searchMore="searchMore">
    <div ref="refreshRef" class="refresh-div">
      <!--<i class="iconfont icon-loada"></i>-->
      <canvas ref="refreshCanvasRef" width="80" height="80"></canvas>
    </div>
    <div ref="exploreRef">
      <MiniCard v-for="(item, index) in exploreCards" :info="item" :key="index" @onImgLoaded="addImgCount" />
    </div>
  </LoadPannel>
</template>

<style lang="scss" scoped>
.refresh-div {
  height: 0;
  width: 100%;
  overflow: hidden;
  @include flexcc;

  //i {
  //  color: rgb(154, 154, 154);
  //  animation: rotate .8s linear infinite;
  //}
}
</style>
