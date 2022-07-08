import { describe, expect, it } from '@jest/globals';
import { mount } from '@vue/test-utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';

import { uppercase } from './';

installQuasarPlugin();

const StubComponent = {
  template: `
  <q-input filled v-model="text" v-uppercase />
`,
  data: () => ({
    text: '',
  }),
};

describe('uppercase', () => {
  it('should set input value to uppercase on change input value', async () => {
    const wrapper = mount(StubComponent, {
      global: {
        directives: {
          [uppercase.name]: uppercase.function,
        },
      },
    });
    const input = wrapper.find('input');
    await input.setValue('test');

    expect(input.element.value).toBe('TEST');
  });
});
