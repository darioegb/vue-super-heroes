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
      class="q-ml-sm"
      :disable="isEditOrView"
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
import { useRoute } from 'vue-router';

const { t: translate } = useI18n({ inheritLocale: true });
const route = useRoute();
const isEditOrView = !!route.params?.id;

const goBack = () => history.back();
</script>
