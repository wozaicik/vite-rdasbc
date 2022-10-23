<template>
    <div id="cesiumContainer" ref="target">
        <ShowCoor
        :elementX="elementX"
        :elementY="elementY"
        :isOutside="isOutside"
        >
        </ShowCoor>
    </div>

</template>

<script setup>
import ShowCoor from '@/components/show-coor.vue'
import { onMounted, ref } from 'vue'

import { useMouseInElement } from '@vueuse/core'

import initViewer from './viewer'

// 当DOM加载完成时，初始化viewer
onMounted(() => {
  initViewer()
})

// 绑定DOM元素
const target = ref(null)
// 使用vueUse函数库，获得鼠标在元素的坐标值
const { elementX, elementY, isOutside } = useMouseInElement(target)

</script>

<style lang="scss" scoped>

#cesiumContainer{
    widows: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    position: relative;
}

</style>
