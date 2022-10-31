import { computed } from 'vue';
import { describe, expect, it } from '@jest/globals';
import { shallowMount } from '@vue/test-utils';

import i18n from 'src/config/i18n';
import { useCustomTranslate } from './useCustomTranslate';
import { GenreEnum } from 'src/enums';

const StubComponent = {
  template: `
  {{value}}
`,
  setup() {
    const { dropdownTranslate } = useCustomTranslate();
    const value = computed(() =>
      dropdownTranslate('globals.enums.genres', 1, GenreEnum),
    );
    return {
      value,
    };
  },
};

describe('useCustomTranslate', () => {
  it('should translate dropDownValue', () => {
    const wrapper = shallowMount(StubComponent, {
      global: {
        plugins: [i18n],
      },
    });
    expect(wrapper.html()).toMatch('Male');
  });
});
