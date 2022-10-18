import FormCardActions from './FormCardActions.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import vueRouter from 'storybook-vue3-router';

export default {
  title: 'Components/Form/FormCardActions',
  component: FormCardActions,
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
    actions: {
      handles: ['click button'],
    },
    docs: {
      description: {
        component:
          'FormCardActions is a form card actions using quasar that contain form actions buttons.',
      },
      source: {
        code: '<form-card-actions />',
        language: 'html',
      },
    },
  },
} as Meta<typeof FormCardActions>;

const Template: StoryFn<typeof FormCardActions> = () => ({
  components: { FormCardActions },
  template: '<FormCardActions />',
});

export const Default = Template.bind({});
