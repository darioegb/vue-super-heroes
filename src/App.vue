<template>
  <router-view />
</template>

<script setup lang="ts">
import './config/firebase';
import { useAxiosLoader } from './composables';

useAxiosLoader();
</script>
