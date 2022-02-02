<template>
  <q-tr :props="tableProps">
    <q-td v-for="col in tableProps.cols" :key="col.name" :props="tableProps">
      {{ getRowValue(col) }}
    </q-td>
    <q-td class="text-right">
      <q-btn flat round icon="visibility" />
      <q-btn flat round icon="edit" />
      <q-btn flat round icon="delete" />
    </q-td>
  </q-tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { Column } from '@/interfaces';

export default defineComponent({
  name: 'GridItem',
  props: ['tableProps'],
  setup(props) {
    const getRowValue = ({ format, name }: Column<unknown>) =>
      format
        ? format(props.tableProps.row[name])
        : props.tableProps.row[name] || '-';

    return { getRowValue };
  },
});
</script>
