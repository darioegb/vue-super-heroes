<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
    </q-card-section>
    <q-card-section>
      <slot></slot>
    </q-card-section>
    <q-separator dark />
    <form-card-actions />
  </q-card>
</template>

<script setup lang="ts">
import { FormCardActions } from 'src/components';

defineProps<{
  title: string;
}>();
</script>
