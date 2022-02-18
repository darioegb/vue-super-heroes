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
            @blur="v$.name.$touch"
            v-uppercase
          />
        </div>
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
      </div>
      <div class="row">
        <div class="col">
          <q-input
            filled
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
            :hint="translate('superHeroes.detail.form.weightPlaceholder')"
            :error-message="v$.weight.$errors[0]?.$message.toString()"
            :error="v$.weight.$error"
            @blur="v$.weight.$touch"
          />
        </div>
      </div>
    </form-card>
  </form>
</template>

<script setup lang="ts">
import { defineProps, reactive, computed, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { useQuasar } from 'quasar';

import {
  required,
  maxLength,
  minLength,
  minValue,
  convertEnumToKeyValueArray,
} from '@/utils';
import { GenreEnum, httpMethodKeys } from '@/constant';
import { useCustomTranslate } from '@/composables';
import { SuperHero, SuperHeroForm } from '@/modules/super-hero/interfaces';
import { useSuperHero } from '@/modules/super-hero/composables';
import FormCard from '@/components/FormCard/FormCard.vue';
import { Option } from '@/interfaces';

const props = defineProps<{
  id?: string;
  view?: boolean;
}>();
const $quasar = useQuasar();
const { t: translate } = useI18n({ inheritLocale: true });
const { dropdownTranslate } = useCustomTranslate();
const { selectedSuperHero, updateSuperHero, createSuperHero } = useSuperHero();
const genres = convertEnumToKeyValueArray(GenreEnum);
const selectedItem = selectedSuperHero.value;

const initialState = () => ({
  name: '',
  genre: undefined,
  specialty: '',
  age: undefined,
  height: undefined,
  weight: undefined,
});

const getGenreByValue = (value: string | GenreEnum): Option =>
  genres.find((g) => g.value === value) || genres[0];

const state = reactive<SuperHeroForm>(
  props.id && selectedItem
    ? {
        ...selectedItem,
        genre: getGenreByValue(selectedItem.genre),
      }
    : initialState(),
);
const { name, genre, specialty, age, height, weight } = toRefs(state);

const rules = computed(() => ({
  name: { required, minLength: minLength(1), maxLength: maxLength(10) },
  genre: { required },
  specialty: {
    required,
    minLength: minLength(10),
    maxLength: maxLength(250),
  },
  age: { minValue: minValue(1) },
  height: { minValue: minValue(1) },
  weight: { minValue: minValue(1) },
}));

const v$ = useVuelidate(rules, state);

const onSubmit = async () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;
  const isNew = !selectedItem?.id;
  const actionType = isNew ? httpMethodKeys.post : httpMethodKeys.put;
  const data: SuperHero = {
    ...state,
    id: selectedItem?.id,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    genre: +state.genre!.value,
  };
  const status = isNew
    ? await createSuperHero(data)
    : await updateSuperHero(data);

  if (!status.ok) {
    $quasar.notify({
      message: translate(`superHeroes.toasts.${actionType}.error`),
      type: 'negative',
    });
    return;
  }
  $quasar.notify(translate(`superHeroes.toasts.${actionType}.success`));
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
