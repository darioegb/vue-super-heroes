import { ComponentPublicInstance } from 'vue';
import { describe, expect, it, beforeAll, jest } from '@jest/globals';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { Dialog } from 'quasar';

import { Column } from 'src/interfaces';
import GridItem from './GridItem.vue';
import i18n from 'src/config/i18n';

installQuasarPlugin({
  plugins: {
    Dialog,
  },
});

const StubParentComponent = {
  template: `
  <q-table
      :rows="rows"
      :columns="columns"
    >
    <template #body="props">
        <grid-item
          :table-props="props"
          @viewitem-click="handlerAddOrEditOrView"
          @edititem-click="handlerAddOrEditOrView"
          @deleteitem-click="handlerDelete"
        />
      </template>
  </q-table>
`,
  components: {
    GridItem,
  },
  data: () => ({
    columns: [
      {
        name: 'name',
        align: 'left',
        label: 'Name',
        field: 'name',
        sortable: true,
      },
      {
        name: 'scored',
        align: 'left',
        label: 'Scored',
        field: 'scored',
        format: (value: number) => `${value}%`,
      },
    ] as Column<Record<string, unknown>>[],
    rows: [
      {
        id: '1',
        name: 'test',
        scored: 60,
      },
      {
        id: '2',
        name: '',
        scored: 20,
      },
    ],
  }),
  methods: {
    handlerAddOrEditOrView: () => null,
    handlerDelete: () => null,
  },
};

describe('GridItem.vue', () => {
  let wrapper: VueWrapper<ComponentPublicInstance>;
  let child: VueWrapper<ComponentPublicInstance> | undefined;
  let buttons: DOMWrapper<HTMLButtonElement>[];

  beforeAll(() => {
    wrapper = mount(StubParentComponent, {
      global: {
        plugins: [i18n],
      },
    });
    child = wrapper.findComponent(GridItem as never);
    buttons = wrapper.findAll('button');
  });

  it('should trigger viewitemClick event when view button is clicked', async () => {
    await buttons[0].trigger('click');
    expect(child?.emitted('viewitemClick')).toHaveLength(1);
  });

  it('should trigger edititemClick event when edit button is clicked', async () => {
    await buttons[1].trigger('click');
    expect(child?.emitted('edititemClick')).toHaveLength(1);
  });

  it('should trigger deleteitemClick event when delete button is clicked and confirm action', async () => {
    const { vm } = child || ({} as never);
    vm.$q.dialog = jest.fn().mockReturnThis() as never;
    vm.$q.dialog({}).onOk = jest.fn(() =>
      (
        vm as unknown as { onConfirmDeleteItem: (id: string) => void }
      ).onConfirmDeleteItem('1')
    ) as never;
    await buttons[2].trigger('click');
    expect(vm.$q.dialog({}).onOk).toHaveBeenCalled();
    expect(child?.emitted('deleteitemClick')).toHaveLength(1);
  });
});
