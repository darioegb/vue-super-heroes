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

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { Column, ObjectIndexer } from '@/interfaces';

export default defineComponent({
  name: 'GridItem',
  props: ['tableProps'],
  emits: ['viewitemClick', 'edititemClick', 'deleteitemClick'],
  setup(_, { emit }) {
    const $quasar = useQuasar();
    const { t: translate } = useI18n({ inheritLocale: true });

    const getRowValue = (
      { format, name }: Column<unknown>,
      row: ObjectIndexer<unknown>,
    ) => (format ? format(row[name]) : row[name] || '-');

    const onViewItemClicked = (row: ObjectIndexer<unknown>) =>
      emit('viewitemClick', row.id, true);

    const onEditItemClicked = (row: ObjectIndexer<unknown>) =>
      emit('edititemClick', row.id);

    const onDeleteItemClicked = (row: ObjectIndexer<unknown>) => {
      $quasar
        .dialog({
          message: translate('globals.dialogs.delete.title', {
            value: row.name,
          }),
          cancel: true,
          persistent: true,
        })
        .onOk(() => emit('deleteitemClick', row.id));
    };

    return {
      getRowValue,
      onViewItemClicked,
      onEditItemClicked,
      onDeleteItemClicked,
    };
  },
});
</script>
