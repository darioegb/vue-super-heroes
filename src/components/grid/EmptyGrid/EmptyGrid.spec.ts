import { describe, expect, it } from '@jest/globals';
import { shallowMount } from '@vue/test-utils';

import EmptyGrid from './EmptyGrid.vue';
import i18n from 'src/config/i18n';

describe('EmptyGrid.vue', () => {
  it('renders props.filter when passed', () => {
    const filter = 'super';
    const wrapper = shallowMount(EmptyGrid, {
      global: {
        stubs: {
          QIcon: true,
        },
        plugins: [i18n],
      },
      props: { filter },
    });
    expect(wrapper.text()).toMatch(
      `No hay datos que coincidan con el filtro ${filter}`
    );
  });
});
