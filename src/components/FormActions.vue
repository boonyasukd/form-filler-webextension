<script lang="ts" setup>
import { inject } from 'vue';
import { ABtn } from 'anu-vue';
import { appStateKey } from '../utils';
import { fillForm, reset } from '../actions';

const app = inject(appStateKey)!;
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <ABtn style="flex-grow: 1;" :disabled="!app.guestInfo.firstName" @click="fillForm(app)">
      Fill-in
    </ABtn>
    <ABtn style="flex-grow: 1;" color="danger" :disabled="!app.guestInfo.firstName" @click="reset(app)">
      Reset
    </ABtn>
  </div>
</template>