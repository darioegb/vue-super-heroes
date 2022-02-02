<template>
  <q-tr :props="tableProps">
    <q-th v-for="col in tableProps.cols" :key="col.name" :props="tableProps">
      {{ col.label }}
    </q-th>
    <q-th class="text-right">
      <q-btn flat round color="primary" icon="add" />
    </q-th>
  </q-tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GridTableHead',
  props: ['tableProps'],
});
</script>
