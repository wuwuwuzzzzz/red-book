<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { nextTick, onMounted, reactive, ref } from 'vue';
import Explore from '@/views/Home/Explore.vue';

const moduleList = reactive(['关注', '发现', '附近'])

// 点击切换标题
let moduleIdx = ref(1)
const changeSwiper = (idx) => {
  moduleIdx.value = idx
  mySwiper?.slideTo(idx)
}

// 初始化 swiper
let mySwiper = null
const onSwiper = (swiper) => {
  mySwiper = swiper
};

const onSlideChange = ({ activeIndex }) => {
  moduleIdx.value = activeIndex
};

// 红线-跟随选中的 module 进行平移和拉伸
const redLineRef = ref(null)
const moduleRef = ref(null)

// 计算每个关键位置时，红线的偏移量
let posList = []
const getModuleParams = () => {
  const modules = moduleRef.value.querySelectorAll('span')
  const redLineWidth = redLineRef.value.getBoundingClientRect().width
  for (let i = 0; i < modules.length; i++) {
    let moduleRect = modules[i].getBoundingClientRect()
    posList.push(moduleRect.left + moduleRect.width / 2 - redLineWidth / 2)
  }
}

// 监听滑动过程，使用 progress 计算
const onProgress = ({ progress }) => {
  if (posList.length === 0) {
    return
  }
  // 滑动到最后一个，切已经滑动完毕
  if (progress === 1) {
    redLineRef.value.style.transform = `translateX(${ posList[posList.length - 1] }px)`
    redLineRef.value.children[0].style.transform = `scaleX(1)`
    return
  }
  // 其他情况
  let nowPosIdx = progress * (moduleList.length - 1)
  let nowPosIdxInt = Math.floor(nowPosIdx)
  let trans = (posList[nowPosIdxInt + 1] - posList[nowPosIdxInt]) * (nowPosIdx - nowPosIdxInt) + posList[nowPosIdxInt]

  // 计算滑动过程中的缩放
  let maxScale = 2
  let gap = nowPosIdx - nowPosIdxInt
  let scale = gap <= 0.5 ? gap : 1 - gap
  scale = scale * maxScale + 1

  redLineRef.value.style.transform = `translateX(${ trans }px)`
  redLineRef.value.children[0].style.transform = `scaleX(${ scale })`
}

onMounted(() => {
  getModuleParams()
  onProgress({ progress: moduleIdx.value === 0 ? 0 : moduleIdx.value / (moduleList.length - 1) })
  window.addEventListener('resize', () => {
    nextTick(() => {
      posList = []
      getModuleParams()
    })
  })
})
</script>

<template>
  <div class="home-container">
    <div class="home-swiper-head">
      <i class="iconfont icon-menu"></i>
      <div class="swiper-name" ref="moduleRef">
        <span v-for="(item, idx) in moduleList" @click="changeSwiper(idx)" :class="{active: idx === moduleIdx}">
          {{ item }}
        </span>
        <div class="red-line" ref="redLineRef">
          <div></div>
        </div>
      </div>
      <i class="iconfont icon-search"></i>
    </div>
    <swiper @swiper="onSwiper" @slideChange="onSlideChange" @progress="onProgress" :initial-slide="moduleIdx" class="my-swiper">
      <swiper-slide>
        <div class="slide-content">
          1
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="slide-content">
          <Explore />
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="slide-content">
          3
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<style lang="scss" scoped>
.home-container {

  .my-swiper {
    height: 100vh;
    background-color: rgb(249, 250, 249);

    .slide-content {
      @include flexcc;
      height: 100vh;
    }
  }

  .home-swiper-head {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3rem;
    background-color: #ffffff;
    padding: 0 1rem;
    z-index: 2;
    @include flexbc;

    .iconfont {
      font-size: 1.2rem;
      color: rgb(51, 51, 51);
    }

    .icon-search {
      font-size: 1rem;
    }

    .swiper-name {
      @include flexcc;
      font-size: .9rem;
      color: rgb(149, 149, 149);

      span {
        padding: 0.9375rem;
        box-sizing: content-box;
        transition: all .2s linear;

        &.active {
          //font-size: 1rem;
          color: rgb(51, 51, 51);
          font-weight: bold;
        }
      }

      .red-line {
        position: absolute;
        bottom: .5rem;
        left: 0;
        transition: all .2s linear;

        > div {
          width: 1.875rem;
          height: .1875rem;
          transition: all .2s linear;
          background-color: #ff0000;
          border-radius: 1.875rem;
        }
      }
    }
  }
}
</style>
