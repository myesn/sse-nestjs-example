<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { onUnmounted, ref, watchEffect } from 'vue';

const url = 'http://localhost:3000/api/';
const now = ref('waiting emit ...');
const userId = ref('');
const eventName = ref('user.create');
const eventData = ref('hi');
const isSubscribe = ref(false);
let eventSource: EventSource;

// 组件销毁时需要手动关闭连接，否则 sse 连接不会断开
onUnmounted(() => {
  eventSource && eventSource.close();
});

function handleSubscribeEmit() {
  isSubscribe.value = true;
  eventSource = new EventSource(`${url}sse?userId=${userId.value}`);

  // // type: message
  // eventSource.onmessage = (messageEvent) => {
  //   console.log('message');
  //   now.value = messageEvent.data;
  // };

  eventSource.addEventListener(`*`, function (messageEvent) {
    console.log(`${userId.value}.**`, messageEvent, this);
    now.value = new Date(messageEvent.data).toLocaleString();
  });
}

async function handleClickEmit() {
  await fetch(`${url}sse/emit?userId=${userId.value}&eventName=${eventName.value}&eventData=${eventData.value}`);
}
</script>

<template>
  <div class="container">
    <div class="item">
      <input v-model="userId" autofocus type="text" placeholder="userId" class="space-5" @keypress.enter="handleSubscribeEmit" />
      <input type="button" value="subscribe" :disabled="isSubscribe" @click="handleSubscribeEmit" />
    </div>

    <div class="item margin-top-10">
      <input v-model="eventName" type="text" placeholder="eventName" class="width-78 space-5" />
      <input v-model="eventData" type="text" placeholder="eventData" class="width-78 space-5" />
      <input type="button" value="emit" @click="handleClickEmit" />
    </div>

    <div class="item margin-top-10">server time: {{ now }}</div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
    flex-direction: column;
    align-items: center;
}
.item{
  width: 268px;
  margin-top: 10px;
}

.space-5 {
  margin-right: 5px;
}

.width-78 {
  width: 78px;
}
</style>
