import { describe, expect, it } from '@jest/globals';
import { shallowMount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import i18n from 'src/config/i18n';
import routes from './router/routes';

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
    expect(wrapper.find('h1').text()).toMatch('ABM con quasar');
  });
});
