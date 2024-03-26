<script setup>
import { nextTick, ref, toRefs, watch } from 'vue';
import useHooks from '@/hooks/useHooks.js';
import CardDetail from '@/components/CardDetail/index.vue'

const { popPara, isOpenDetail } = toRefs(useHooks.state)
const { changeOpenStatus } = useHooks

const cardSmallRef = ref(null)
const popCardRef = ref(null)
const cardFrameRef = ref(null)
const cardDetailRef = ref(null)

let scaleRate = 1
watch(() => isOpenDetail.value, (newVal, oldVal) => {
  if (newVal) {
    nextTick(() => {
      scaleRate = popPara.value.imgW / document.body.clientWidth
      // small pos
      cardSmallRef.value.style.top = `${ popPara.value.y }px`
      cardSmallRef.value.style.left = `${ popPara.value.x }px`
      cardSmallRef.value.style.width = `${ popPara.value.width }px`
      cardSmallRef.value.style.height = `${ popPara.value.height }px`

      // big pos
      cardFrameRef.value.style.top = `${ popPara.value.y }px`
      cardFrameRef.value.style.left = `${ popPara.value.x }px`
      cardFrameRef.value.style.height = `${ popPara.value.height / scaleRate }px`
      cardFrameRef.value.style.transform = `scale(${ scaleRate })`

      setTimeout(() => {
        popCardRef.value.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'

        // small
        let sh = 100 / (1 / scaleRate)
        cardSmallRef.value.style.opacity = 0
        cardSmallRef.value.style.left = 0
        cardSmallRef.value.style.top = 0
        cardSmallRef.value.style.transform = `scale(${ 1 / scaleRate })`
        cardSmallRef.value.style.height = `${sh}vh`

        // big
        cardFrameRef.value.style.transition = 'all .3s linear'
        cardFrameRef.value.style.transform = 'scale(1)'
        cardFrameRef.value.style.borderRadius = '0px'
        cardFrameRef.value.style.height = `${document.body.clientHeight}px`
        cardFrameRef.value.classList.add('frame-style')
      }, 0)
    })
  }
}, {
  immediate: true
})

// 返回首页
const goBack = () => {
  popCardRef.value.style.backgroundColor = 'rgba(0, 0, 0, 0)'

  cardSmallRef.value.style.opacity = 1
  cardSmallRef.value.style.transform = `scale(1)`
  cardSmallRef.value.style.top = `${ popPara.value.y }px`
  cardSmallRef.value.style.left = `${ popPara.value.x }px`
  cardSmallRef.value.style.width = `${ popPara.value.width }px`
  cardSmallRef.value.style.height = `${ popPara.value.height }px`

  cardFrameRef.value.classList.remove('frame-style')
  cardFrameRef.value.style.top = `${ popPara.value.y }px`
  cardFrameRef.value.style.left = `${ popPara.value.x }px`
  cardFrameRef.value.style.height = `${ popPara.value.height / scaleRate }px`
  cardFrameRef.value.style.transform = `scale(${ scaleRate })`
  cardFrameRef.value.style.opacity = 0
  cardFrameRef.value.style.borderRadius = '8px'

  cardDetailRef.value.cardContentRef.scrollTop = 0
  cardDetailRef.value.cardContentRef.style.height = `${popPara.value.height / scaleRate}px`
  cardDetailRef.value.cardBottomRef.classList.remove('bottom-style')

  setTimeout(() => {
    changeOpenStatus(false)
  }, 300)
}
</script>

<template>
  <div class="popCard" ref="popCardRef">
    <!-- 小卡片 -->
    <div ref="cardSmallRef" class="card-detail-small">
      <div class="card-top">
        <div class="card-tri-bg" v-if="popPara.info.isVideo">
          <svg viewBox="-70 -50 280 300" class="card-svg">
            <polygon points="0,0 0,200 170,100" class="card-tri" stroke-linejoin="round"></polygon>
          </svg>
        </div>
        <img ref="contentImg" :src="popPara.info.imageUrl[0]" class="card-source" alt="" />
      </div>
      <div class="card-title">
        {{ popPara.info.title ? popPara.info.title : popPara.info.content }}
      </div>
      <div class="card-button">
        <div class="card-b-left">
          <img :src="popPara.info.avatar" alt="" class="card-head" />
          <div class="card-name">
            {{ popPara.info.author }}
          </div>
        </div>
        <div class="card-b-right">
          <div class="iconfont icon-aixin icon-card-small"></div>
          <p class="card-like" v-if="popPara.info.likeCount > 0">
            {{ popPara.info.likeCount }}
          </p>
          <p class="card-like" v-else>赞</p>
        </div>
      </div>
    </div>
    <!-- 详情 -->
    <div class="card-detail-frame" ref="cardFrameRef">
      <CardDetail ref="cardDetailRef" @go-back="goBack" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.popCard {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 900;
  overflow: hidden;
  transition: all .5s linear;
  background-color: rgba(0, 0, 0, 0);
}

.card-detail-small {
  //width: 50vw;
  //height: auto;
  //background-color: #fefefe;
  //border-radius: .5rem;
  //box-shadow: 0 .125rem .3125rem rgba(181, 181, 191, 0.1);
  //overflow: hidden;
  //position: absolute;
  position: absolute;
  opacity: 1;
  z-index: 920;
  pointer-events: none;
  height: auto;
  background-color: #fefefe;
  overflow: hidden;
  border-radius: 8px;
  transition: all .3s linear;
  transform-origin: 0 0;

  .card-top {
    position: relative;

    .card-tri-bg {
      position: absolute;
      right: .625rem;
      top: .625rem;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.2);
      @include flexcc;

      .card-svg {
        width: .8rem;
        height: .8rem;

        .card-tri {
          fill: rgb(254, 254, 254);
          stroke: rgb(254, 254, 254);
          stroke-width: 50;
        }
      }
    }

    .card-source {
      width: 100%;
    }
  }

  .card-title {
    width: calc(100% - 1rem);
    font-size: .75rem;
    letter-spacing: .05rem;
    color: rgb(51, 51, 51);
    line-height: 1.125rem;
    padding: 0 .5rem;
    font-weight: 600;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-button {
    padding: .7rem .5rem;
    @include flexlr;

    .card-b-left {
      @include flexxl;

      .card-head {
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;
      }

      .card-name {
        color: rgb(153, 153, 153);
        font-size: .7rem;
        margin: 0 0 0 .4375rem;
      }
    }

    .card-b-right {
      @include flexxl;

      .icon-card-small {
        font-size: .7rem;
        color: rgb(153, 153, 153);
      }

      .card-like {
        margin: 0 0 0 .2rem;
        color: rgb(153, 153, 153);
        font-size: .7rem;
      }
    }
  }
}

.card-detail-frame {
  overflow: hidden;
  position: absolute;
  z-index: 950;
  height: 100vh;
  width: 100vw;
  border-radius: 8px;
  transform-origin: 0 0;
  opacity: 0;
}

.frame-style {
  opacity: 1 !important;
  top: 0 !important;
  left: 0 !important;
}
</style>
