<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ translate(title) }}</div>
    </q-card-section>
    <q-card-section>
      <slot></slot>
    </q-card-section>
    <q-separator dark />
    <form-card-actions />
  </q-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

import { FormCardActions } from '@/components';

defineProps<{
  title: string;
}>();
const { t: translate } = useI18n({ inheritLocale: true });
</script>
