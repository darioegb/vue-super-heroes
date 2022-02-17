<template>
  <q-tr :props="tableProps">
    <q-th v-for="col in tableProps.cols" :key="col.name" :props="tableProps">
      {{ col.label }}
    </q-th>
    <q-th class="text-right">
      <q-btn flat round color="primary" icon="add" @click="onAddItemClicked" />
    </q-th>
  </q-tr>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

import { Column } from '@/interfaces';

defineProps<{
  tableProps: { cols: Column<unknown>[] };
}>();
const emit = defineEmits<{
  (event: 'additemClick'): void;
}>();
const onAddItemClicked = () => emit('additemClick');
</script>
