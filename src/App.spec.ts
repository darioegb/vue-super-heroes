import { describe, expect, it } from '@jest/globals';
import { shallowMount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';

import App from './App.vue';
import i18n from 'src/config/i18n';
import routes from './router/routes';

installQuasarPlugin();

describe('App.vue', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: routes,
  });
  it('renders props.filter when passed', async () => {
    void router.push('/');
    // After this line, router is ready
    await router.isReady();
    const wrapper = shallowMount(App, {
      global: {
        plugins: [i18n, router],
      },
    });
    expect(wrapper.find('q-layout-stub ').exists()).toBeTruthy();
  });
});
