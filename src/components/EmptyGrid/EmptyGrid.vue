<template>
  <q-icon name="warning" size="sm" class="q-mr-sm" />
  {{ translate('globals.grid.noMatchingDataText', { value: filter }) }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'EmptyGrid',
  props: {
    filter: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { t: translate } = useI18n({ inheritLocale: true });
    return {
      translate,
    };
  },
});
</script>
