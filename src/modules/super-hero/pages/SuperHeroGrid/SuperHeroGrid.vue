<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-table"
      :title="translate('superHeroes.title')"
      :rows="rows"
      :rows-per-page-options="ROWS_PER_PAGE_CONFIG"
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
      <template #top-right>
        <grid-top @change="handleFilterChange" />
      </template>
      <template #no-data>
        <empty-grid :filter="filter" />
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { DEFAULT_PAGE_CONFIG, ROWS_PER_PAGE_CONFIG } from 'src/globals';
import { Column, PageConfig, RequestGrid } from 'src/interfaces';
import { useCustomTranslate } from 'src/composables';
import { GenreEnum } from 'src/enums';
import { SuperHero } from 'src/modules/super-hero/interfaces';
import { GridTableHead, GridItem, GridTop, EmptyGrid } from 'src/components';
import { useSuperHero } from 'src/modules/super-hero/composables';

const $quasar = useQuasar();

const { t: translate } = useI18n({ useScope: 'global' });

const router = useRouter();
const { dropdownTranslate } = useCustomTranslate();
const {
  superHeroes,
  getSuperHeroesPage,
  deleteSuperHero,
  setSelectedSuperHero,
} = useSuperHero();
const rows = ref<SuperHero[]>([]);
const filter = ref<string>('');
const pagination = ref<PageConfig<SuperHero>>(DEFAULT_PAGE_CONFIG);
const columns: ComputedRef<Column<SuperHero>[]> = computed(() => [
  {
    name: 'name',
    align: 'left',
    label: translate('superHeroes.grid.columns.name'),
    field: 'name',
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
]);

onMounted(async () => {
  await onRequest({ pagination: pagination.value, filter: undefined });
});

const handleFilterChange = (value: unknown) => (filter.value = value as string);

const onRequest = async (props: unknown) => {
  const { pagination: newPagination, filter: newFilter } =
    props as RequestGrid<SuperHero>;
  const { page, rowsPerPage, sortBy, descending } = newPagination;
  const count = await getSuperHeroesPage({
    pagination: newPagination,
    filter: newFilter,
  });

  if (!count) return;

  rows.value = superHeroes.value;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  pagination.value.rowsNumber = count;
};

const handlerAddOrEditOrView = (item?: unknown, view?: boolean): void => {
  const superHero = item as SuperHero;
  if (!superHero?.id) return void router.push({ name: 'SuperHeroNew' });
  setSelectedSuperHero(superHero);
  void router.push({
    name: 'SuperHeroDetail',
    params: { id: superHero.id },
    query: view ? { view: String(view) } : undefined,
  });
};

const handlerDelete = async (id: string) => {
  const isError = await deleteSuperHero(id);
  if (isError) return;
  $quasar.notify(
    translate('globals.toasts.remove.success', {
      value: translate('superHeroes.detail.title').toLowerCase(),
    }),
  );
  await onRequest({ pagination: pagination.value, filter: filter.value });
};
</script>
