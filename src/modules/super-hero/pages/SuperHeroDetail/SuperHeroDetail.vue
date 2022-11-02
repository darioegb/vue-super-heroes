<template>
  <form
    @submit.prevent="onSubmit"
    @reset.prevent="onReset"
    class="q-gutter-md form-container"
    novalidate
  >
    <form-card :title="translate('superHeroes.detail.title')">
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
            :label="translate('superHeroes.grid.columns.weight')"
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
import { DEFAULT_FORM_CONTROL_SIZES, HTTP_METHOD_KEYS } from 'src/globals';
import { GenreEnum } from 'src/enums';
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
        ...initialState(),
        ...selectedItem,
        genre: getGenreByValue(selectedItem.genre),
        picture: undefined,
      }
    : initialState(),
);
const { name, genre, specialty, age, height, picture, weight } = toRefs(state);
const rules = computed(() => {
  const {
    text: { max: textMax, min: textMin },
    number: { min: numberMin },
    textarea: { max: textareaMax, min: textareaMin },
  } = DEFAULT_FORM_CONTROL_SIZES;
  return {
    name: {
      required,
      minLength: minLength(textMin),
      maxLength: maxLength(textMax),
    },
    genre: { required },
    specialty: {
      required,
      minLength: minLength(textareaMin),
      maxLength: maxLength(textareaMax),
    },
    age: { minValue: minValue(numberMin) },
    height: { minValue: minValue(numberMin) },
    weight: { minValue: minValue(numberMin) },
    picture: {
      fileSize,
    },
  };
});
const v$ = useVuelidate(rules, state as never, { $lazy: true });

const onSubmit = () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;
  if (!picture?.value) void saveOrUpdate();
  isUploading.value = true;
};

const saveOrUpdate = async (downloadURL?: string) => {
  const isNew = !selectedItem?.id;
  const data: SuperHero = {
    ...state,
    id: selectedItem?.id,
    picture: downloadURL ? downloadURL : selectedItem?.picture,
    genre: (state.genre && +state.genre.value) || GenreEnum.Male,
  };
  const isError = isNew
    ? await createSuperHero(data)
    : await updateSuperHero(data);

  !isError &&
    $quasar.notify(
      translate(
        `globals.toasts.${
          isNew ? HTTP_METHOD_KEYS.post : HTTP_METHOD_KEYS.put
        }.success`,
        {
          value: translate('superHeroes.detail.title').toLowerCase(),
        },
      ),
    );
  history.back();
};

const onReset = () => {
  v$.value.$reset();
  Object.assign(state, initialState());
};
</script>
