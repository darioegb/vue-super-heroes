<template>
  <div class="row">
    <div class="col">
      <q-file
        :model-value="picture"
        :readonly="view"
        accept="image/*"
        :label="translate('globals.detail.fileupload')"
        outlined
        :error="validation.$error"
        :error-message="validation.$errors[0]?.$message.toString()"
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
            {{ translate('globals.detail.previewCardTitle') }}
          </p>
        </q-card-section>
        <q-card class="picture">
          <q-img
            spinner-color="blue"
            fit="scale-down"
            :src="previewPicture || require('assets/img/no-image.png')"
          />
        </q-card>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  uploadBytesResumable,
  getDownloadURL,
  StorageReference,
} from 'firebase/storage';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { fileToBase64String, fileRef, fileName } from 'src/utils';
import { Validation } from 'src/interfaces';

const $quasar = useQuasar();

const props = defineProps<{
  isUploading: boolean;
  validation: Validation;
  seletedItemPicture?: string;
  picture?: File;
  view?: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:picture', file: File): void;
  (event: 'downloadUrlChange', downloadURL: string): void;
}>();

const { t: translate } = useI18n({ useScope: 'global' });
const previewPicture = ref<string>(props.seletedItemPicture || '');
const uploadProgress = ref<number>(0);

const unwatch = watch(
  () => props.isUploading,
  (value) => value && uploadFile(),
);

const handleChange = async (file: File) => {
  previewPicture.value = await fileToBase64String(file);
  emit('update:picture', file);
  props.validation.$touch();
};

const uploadFile = () => {
  const file = props.picture;
  if (!file) return;
  const uploadTask = uploadBytesResumable(fileRef(fileName()), file);
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      uploadProgress.value = snapshot.bytesTransferred / snapshot.totalBytes;
    },
    () => {
      $quasar.notify({
        message: translate('globals.toasts.imageError'),
        type: 'negative',
      });
    },
    () => void handleFileUpload(uploadTask.snapshot.ref),
  );
};

const handleFileUpload = async (ref: StorageReference) => {
  const downloadURL = await getDownloadURL(ref);
  unwatch();
  emit('downloadUrlChange', downloadURL);
};
</script>
<style lang="scss" scoped>
.col {
  margin: 0.5rem !important;
}
.picture {
  max-height: 22rem;
  div {
    max-height: 20rem;
  }
  padding-block-end: 1rem;
}
</style>
