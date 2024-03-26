<script setup>
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import useHooks from '@/hooks/useHooks.js';

const { changeRefresh } = useHooks
const router = useRouter()
const menus = router.options.routes
const path = ref('/')

const toPath = (p) => {
  if (path.value === p && p === '/') {
    changeRefresh(true)
  }
  router.push({
    path: p
  })
  path.value = p
}

watch(router.currentRoute.value.path, () => {
  path.value = router.currentRoute.value.path
})
</script>

<template>
  <div class="tab-bar">
    <template v-for="item in menus" :key="item.path" @click="toPath(item.path)">
      <div @click="toPath(item.path)" v-if="item.path === '/publish'" class="tab-pub">
        <i class="iconfont icon-jia"></i>
      </div>
      <div @click="toPath(item.path)" v-else class="tab-name" :class="{ active: item.path === path }">{{ item.name }}</div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.tab-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 3rem;
  @include flexac;
  background-color: #fff;
  font-size: .9rem;
  color: rgb(149, 149, 149);
  z-index: 10;

  .tab-name {
    min-width: 10%;
    text-align: center;
    transition: all .1s linear;

    &.active {
      font-size: 1rem;
      color: rgb(51, 51, 51);
      font-weight: bold;
    }
  }

  .tab-pub {
    width: 3.125rem;
    height: 70%;
    border-radius: 20%;
    background-color: rgb(255, 35, 66);
    @include flexcc;

    i {
      color: #ffffff;
      font-size: 2rem;
    }
  }
}
</style>
