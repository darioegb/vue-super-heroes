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

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  (event: 'change', value: string): void;
}>();

const { t: translate } = useI18n({ useScope: 'global' });
const filter = ref<string>('');
const handleChange = (value: unknown) => emit('change', String(value));
</script>
