/* eslint-disable @typescript-eslint/restrict-template-expressions */
import FormCard from './FormCard.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import vueRouter from 'storybook-vue3-router';
import useVuelidate from '@vuelidate/core';
import { required, minLength, maxLength } from '@vuelidate/validators';
import { defaultFormControlSizes } from 'src/constants';
import { reactive, toRefs, computed } from 'vue';

export default {
  title: 'Components/Form/FormCard',
  component: FormCard,
  argTypes: {
    title: {
      description: 'Form card title',
    },
    default: {
      description: 'Default slot that contain form content',
      type: {
        required: true,
      } as unknown,
    },
  },
  decorators: [
    vueRouter([
      {
        path: '/detail/:id',
        name: 'SuperHeroDetail',
        component: import(
          'src/modules/super-hero/pages/SuperHeroDetail/SuperHeroDetail.vue'
        ),
      },
    ]),
  ],
  parameters: {
    docs: {
      description: {
        component: 'FormCard is form container card',
      },
      source: {
        code: `<form-card title="Test title">
          <!-- Here put the content -->
        </form-card>`,
        language: 'html',
      },
    },
  },
} as Meta<typeof FormCard>;

const Template: StoryFn<typeof FormCard> = (args: Record<string, unknown>) => ({
  components: { FormCard },
  setup() {
    const { text } = defaultFormControlSizes;
    const state = reactive({
      name: '',
    });
    const { name } = toRefs(state);
    const rules = computed(() => ({
      name: {
        required,
        minLength: minLength(text.min),
        maxLength: maxLength(text.max),
      },
    }));
    const v$ = useVuelidate(rules, state, { $lazy: true });
    const onReset = () => {
      v$.value.$reset();
      Object.assign(state, {
        name: '',
      });
    };
    const onSubmit = () => {
      v$.value.$touch();
      if (v$.value.$invalid) return;
    };
    return { args, v$, name, onReset, onSubmit };
  },
  template: `<form
  @submit.prevent="onSubmit"
  @reset.prevent="onReset"
  class="q-gutter-md form-container"
  novalidate
><FormCard v-bind="args">
    <template v-if="args.default" v-slot>${args.default}</template>
  </FormCard></form>`,
});

export const Default = Template.bind({});

Default.args = {
  title: 'Test',
  default: `<q-input
  filled
  v-model="name"
  label="Name"
  hint="Ex. Jhon"
  :error-message="v$.name.$errors[0]?.$message.toString()"
  :error="v$.name.$error"
  @blur="v$.name.$touch"
/>`,
};
