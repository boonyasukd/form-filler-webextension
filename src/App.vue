<script setup lang="ts">
import { ref, reactive, provide, watch } from 'vue';
import { ATabs, ACard } from 'anu-vue';
import { appStateKey } from './utils';
import { useLocalStorage } from './compositions/local-storage';
import TabThaiID from './components/TabThaiID.vue';
import TabPassport from './components/TabPassport.vue';
import TabPDF from './components/TabPDF.vue';

const tabs = ref([
  { title: 'Thai ID',  icon: 'i-bx-id-card' },
  { title: 'Passport', icon: 'i-bx-globe' },
  { title: 'Regist.',  icon: 'i-bx-printer' },
]);

const app: AppState = reactive({
  guestInfo: {},
  loading: false,
  selectedText: '',
  mrz1: '',
  mrz2: '',
  activeTab: 0,
  fileURL: '',
});
useLocalStorage(app);
provide(appStateKey, app);

watch(() => app.activeTab, (_, oldTab) => {
  if (oldTab === 0) {
    console.log('navigate away from Thai ID tab.');
    app.guestInfo = {};
  } else if (oldTab === 1) {
    console.log('navigate away from Passport tab.');
    app.mrz1 = '';
    app.mrz2 = '';
  } else {
    console.log('navigate away from Regist. tab.');
    app.selectedText = '';
  }
});
</script>

<template>
  <ACard>
    <ATabs v-model="app.activeTab" :tabs="tabs" class="a-tabs-bordered" transition="view-next">
      <template #0>
        <div class="a-card-body">
          <TabThaiID />
        </div>
      </template>
      <template #1>
        <div class="a-card-body">
          <TabPassport />
        </div>
      </template>
      <template #2>
        <div class="a-card-body">
          <TabPDF />
        </div>
      </template>
    </ATabs>
  </ACard>
</template>

<style>
.grid-row {
  gap: 0.75rem;
  grid-gap: 0.75rem;
}

.my-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.gap-2 {
  gap: 0.5rem;
  grid-gap: 0.5rem;
}

.a-list-item {
  min-height: 1.5rem;
}
</style>
