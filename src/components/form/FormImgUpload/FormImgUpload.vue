<template>
  <div class="row">
    <div class="col">
      <q-file
        :model-value="picture"
        :readonly="view"
        accept="image/*"
        :label="translate('superHeroes.grid.columns.picture')"
        outlined
        @update:model-value="handleChange"
      >
        <template #file>
          <q-linear-progress
            v-if="uploadProgress > 0 && uploadProgress < 100"
            :value="uploadProgress"
          />
        </template>
        <template #prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
    </div>
    <div class="col">
      <q-card>
        <q-card-section>
          <p class="text-h6 text-center">
            {{ translate('superHeroes.detail.previewCardTitle') }}
          </p>
        </q-card-section>
        <q-card class="picture">
          <q-img
            spinner-color="blue"
            fit="scale-down"
            :src="previewPicture || require('@/assets/img/no-image.png')"
          />
        </q-card>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import { uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useI18n } from 'vue-i18n';

import { fileToBase64String, fileRef, fileName } from '@/utils';

const props = defineProps<{
  isUploading: boolean;
  seletedItemPicture?: string;
  picture?: File;
  view?: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:picture', file: File): void;
  (event: 'downloadUrlChange', downloadURL: string): void;
}>();

const { t: translate } = useI18n({ inheritLocale: true });
const previewPicture = ref<string>(props.seletedItemPicture || '');
const uploadProgress = ref<number>(0);

const unwatch = watch(
  () => props.isUploading,
  (value) => value && uploadFile(),
);

const handleChange = async (file: File) => {
  previewPicture.value = await fileToBase64String(file);
  emit('update:picture', file);
};

const uploadFile = async () => {
  const file = props.picture;
  if (!file) return;
  const uploadTask = uploadBytesResumable(fileRef(fileName()), file);
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      uploadProgress.value = snapshot.bytesTransferred / snapshot.totalBytes;
    },
    (error) => {
      console.log(error);
    },
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      unwatch();
      emit('downloadUrlChange', downloadURL);
    },
  );
};
</script>
<style lang="scss" scoped>
.col {
  margin: 0.5rem !important;
}
</style>
