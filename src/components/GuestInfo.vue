<script lang="ts" setup>
import { inject } from 'vue';
import { ACard } from 'anu-vue';
import { appStateKey } from '../utils';

const app = inject(appStateKey)!;

const labels = {
  docType: 'Document',
  docNum: 'Number',
  firstName: 'First Name',
  lastName: 'Last Name',
  dob: 'DOB',
  alpha2: 'Country',
  issue: 'Issued',
  expiry: 'Expiry',
  sex: 'Sex',
  address: 'Address',
};
</script>

<template>
  <ACard variant="light" color="primary" class="shadow-none">
    <ul class="a-list grid" style="margin: 0;">
      <li v-for="(val, key) in app.guestInfo" :key="key" class="a-list-item flex">
        <div class="gap-2 flex flex-row flex-grow">
          <div class="a-text my-header"><strong>{{ labels[key] }}:</strong></div>
          <div class="a-text my-data">{{ val }}</div>
        </div>
      </li>
    </ul>
  </ACard>
</template>

<style>
.my-header {
  width: 70px;
  text-align: right;
  flex-grow: 0;
}
.my-data {
  text-align: left;
  flex-grow: 1;
}
</style>
