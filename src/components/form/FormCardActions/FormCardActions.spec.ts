import { ComponentPublicInstance } from 'vue';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { DOMWrapper, mount, VueWrapper } from '@vue/test-utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import i18n from 'src/config/i18n';

// must define this above the `FormCardActions` import, otherwise the ReferenceError is raised.
const mockFn = jest.fn();

import FormCardActions from './FormCardActions.vue';

installQuasarPlugin();
jest.mock('vue-router', () => ({ useRoute: mockFn }));

const StubParentComponent = {
  template: `
  <form
    @submit.prevent="onSubmit"
    @reset.prevent="onReset"
    class="q-gutter-md"
    novalidate
  >
    <q-card>
      <q-card-section>
          <q-input filled v-model="name"/>
      </q-card-section>
      <form-card-actions />
    </q-card>
  </form>

`,
  components: {
    FormCardActions,
  },
  data: () => ({
    name: 'test',
  }),
  methods: {
    onSubmit: () => null,
    onReset: () => null,
  },
};

describe('FormCardActions.vue', () => {
  let wrapper: VueWrapper<ComponentPublicInstance>;
  let buttons: DOMWrapper<HTMLButtonElement>[];

  describe('with params', () => {
    beforeEach(() => {
      mockFn.mockImplementationOnce(() => ({
        params: {
          id: 1,
        },
      }));
      wrapper = mount(StubParentComponent, {
        global: {
          plugins: [i18n],
        },
      });
      buttons = wrapper.findAll('button');
    });

    it("should't emit reset button click event when form is on edit mode", async () => {
      const resetButton = buttons[1];
      await resetButton.trigger('click');
      expect(wrapper.emitted('click')).toBeUndefined();
    });
  });

  describe('without params', () => {
    beforeEach(() => {
      mockFn.mockImplementationOnce(() => ({}));
      wrapper = mount(StubParentComponent, {
        global: {
          plugins: [i18n],
        },
      });
      buttons = wrapper.findAll('button');
    });

    it('should emit submit button click event when button is clicked', async () => {
      const submitButton = buttons[2];
      await submitButton.trigger('click');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('should emit reset button click event when button is clicked', async () => {
      const resetButton = buttons[1];
      await resetButton.trigger('click');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('should goBack when click on cancel button', async () => {
      const spy = jest.spyOn(history, 'back');
      const cancelButton = buttons[0];
      await cancelButton.trigger('click');
      expect(spy).toBeCalled();
    });
  });
});
