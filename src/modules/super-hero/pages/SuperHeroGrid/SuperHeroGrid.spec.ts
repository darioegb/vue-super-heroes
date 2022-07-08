import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { mount, flushPromises } from '@vue/test-utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { Dialog, Notify } from 'quasar';

import i18n from 'src/config/i18n';
import { SuperHero } from 'src/modules/super-hero/interfaces';
import { Column, PageConfig } from 'src/interfaces';

// must define this above the `SuperHeroGrid` import, otherwise the ReferenceError is raised.
const mockPush = jest.fn();
const mockGetFn = jest.fn(() => undefined);
const mockDeleteFn = jest.fn(() => undefined);

import SuperHeroGrid from './SuperHeroGrid.vue';
import { storeKey } from 'src/store';
import createVuexStore from 'src/testing/mock-store';
import { superHeroesState } from 'src/testing/test-super-hero-state';
import { GridItem } from 'src/components';

installQuasarPlugin({
  plugins: {
    Dialog,
    Notify,
  },
});
jest.mock('vue-router', () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
  })),
}));
jest.mock('axios', () => ({
  get: mockGetFn,
  delete: mockDeleteFn,
}));

interface VMDelete {
  $q: {
    notify: () => unknown;
    dialog: () => {
      onOk: () => unknown;
    };
  };
  onConfirmDeleteItem: (id: string) => void;
}

describe('SuperHeroGrid.vue', () => {
  const initialState = {
    superHeroes: [],
    selectedSuperHero: undefined,
  };
  const store = createVuexStore(initialState);
  const response = {
    data: superHeroesState.superHeroes,
    headers: {
      'x-total-count': '10',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should format column return correct transform value', () => {
    mockGetFn.mockResolvedValueOnce(response as never);
    const wrapper = mount(SuperHeroGrid, {
      global: {
        plugins: [i18n, [store, storeKey]],
      },
    });
    const colums = (wrapper.vm as unknown as { columns: Column<SuperHero>[] })
      .columns;
    colums[1].format && expect(colums[1].format('1')).toBe('Masculino');
  });

  it('should change filter value when the input value is changed', async () => {
    mockGetFn.mockResolvedValueOnce(response as never);
    const wrapper = mount(SuperHeroGrid, {
      global: {
        plugins: [i18n, [store, storeKey]],
      },
    });
    const filter = 'super';
    const input = wrapper.find('input');
    await input.setValue(filter);
    expect((wrapper.vm as unknown as { filter: unknown }).filter).toBe(filter);
    expect(wrapper.emitted('change')).toHaveLength(1);
  });

  it("should'n render SuperHeroGrid when error ocurred", () => {
    mockGetFn.mockRejectedValueOnce('Error');
    const wrapper = mount(SuperHeroGrid, {
      global: {
        plugins: [i18n, [store, storeKey]],
      },
    });
    const { count, pagination } = wrapper.vm as unknown as {
      count?: number;
      pagination: PageConfig<SuperHero>;
    };
    expect(pagination.rowsNumber).toBe(100);
    expect(count).toBeUndefined();
  });

  it('should delete item when confirm delete', async () => {
    mockGetFn.mockResolvedValueOnce(response as never);
    mockDeleteFn.mockResolvedValueOnce({} as never);
    const wrapper = mount(SuperHeroGrid, {
      global: {
        plugins: [i18n, [store, storeKey]],
      },
    });
    const spy = jest.spyOn(
      (wrapper as unknown as Record<string, VMDelete>).vm.$q,
      'notify'
    );
    await flushPromises();
    const childs = wrapper.findAllComponents(GridItem as never);
    const { vm } = childs[0] as unknown as Record<string, VMDelete>;
    vm.$q.dialog = jest.fn().mockReturnThis() as never;
    vm.$q.dialog().onOk = jest.fn(() => vm.onConfirmDeleteItem('1')) as never;
    const buttons = wrapper.findAll('button');
    await buttons[3].trigger('click');
    await flushPromises();
    expect(spy).toHaveBeenCalledWith(
      'El superheoe ha sido eliminado exitosamente'
    );
  });

  it("should'n delete item when error occured", async () => {
    mockGetFn.mockResolvedValueOnce(response as never);
    mockDeleteFn.mockRejectedValueOnce(new Error('Error delete item'));
    const wrapper = mount(SuperHeroGrid, {
      global: {
        plugins: [i18n, [store, storeKey]],
      },
    });
    const spy = jest.spyOn(
      (wrapper as unknown as Record<string, VMDelete>).vm.$q,
      'notify'
    );
    await flushPromises();
    const childs = wrapper.findAllComponents(GridItem as never);
    const { vm } = childs[0] as unknown as Record<string, VMDelete>;
    vm.$q.dialog = jest.fn().mockReturnThis() as never;
    vm.$q.dialog().onOk = jest.fn(() => vm.onConfirmDeleteItem('1')) as never;
    const buttons = wrapper.findAll('button');
    await buttons[3].trigger('click');
    await flushPromises();
    expect(spy).toHaveBeenCalledWith({
      message: 'Ocurrió un error al eliminar un superheroe',
      type: 'negative',
    });
  });

  it('should go to form to add new item when click on add', async () => {
    mockGetFn.mockResolvedValueOnce(response as never);
    const wrapper = mount(SuperHeroGrid, {
      global: {
        plugins: [i18n, [store, storeKey]],
      },
    });
    await flushPromises();
    const addButton = wrapper.findAll('button')[0];
    await addButton.trigger('click');
    expect(mockPush).toHaveBeenCalledWith({ name: 'SuperHeroNew' });
  });

  it('should go to form to view item when click on view', async () => {
    mockGetFn.mockResolvedValueOnce(response as never);
    const wrapper = mount(SuperHeroGrid, {
      global: {
        plugins: [i18n, [store, storeKey]],
      },
    });
    await flushPromises();
    const viewButton = wrapper.findAll('button')[1];
    await viewButton.trigger('click');
    expect(mockPush).toHaveBeenCalledWith({
      name: 'SuperHeroDetail',
      params: { id: '1' },
      query: { view: 'true' },
    });
  });

  it('should go to form to edit item when click on edit', async () => {
    mockGetFn.mockResolvedValueOnce(response as never);
    const wrapper = mount(SuperHeroGrid, {
      global: {
        plugins: [i18n, [store, storeKey]],
      },
    });
    await flushPromises();
    const editButton = wrapper.findAll('button')[2];
    await editButton.trigger('click');
    expect(mockPush).toHaveBeenCalledWith({
      name: 'SuperHeroDetail',
      params: { id: '1' },
      query: undefined,
    });
  });
});
