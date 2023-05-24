<script lang="ts" setup>
import { inject } from 'vue';
import { AInput } from 'anu-vue';
import { appStateKey } from '../utils';
import GuestInfo from './GuestInfo.vue';
import FormActions from './FormActions.vue';

const app = inject(appStateKey)!;
</script>

<template>
  <div class="grid-row sm:grid-cols-1 place-items-stretch">
    <AInput v-model="app.mrz1" placeholder="MRZ-1" />
    <AInput v-model="app.mrz2" placeholder="MRZ-2" />
    <GuestInfo v-if="app.guestInfo.firstName" />
    <FormActions />
  </div>
</template>
