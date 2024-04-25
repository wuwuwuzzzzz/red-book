<script setup>
import useHooks from '@/hooks/useHooks.js';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import { ref, toRefs } from 'vue';

const { popPara } = toRefs(useHooks.state)
const emits = defineEmits(['goBack'])

let mySwiper = null
let videoData = ref([1, 1, 1])

const onSwiper = (swiper) => {
  mySwiper = swiper
}

let initSlide = ref(0)
let aIndex = ref(0)

const onSlideChange = ({ activeIndex }) => {
  aIndex.value = activeIndex
}

// 返回首页
const goBack = () => {
  emits('goBack')
}
</script>

<template>
  <div class="card-detail">
    <swiper class="my-swiper" @swiper="onSwiper" :direction="'vertical'" @slideChange="onSlideChange"
            :initial-slide="initSlide" :class="{'swiper-no-swiping': swiperLock}">
      <swiper-slide v-for="(item, index) in videoData" :key="index">
        <div class="card-head">
          <i class="iconfont icon-houtui1" @click="goBack"></i>
          <i class="iconfont icon-fenxiang1"></i>
        </div>
        <div class="card-content">
          <div class="video-content">
            <video class="video-source" :src="popPara.info.video"></video>
            <div class="video-controls">
              <i class="iconfont icon-aite"></i>
            </div>
          </div>

          <div class="video-info">
            <div class="video-info-head">
              <img class="card-head-v" :src="popPara.info.avatar" alt="" />
              <div class="card-name">
                {{ popPara.info.author }}
              </div>
              <div class="card-btn-follow">关注</div>
            </div>

            <div class="video-info-word">
              <div class="video-info-pre">
                <div class="video-info-describe" v-html="popPara.info.content ? popPara.info.content.replaceAll('<br/>', '') : popPara.info.title"></div>
              </div>
              <div class="video-info-icon">
                <i class="iconfont icon-aite"></i>
              </div>
            </div>
          </div>

          <div class="video-progress">
            <div class="video-progress-cur"></div>
          </div>
        </div>

        <div class="card-bottom" ref="cardBottomRef">
          <div class="card-saysth">
            <i class="iconfont icon-input"></i>
            <p>发弹幕</p>
          </div>
          <div class="card-sanlian">
            <div>
              <i class="iconfont icon-aixin"></i>
              <p>25</p>
            </div>
            <div>
              <i class="iconfont icon-shoucang"></i>
              <p>145</p>
            </div>
            <div>
              <i class="iconfont icon-pinglun-1"></i>
              <p>67</p>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<style lang="scss" scoped>
.card-detail {
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 1);
  overflow: hidden;
  transition: all .3s linear;

  .my-swiper {
    position: relative;
    width: 100%;
    height: 100%;
    @include flexcc
  }

  .card-head {
    width: calc(100% - 2rem);
    height: 4.5rem;
    overflow: hidden;
    padding: 0 1rem;
    @include flexlr;

    .iconfont {
      font-size: 1.25rem;
      color: rgb(255, 255, 255);
    }
  }

  .card-content {
    position: relative;
    width: 100%;
    height: calc(100% - 9rem);
    @include flexcc;

    .video-content {
      position: relative;
      width: 100%;
      height: 100%;
      @include flexcc;
    }

    .video-source {
      width: 100%;
    }

    .video-controls {
      position: absolute;
      z-index: 130;

      i {
        color: rgba(255, 255, 255, 0.35);
        font-size: 3rem;
      }
    }

    .video-info {
      position: absolute;
      z-index: 200;
      bottom: 0;
      left: .7rem;
      right: .7rem;

      .video-info-head {
        margin: 0 0 1rem;
        @include flexxl;

        .card-head-v {
          width: 1.875rem;
          height: 1.875rem;
          border-radius: 50%;
        }

        .card-name {
          color: rgb(255, 255, 255);
          font-size: 0.875rem;
          margin: 0 0.625rem;
        }

        .card-btn-follow {
          border-radius: 50px;
          background-color: rgb(254, 36, 66);
          color: rgb(255, 255, 255);
          font-size: 0.75rem;
          margin: 0 0.9rem 0 0;
          width: 3.75rem;
          height: 1.5rem;
          @include flexcc;
        }
      }

      .video-info-word {
        padding: 0 0 1rem;
        @include flexlr;

        .video-info-describe {
          font-size: 0.75rem;
          line-height: 1.2rem;
          letter-spacing: 0.05rem;
          color: rgb(255, 255, 255);
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          max-height: 2.4rem;
          width: 80vw;
          transition: all .1s linear;
        }

        .video-tag {
          font-size: 0.75rem;
          line-height: 1.2rem;
          color: rgb(220, 237, 255);
        }

        .video-info-icon {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 1.8rem;
          height: 1.8rem;
          @include flexcc;

          i {
            font-size: 0.75rem;
            color: rgb(220, 237, 255);
          }
        }
      }
    }

    .video-progress {
      position: absolute;
      z-index: 200;
      bottom: 0;
      left: .7rem;
      right: .7rem;
      height: 1px;
      background-color: rgba(255, 255, 255, 0.5);

      .video-progress-cur {
        position: absolute;
        z-index: 165;
        width: 20%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .card-bottom {
    width: calc(100% - 2rem);
    height: 4.5rem;
    overflow: hidden;
    padding: 0 1rem;
    @include flexlr;

    .card-saysth {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 50px;
      width: 40%;
      height: 1.875rem;
      overflow: hidden;
      @include flexl;

      i {
        font-size: 0.625rem;
        color: rgb(153, 153, 153);
        margin: 0 0.5rem 0 0.8rem;
        padding-right: 0.5rem;
        border-right: 1px solid rgb(153, 153, 153);
      }

      p {
        color: rgb(119, 119, 119);
        font-size: 0.6875rem;
        letter-spacing: 1px;
        white-space: nowrap;
      }
    }

    .card-sanlian {
      width: 50%;
      @include flexlr;

      > div {
        @include flexl;

        i {
          font-size: 1.3rem;
          color: rgb(255, 255, 255);
          font-weight: bold;
        }

        p {
          font-size: 0.8rem;
          color: rgb(255, 255, 255);
          margin: 0 0 0 0.3rem;
        }
      }
    }
  }
}
</style>
