<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-table"
      :rows="rows"
      :rows-per-page-options="rowsPerPageConfig"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :filter="filter"
      @request="onRequest"
    >
      <template #header="props">
        <grid-table-head
          :table-props="props"
          @additem-click="handlerAddOrEditOrView"
        />
      </template>
      <template #body="props">
        <grid-item
          :table-props="props"
          @viewitem-click="handlerAddOrEditOrView"
          @edititem-click="handlerAddOrEditOrView"
          @deleteitem-click="handlerDelete"
        />
      </template>
      <template #top>
        <grid-top @change="handleFilterChange" />
      </template>
      <template #no-data>
        <empty-grid :filter="filter" />
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

import { defaultPageConfig, GenreEnum, rowsPerPageConfig } from '@/constant';
import { Column, PageConfig, RequestGrid } from '@/interfaces';
import { useCustomTranslate } from '@/composables';
import { SuperHero } from '@/modules/super-hero/interfaces';
import { GridTableHead, GridItem, GridTop, EmptyGrid } from '@/components';
import { useSuperHero } from '@/modules/super-hero/composables';

const $quasar = useQuasar();
const { t: translate } = useI18n({ inheritLocale: true });
const router = useRouter();
const { dropdownTranslate } = useCustomTranslate();
const {
  superHeroes,
  getSuperHeroesPage,
  getSuperHeroes,
  deleteSuperHero,
  setSelectedSuperHero,
} = useSuperHero();
const rows = ref<SuperHero[]>([]);
const filter = ref<string>('');
const pagination = ref<PageConfig<SuperHero>>(defaultPageConfig);
const columns: Column<SuperHero>[] = [
  {
    name: 'name',
    align: 'left',
    label: translate('superHeroes.grid.columns.name'),
    field: (row: SuperHero) => row.name,
    sortable: true,
  },
  {
    name: 'genre',
    align: 'center',
    label: translate('superHeroes.grid.columns.genre'),
    field: 'genre',
    sortable: true,
    format: (value) =>
      dropdownTranslate('globals.enums.genres', Number(value), GenreEnum),
  },
  {
    name: 'specialty',
    align: 'left',
    label: translate('superHeroes.grid.columns.specialty'),
    field: 'specialty',
    sortable: true,
    isWrap: true,
  },
  {
    name: 'age',
    label: translate('superHeroes.grid.columns.age'),
    field: 'age',
    sortable: true,
  },
  {
    name: 'height',
    label: translate('superHeroes.grid.columns.height'),
    field: 'height',
    sortable: true,
  },
  {
    name: 'weight',
    label: translate('superHeroes.grid.columns.weight'),
    field: 'weight',
    sortable: true,
  },
  {
    name: 'picture',
    align: 'center',
    label: translate('superHeroes.grid.columns.picture'),
    field: 'picture',
    sortable: false,
    isImg: true,
  },
];

onMounted(() => {
  onRequest({ pagination: pagination.value, filter: undefined });
});

const handleFilterChange = (value: string) => (filter.value = value);

const onRequest = async (props: unknown) => {
  const { pagination: newPagination, filter: newFilter } =
    props as RequestGrid<SuperHero>;
  const { page, rowsPerPage, sortBy, descending } = newPagination;
  const count: number =
    rowsPerPage !== 0
      ? await getSuperHeroesPage({
          pagination: newPagination,
          filter: newFilter,
        })
      : await getSuperHeroes();
  rows.value = superHeroes.value;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  pagination.value.rowsNumber = count;
};

const handlerAddOrEditOrView = (item?: unknown, view?: boolean) => {
  const superHero = item as SuperHero;
  if (!superHero?.id) {
    router.push({ name: 'SuperHeroNew' });
  } else {
    setSelectedSuperHero(superHero);
    router.push({
      name: 'SuperHeroDetail',
      params: { id: superHero.id },
      query: view ? { view: String(view) } : undefined,
    });
  }
};

const handlerDelete = async (id: string) => {
  const status = await deleteSuperHero(id);
  if (!status.ok) {
    $quasar.notify({
      message: translate('superHeroes.toasts.remove.error'),
      type: 'negative',
    });
    return;
  }
  $quasar.notify(translate('superHeroes.toasts.remove.success'));
  onRequest({ pagination: pagination.value, filter: filter.value });
};
</script>
