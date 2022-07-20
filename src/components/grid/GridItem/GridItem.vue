<template>
  <q-tr :props="tableProps">
    <q-td
      v-for="col in tableProps.cols"
      :key="col.name"
      :props="tableProps"
      :class="{ wrap: col.isWrap }"
    >
      <span v-if="!col.isImg">
        {{ getRowValue(col, tableProps.row) }}
      </span>
      <q-img
        v-else
        spinner-color="blue"
        fit="scale-down"
        :src="
          tableProps.row[col.name] || require('src/assets/img/no-image.png')
        "
      />
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
        color="primary"
        @click="onEditItemClicked(tableProps.row)"
      />
      <q-btn
        flat
        round
        icon="delete"
        color="negative"
        @click="onDeleteItemClicked(tableProps.row)"
      />
    </q-td>
  </q-tr>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { Column } from 'src/interfaces';

defineProps<{
  tableProps: { cols: Column<unknown>[]; row: Record<string, unknown> };
}>();
const emit = defineEmits<{
  (event: 'viewitemClick', item: Record<string, unknown>, view: boolean): void;
  (event: 'edititemClick', item: Record<string, unknown>): void;
  (event: 'deleteitemClick', id: string): void;
}>();
const $quasar = useQuasar();

const { t: translate } = useI18n({ useScope: 'global' });

const getRowValue = (
  { format, name }: Column<unknown>,
  row: Record<string, unknown>,
): unknown => (format ? format(row[name]) : row[name] || '-');

const onViewItemClicked = (row: Record<string, unknown>) =>
  emit('viewitemClick', row, true);

const onEditItemClicked = (row: Record<string, unknown>) =>
  emit('edititemClick', row);

const onDeleteItemClicked = (row: Record<string, unknown>) =>
  $quasar
    .dialog({
      message: translate('globals.dialogs.delete.title', {
        value: row.name,
      }),
      cancel: true,
      persistent: true,
    })
    .onOk(() => onConfirmDeleteItem(row.id as string));

const onConfirmDeleteItem = (id: string) => emit('deleteitemClick', id);
</script>
