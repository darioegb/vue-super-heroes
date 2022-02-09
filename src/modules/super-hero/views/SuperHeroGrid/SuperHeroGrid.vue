<template>
  <div class="q-pa-md">
    <q-table
      :rows="rows"
      :rows-per-page-options="rowsPerPageConfig"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :filter="filter"
      @request="onRequest"
    >
      <template #header="props">
        <GridTableHead
          :table-props="props"
          @additem-click="handlerAddOrEditOrView"
        />
      </template>
      <template #body="props">
        <GridItem
          :table-props="props"
          @viewitem-click="handlerAddOrEditOrView"
          @edititem-click="handlerAddOrEditOrView"
          @deleteitem-click="handlerDelete"
        />
      </template>
      <template #top>
        <GridTop @change="handleFilterChange" />
      </template>
      <template #no-data>
        <EmptyGrid :filter="filter" />
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { defaultPageConfig, GenreEnum, rowsPerPageConfig } from '@/constant';
import { Column, PageConfig, RequestGrid } from '@/interfaces';
import { useCustomTranslate } from '@/hooks';
import { SuperHero } from '@/modules/super-hero/interfaces';
import { GridTableHead, GridItem, GridTop, EmptyGrid } from '@/components';
import { useSuperHero } from '@/modules/super-hero/hooks';

export default defineComponent({
  name: 'SuperHeroGrid',
  components: { GridTableHead, GridItem, GridTop, EmptyGrid },
  setup() {
    const { t: translate } = useI18n({ inheritLocale: true });
    const router = useRouter();
    const { dropdownTranslate } = useCustomTranslate();
    const { superHeroes, getSuperHeroesPage, getSuperHeroes, deleteSuperHero } =
      useSuperHero();
    const rows = ref<SuperHero[]>([]);
    const filter = ref<string>('');
    const pagination = ref<PageConfig<SuperHero>>(defaultPageConfig);
    const columns: Column<SuperHero>[] = [
      {
        name: 'name',
        label: translate('superHeroes.grid.columns.name'),
        field: (row: SuperHero) => row.name,
        align: 'left',
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
        label: translate('superHeroes.grid.columns.specialty'),
        field: 'specialty',
        sortable: true,
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
    ];

    onMounted(() => {
      onRequest({ pagination: pagination.value, filter: undefined });
    });

    const handleFilterChange = (value: string) => (filter.value = value);

    const onRequest = async (props: RequestGrid<SuperHero>) => {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const count: number =
        rowsPerPage !== 0
          ? await getSuperHeroesPage({
              pagination: props.pagination,
              filter: props.filter,
            })
          : await getSuperHeroes();
      rows.value = superHeroes.value;
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;
      pagination.value.rowsNumber = count;
    };

    const handlerAddOrEditOrView = (id?: string, view?: string) => {
      if (!id) {
        router.push({ name: 'SuperHeroNew' });
      } else {
        router.push({
          name: 'SuperHeroDetail',
          params: { id },
          query: view ? { view } : undefined,
        });
      }
    };
    const handlerDelete = async (id: string) => {
      await deleteSuperHero(id);
      onRequest({ pagination: pagination.value, filter: filter.value });
    };

    return {
      rowsPerPageConfig,
      filter,
      columns,
      pagination,
      rows,
      onRequest,
      translate,
      handleFilterChange,
      handlerAddOrEditOrView,
      handlerDelete,
    };
  },
});
</script>
