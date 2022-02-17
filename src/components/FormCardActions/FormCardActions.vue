<template>
  <q-card-actions>
    <q-btn
      :label="translate('globals.buttons.save')"
      type="submit"
      color="primary"
    />
    <q-btn
      :label="translate('globals.buttons.reset')"
      type="reset"
      color="primary"
      flat
      class="q-ml-sm"
    />
    <q-btn
      :label="translate('globals.buttons.cancel')"
      type="button"
      color="red"
      @click="goBack"
    />
  </q-card-actions>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t: translate } = useI18n({ inheritLocale: true });

const goBack = () => history.back();
</script>
