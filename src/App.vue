<script setup>
import useHooks from '@/hooks/useHooks.js';
import TabBar from '@/components/TabBar/index.vue'
import DetailPannel from '@/components/DetailPannel/index.vue'
import { toRefs } from 'vue';

const { isOpenDetail } = toRefs(useHooks.state)
</script>

<template>
  <router-view v-slot="{ Component }">
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </router-view>
  <TabBar />
  <DetailPannel v-if="isOpenDetail" />
</template>

<style scoped lang="scss">

</style>
