import { describe, expect, it } from '@jest/globals';
import { mount } from '@vue/test-utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';

import FormCard from './FormCard.vue';

installQuasarPlugin();

describe('FormCard.vue', () => {
  const title = 'superhero';

  it('should render props.title when passed', () => {
    const wrapper = mount(FormCard, {
      global: {
        stubs: {
          FormCardActions: true,
        },
      },
      props: { title },
    });
    expect(wrapper.find('.text-h6').text()).toMatch(title);
  });

  it('should render default slot', () => {
    const wrapper = mount(FormCard, {
      global: {
        stubs: {
          FormCardActions: true,
        },
      },
      props: { title },
      slots: {
        default: 'Main Content',
      },
    });

    expect(wrapper.html()).toContain('Main Content');
  });
});
