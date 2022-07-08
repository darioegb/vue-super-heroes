<template>
  <q-toolbar class="navbar">
    <h1>{{ translate('globals.title') }}</h1>
    <q-select
      v-model="lang"
      :options="langOptions"
      outlined
      dense
      borderless
      emit-value
      map-options
      options-dense
    />
  </q-toolbar>
</template>

<script setup lang="ts">
import { QuasarLanguage, useQuasar } from 'quasar';
import { ref, watch } from 'vue';
import languages from 'quasar/lang/index.json';
import { useI18n } from 'vue-i18n';

const appLanguages = languages.filter((lang) =>
  ['es', 'en-US'].includes(lang.isoName),
);
const langOptions = appLanguages.map((lang) => ({
  label: lang.nativeName,
  value: lang.isoName,
}));

const $q = useQuasar();
const lang = ref($q.lang.isoName);
const { t: translate, locale } = useI18n({ useScope: 'global' });

watch(lang, async (val) => {
  // dynamic import, so loading on demand only
  const lang = (await import('quasar/lang/' + val)) as {
    default: QuasarLanguage;
  };
  locale.value = val;
  $q.lang.set(lang.default);
});
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  h1 {
    font-size: 1.5rem;
    line-height: 1.5rem;
    padding: 0 16px;
  }
}
</style>
