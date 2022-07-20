<template>
  <form
    @submit.prevent="onSubmit"
    @reset.prevent="onReset"
    class="q-gutter-md"
    novalidate
  >
    <form-card title="superHeroes.detail.title">
      <div class="row">
        <div class="col">
          <q-input
            filled
            v-model="name"
            :readonly="view"
            :label="translate('superHeroes.grid.columns.name')"
            :hint="translate('superHeroes.detail.form.namePlaceholder')"
            :error-message="v$.name.$errors[0]?.$message.toString()"
            :error="v$.name.$error"
            v-uppercase
            @blur="v$.name.$touch"
          />
        </div>
        <div class="col">
          <q-input
            filled
            type="number"
            v-model.number="age"
            :readonly="view"
            :label="translate('superHeroes.grid.columns.age')"
            :hint="translate('superHeroes.detail.form.agePlaceholder')"
            :error-message="v$.age.$errors[0]?.$message.toString()"
            :error="v$.age.$error"
            @blur="v$.age.$touch"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-select
            filled
            v-model="genre"
            :readonly="view"
            :options="genres"
            :label="translate('superHeroes.grid.columns.genre')"
            :option-label="
              (opt) =>
                dropdownTranslate(
                  'globals.enums.genres',
                  Number(opt.value),
                  GenreEnum,
                )
            "
            :error-message="v$.genre.$errors[0]?.$message.toString()"
            :error="v$.genre.$error"
            @blur="v$.genre.$touch"
          />
        </div>
        <div class="col">
          <q-input
            filled
            autogrow
            counter
            type="textarea"
            v-model="specialty"
            :readonly="view"
            :label="translate('superHeroes.grid.columns.specialty')"
            :hint="translate('superHeroes.detail.form.specialtyPlaceholder')"
            :error-message="v$.specialty.$errors[0]?.$message.toString()"
            :error="v$.specialty.$error"
            @blur="v$.specialty.$touch"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-input
            filled
            type="number"
            v-model.number="height"
            :readonly="view"
            :label="translate('superHeroes.grid.columns.height')"
            :hint="translate('superHeroes.detail.form.heightPlaceholder')"
            :error-message="v$.height.$errors[0]?.$message.toString()"
            :error="v$.height.$error"
            @blur="v$.height.$touch"
          />
        </div>
        <div class="col">
          <q-input
            filled
            type="number"
            v-model.number="weight"
            :readonly="view"
            :label="translate('superHeroes.grid.columns.picture')"
            :error-message="v$.weight.$errors[0]?.$message.toString()"
            :error="v$.weight.$error"
            @blur="v$.weight.$touch"
          />
        </div>
      </div>
      <form-img-upload
        :is-uploading="isUploading"
        :seleted-item-picture="selectedItem?.picture"
        v-model:picture="picture"
        :view="view"
        :validation="v$.picture"
        @download-url-change="saveOrUpdate($event)"
      />
    </form-card>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed, ref, toRefs } from 'vue';

import useVuelidate from '@vuelidate/core';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import {
  required,
  maxLength,
  minLength,
  minValue,
  convertEnumToKeyValueArray,
  fileSize,
} from 'src/utils';
import {
  defaultFormControlSizes,
  GenreEnum,
  httpMethodKeys,
} from 'src/constant';
import { useCustomTranslate } from 'src/composables';
import { SuperHero, SuperHeroForm } from 'src/modules/super-hero/interfaces';
import { useSuperHero } from 'src/modules/super-hero/composables';
import { Option } from 'src/interfaces';
import { FormCard, FormImgUpload } from 'src/components';

const props = defineProps<{
  id?: string;
  view?: boolean;
}>();
const $quasar = useQuasar();
const { t: translate } = useI18n({ useScope: 'global' });
const { dropdownTranslate } = useCustomTranslate();
const { selectedSuperHero, updateSuperHero, createSuperHero } = useSuperHero();
const genres = convertEnumToKeyValueArray(GenreEnum);
const selectedItem = selectedSuperHero.value;
const isUploading = ref<boolean>(false);
const { text, number, textarea } = defaultFormControlSizes;

const initialState = () => ({
  name: '',
  genre: undefined,
  specialty: '',
  age: undefined,
  height: undefined,
  picture: undefined,
  weight: undefined,
});

const getGenreByValue = (value: string | GenreEnum): Option =>
  genres.find((g) => g.value === value) || genres[0];

const state = reactive<SuperHeroForm>(
  props.id && selectedItem
    ? {
        ...selectedItem,
        genre: getGenreByValue(selectedItem.genre),
        picture: undefined,
      }
    : initialState(),
);
const { name, genre, specialty, age, height, picture, weight } = toRefs(state);
const rules = computed(() => ({
  name: {
    required,
    minLength: minLength(text.min),
    maxLength: maxLength(text.max),
  },
  genre: { required },
  specialty: {
    required,
    minLength: minLength(textarea.min),
    maxLength: maxLength(textarea.max),
  },
  age: { minValue: minValue(number.min) },
  height: { minValue: minValue(number.min) },
  weight: { minValue: minValue(number.min) },
  picture: {
    fileSize,
  },
}));
const v$ = useVuelidate(rules, state, { $lazy: true });

const onSubmit = () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;
  if (picture?.value) {
    isUploading.value = true;
  } else {
    void saveOrUpdate();
  }
};

const saveOrUpdate = async (downloadURL?: string) => {
  const toastParam = translate('superHeroes.detail.title').toLowerCase();
  const isNew = !selectedItem?.id;
  const actionType = isNew ? httpMethodKeys.post : httpMethodKeys.put;
  const data: SuperHero = {
    ...state,
    id: selectedItem?.id,
    picture: downloadURL ? downloadURL : selectedItem?.picture,
    genre: (state.genre && +state.genre.value) || GenreEnum.Male,
  };
  const isError = isNew
    ? await createSuperHero(data)
    : await updateSuperHero(data);

  $quasar.notify(
    isError
      ? {
          message: translate(`globals.toasts.${actionType}.error`, {
            value: toastParam,
          }),
          type: 'negative',
        }
      : translate(`globals.toasts.${actionType}.success`, {
          value: toastParam,
        }),
  );
  history.back();
};

const onReset = () => {
  v$.value.$reset();
  Object.assign(state, initialState());
};
</script>

<style lang="scss" scoped>
form {
  margin-block-start: 1rem;
  .col {
    margin: 0.5rem;
  }
}
</style>
