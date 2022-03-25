import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { mount, shallowMount, flushPromises } from '@vue/test-utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { Notify, QSelect } from 'quasar';

import i18n from 'src/config/i18n';
import { uppercase } from 'src/directives';

// must define this above the `SuperHeroDetail` import, otherwise the ReferenceError is raised.
const mockPostFn = jest.fn(() => undefined);
const mockPutFn = jest.fn(() => undefined);

import SuperHeroDetail from './SuperHeroDetail.vue';
import { storeKey } from 'src/store';
import createVuexStore from 'src/testing/mock-store';
import { superHeroesState } from 'src/testing/test-super-hero-state';

installQuasarPlugin({
  plugins: {
    Notify,
  },
});
jest.mock('axios', () => ({
  post: mockPostFn,
  put: mockPutFn,
}));
jest.mock('vue-router', () => ({
  useRoute: jest.fn(() => ({
    params: {},
  })),
}));

describe('SuperHeroDetail.vue', () => {
  const store = createVuexStore();
  const viewOrEditState = {
    superHeroes: superHeroesState.superHeroes,
    selectedSuperHero: superHeroesState.superHeroes[0],
  };

  beforeEach(() => {
    store.replaceState({
      superHeroes: superHeroesState,
    });
    jest.clearAllMocks();
  });

  it('should display superHeroDetail when is new entry', () => {
    const wrapper = shallowMount(SuperHeroDetail, {
      global: {
        directives: {
          [uppercase.name]: uppercase.function,
        },
        plugins: [i18n, [store, storeKey]],
      },
    });
    const { vm } = wrapper as unknown as Record<
      string,
      Record<string, Record<string, string>>
    >;
    expect(vm.state.name.length).toBe(0);
    expect(wrapper.html()).toContain('form');
  });

  it('should display superHeroDetail with disabled data when is view mode', () => {
    store.replaceState({ superHeroes: viewOrEditState });
    const wrapper = mount(SuperHeroDetail, {
      global: {
        directives: {
          [uppercase.name]: uppercase.function,
        },
        plugins: [i18n, [store, storeKey]],
      },
      props: {
        id: '1',
        view: true,
      },
    });
    const input = wrapper.findAll('input')[0];
    expect(input.attributes().readonly).toBeDefined();
    expect(wrapper.html()).toContain('form');
  });

  it('should display superHeroDetail with data when is edit mode', () => {
    store.replaceState({ superHeroes: viewOrEditState });
    const wrapper = shallowMount(SuperHeroDetail, {
      global: {
        directives: {
          [uppercase.name]: uppercase.function,
        },
        plugins: [i18n, [store, storeKey]],
      },
      props: {
        id: '1',
      },
    });
    const { vm } = wrapper as unknown as Record<
      string,
      Record<string, Record<string, string>>
    >;
    expect(vm.state.name).toBe(store.state.superHeroes.selectedSuperHero?.name);
    expect(wrapper.html()).toContain('form');
  });

  it('should reset form when click on reset button', async () => {
    const wrapper = mount(SuperHeroDetail, {
      global: {
        directives: {
          [uppercase.name]: uppercase.function,
        },
        plugins: [i18n, [store, storeKey]],
      },
    });
    const { vm } = wrapper as unknown as Record<string, Record<string, string>>;
    const resetButton = wrapper.find('button[type="reset"]');
    const input = wrapper.findAll('input')[0];
    await input.setValue('test');
    await resetButton.trigger('reset.prevent');

    expect(vm.name.length).toBe(0);
  });

  it('should submit form when click on submit button', async () => {
    mockPostFn.mockResolvedValueOnce({} as never);
    store.replaceState({ superHeroes: superHeroesState });
    const wrapper = mount(SuperHeroDetail, {
      global: {
        directives: {
          [uppercase.name]: uppercase.function,
        },
        plugins: [i18n, [store, storeKey]],
      },
    });
    const spy = jest.spyOn(
      (wrapper as unknown as Record<string, { $q: { notify: () => unknown } }>)
        .vm.$q,
      'notify'
    );
    const submitButton = wrapper.find('button[type="submit"]');
    const input = wrapper.findAll('input')[0];
    const textarea = wrapper.find('textarea');
    const select = wrapper.findComponent(QSelect);
    await input.setValue('TEST');
    await textarea.setValue('This is a fake super hero');
    await select.setValue({ key: 'Male', value: 1 });
    await submitButton.trigger('submit.prevent');
    await flushPromises();
    expect(spy).toHaveBeenCalledWith('El superheoe se agregó con éxito');
  });

  it("should'n submit form when click on submit button and error ocurred", async () => {
    mockPostFn.mockRejectedValueOnce(new Error('Async Error'));
    store.replaceState({ superHeroes: superHeroesState });
    const wrapper = mount(SuperHeroDetail, {
      global: {
        directives: {
          [uppercase.name]: uppercase.function,
        },
        plugins: [i18n, [store, storeKey]],
      },
    });
    const spy = jest.spyOn(
      (wrapper as unknown as Record<string, { $q: { notify: () => unknown } }>)
        .vm.$q,
      'notify'
    );
    const submitButton = wrapper.find('button[type="submit"]');
    const input = wrapper.findAll('input')[0];
    const textarea = wrapper.find('textarea');
    const select = wrapper.findComponent(QSelect);
    await input.setValue('TEST');
    await textarea.setValue('This is a fake super hero');
    await select.setValue({ key: 'Male', value: 1 });
    await submitButton.trigger('submit.prevent');
    await flushPromises();
    expect(spy).toHaveBeenCalledWith({
      message: 'Ocurrió un error al agregar un superheroe',
      type: 'negative',
    });
  });

  it("should'n submit form when click on submit button if form is invalid", async () => {
    mockPostFn.mockResolvedValueOnce({} as never);
    store.replaceState({ superHeroes: superHeroesState });
    const wrapper = mount(SuperHeroDetail, {
      global: {
        directives: {
          [uppercase.name]: uppercase.function,
        },
        plugins: [i18n, [store, storeKey]],
      },
    });
    const spy = jest.spyOn(
      (wrapper as unknown as Record<string, { $q: { notify: () => unknown } }>)
        .vm.$q,
      'notify'
    );
    const submitButton = wrapper.find('button[type="submit"]');
    await submitButton.trigger('submit.prevent');
    await flushPromises();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should submit form when click on submit button on edit mode', async () => {
    store.replaceState({ superHeroes: viewOrEditState });
    mockPutFn.mockResolvedValueOnce({} as never);
    const wrapper = mount(SuperHeroDetail, {
      global: {
        directives: {
          [uppercase.name]: uppercase.function,
        },
        plugins: [i18n, [store, storeKey]],
      },
      props: {
        id: '1',
      },
    });
    const spy = jest.spyOn(
      (wrapper as unknown as Record<string, { $q: { notify: () => unknown } }>)
        .vm.$q,
      'notify'
    );
    const submitButton = wrapper.find('button[type="submit"]');
    const input = wrapper.findAll('input')[0];
    await input.setValue('TEST');
    await submitButton.trigger('submit.prevent');
    await flushPromises();
    expect(spy).toHaveBeenCalledWith('El superheoe fue actualizado con éxito');
  });
});
