<template>
  <q-card-actions>
    <q-btn
      :label="translate('globals.buttons.cancel')"
      type="button"
      color="secondary"
      @click="goBack"
    />
    <q-btn
      :label="translate('globals.buttons.reset')"
      type="reset"
      class="q-ml-sm"
      :disable="isEditOrView"
    />
    <q-btn
      :label="translate('globals.buttons.save')"
      type="submit"
      color="primary"
      :disable="view"
    />
  </q-card-actions>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t: translate } = useI18n({ useScope: 'global' });
const route = useRoute();
const isEditOrView = !!route.params?.id;
const view = !!route.query?.view;
const goBack = () => history.back();
</script>
