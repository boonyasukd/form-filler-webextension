<script lang="ts" setup>
import { inject } from 'vue';
import { ABtn, ATextarea } from 'anu-vue';
import { appStateKey } from '../utils';
import { generatePdf, openPdfInNewTab } from '../actions';

const app = inject(appStateKey)!;
</script>

<template>
  <div class="grid-row sm:grid-cols-1 place-items-stretch">
    <ATextarea v-model="app.selectedText" auto-size />
    <ABtn :loading="app.loading" :disabled="app.selectedText.length === 0" @click="generatePdf(app)">
      Generate
    </ABtn>
    <ABtn v-if="app.fileURL" color="success" @click="openPdfInNewTab(app)">
      Open
    </ABtn>
  </div>
</template>
