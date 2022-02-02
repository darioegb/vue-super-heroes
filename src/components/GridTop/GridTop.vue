<template>
  <q-input
    outlined
    dense
    debounce="300"
    class="full-width"
    v-model="filter"
    :label="translate('globals.grid.filterInput.label')"
    :placeholder="translate('globals.grid.filterInput.placeholder')"
    @update:model-value="handleChange"
  >
    <template #append>
      <q-icon name="search" />
    </template>
  </q-input>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'GridTop',
  emits: ['change'],
  setup(_, { emit }) {
    const { t: translate } = useI18n({ inheritLocale: true });
    const filter = ref<string>('');
    const handleChange = (value: string) => emit('change', value);

    return {
      filter,
      handleChange,
      translate,
    };
  },
});
</script>
