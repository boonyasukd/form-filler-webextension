<script lang="ts" setup>
import { inject } from 'vue';
import { ABtn } from 'anu-vue';
import { appStateKey } from '../utils';
import { readIdCard } from '../actions';
import GuestInfo from './GuestInfo.vue';
import FormActions from './FormActions.vue';

const app = inject(appStateKey)!;
</script>

<template>
  <div class="grid-row sm:grid-cols-1 place-items-stretch">
    <ABtn :loading="app.loading" @click="readIdCard(app)">Read Card</ABtn>
    <GuestInfo v-if="app.guestInfo.firstName" />
    <FormActions />
  </div>
</template>
