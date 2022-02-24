<template>
  <section class="app">
    <h1>{{ translate('globals.title') }}</h1>
    <router-view />
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useAxiosLoader } from './composables';

const { t: translate } = useI18n({ inheritLocale: true });
useAxiosLoader();
</script>

<style lang="scss" scoped>
.app {
  padding: 1%;
  h1 {
    font-size: 1.5rem;
    line-height: 1.5rem;
    padding: 0 16px;
  }
}
</style>
