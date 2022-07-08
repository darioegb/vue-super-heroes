<template>
  <q-layout>
    <q-header elevated>
      <navbar />
    </q-header>
    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import './config/firebase';
import { useAxiosLoader } from './composables';
import { Navbar } from 'src/components';

useAxiosLoader();
</script>
