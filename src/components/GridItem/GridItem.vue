<template>
  <q-tr :props="tableProps">
    <q-td v-for="col in tableProps.cols" :key="col.name" :props="tableProps">
      {{ getRowValue(col, tableProps.row) }}
    </q-td>
    <q-td class="text-right">
      <q-btn
        flat
        round
        icon="visibility"
        @click="onViewItemClicked(tableProps.row)"
      />
      <q-btn
        flat
        round
        icon="edit"
        @click="onEditItemClicked(tableProps.row)"
      />
      <q-btn
        flat
        round
        icon="delete"
        @click="onDeleteItemClicked(tableProps.row)"
      />
    </q-td>
  </q-tr>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { Column, ObjectIndexer } from '@/interfaces';

defineProps<{
  tableProps: { cols: Column<unknown>[]; row: ObjectIndexer<unknown> };
}>();
const emit = defineEmits<{
  (event: 'viewitemClick', item: ObjectIndexer<unknown>, view: boolean): void;
  (event: 'edititemClick', item: ObjectIndexer<unknown>): void;
  (event: 'deleteitemClick', id: string): void;
}>();
const $quasar = useQuasar();
const { t: translate } = useI18n({ inheritLocale: true });

const getRowValue = (
  { format, name }: Column<unknown>,
  row: ObjectIndexer<unknown>,
) => (format ? format(row[name]) : row[name] || '-');

const onViewItemClicked = (row: ObjectIndexer<unknown>) =>
  emit('viewitemClick', row, true);

const onEditItemClicked = (row: ObjectIndexer<unknown>) =>
  emit('edititemClick', row);

const onDeleteItemClicked = (row: ObjectIndexer<unknown>) =>
  $quasar
    .dialog({
      message: translate('globals.dialogs.delete.title', {
        value: row.name,
      }),
      cancel: true,
      persistent: true,
    })
    .onOk(() => emit('deleteitemClick', row.id as string));
</script>
