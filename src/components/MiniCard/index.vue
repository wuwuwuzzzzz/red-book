<script setup>
import { ref, toRefs, watch } from 'vue';
import useHooks from '@/hooks/useHooks.js';

const props = defineProps(['info'])
const emits = defineEmits(['onImgLoaded'])

const { popPara, isOpenDetail } = toRefs(useHooks.state)
const { changeOpenStatus } = useHooks

const contentTab = ref(null)
const contentImg = ref(null)

function handleClick(_this) {
  popPara.value = {
    x: _this.$el.getBoundingClientRect().x,
    y: _this.$el.getBoundingClientRect().y,
    width: _this.$el.getBoundingClientRect().width,
    height: _this.$el.getBoundingClientRect().height,
    imgH: contentImg.value.height,
    imgW: contentImg.value.width
  }
  popPara.value.info = props.info
  changeOpenStatus(true)
  contentTab.value.style.opacity = 0
}

watch(() => isOpenDetail.value, (newVal, oldVal) => {
  if (!newVal) {
    contentTab.value.style.opacity = 1
  }
})
</script>

<template>
  <div ref="contentTab" class="card-content" @click="handleClick(this)">
    <div class="card-top">
      <div class="card-tri-bg" v-if="props.info.isVideo">
        <svg viewBox="-70 -50 280 300" class="card-svg">
          <polygon points="0,0 0,200 170,100" class="card-tri" stroke-linejoin="round"></polygon>
        </svg>
      </div>
      <img ref="contentImg" :src="props.info.imageUrl[0]" class="card-source" alt="" @load="emits('onImgLoaded')" />
    </div>
    <div class="card-title">
      {{ props.info.title ? props.info.title : props.info.content }}
    </div>
    <div class="card-button">
      <div class="card-b-left">
        <img :src="props.info.avatar" alt="" class="card-head" />
        <div class="card-name">
          {{ props.info.author }}
        </div>
      </div>
      <div class="card-b-right">
        <div class="iconfont icon-aixin icon-card-small"></div>
        <p class="card-like" v-if="props.info.likeCount > 0">
          {{ props.info.likeCount }}
        </p>
        <p class="card-like" v-else>赞</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-content {
  width: 50vw;
  height: auto;
  background-color: #fefefe;
  border-radius: .5rem;
  box-shadow: 0 .125rem .3125rem rgba(181, 181, 191, 0.1);
  overflow: hidden;
  position: absolute;

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
      min-height: 9rem;
      max-height: 16rem;
      object-fit: cover;
      object-position: center;
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
        font-weight: bold;
      }

      .card-like {
        margin: 0 0 0 .2rem;
        color: rgb(153, 153, 153);
        font-size: .7rem;
      }
    }
  }
}
</style>
