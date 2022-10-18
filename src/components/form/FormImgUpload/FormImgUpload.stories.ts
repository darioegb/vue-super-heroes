import FormImgUpload from './FormImgUpload.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import useVuelidate from '@vuelidate/core';
import { fileSize } from 'src/utils';
import { reactive, toRefs, computed } from 'vue';

export default {
  title: 'Components/Form/FormImgUpload',
  component: FormImgUpload,
  argTypes: {
    isUploading: {
      description: 'Flag to indicate when start to upload picture',
      control: false,
    },
    picture: {
      description: 'Is a file',
      control: false,
    },
    seletedItemPicture: {
      description: 'Is image url',
    },
    view: {
      description: 'Flag to indicate is on view mode',
      defaultValue: false,
    },
    validation: {
      description: 'Validation object to validate input file',
      control: false,
    },
    'update:picture': {
      description: 'Fired when input file changed',
      control: false,
    },
    downloadUrlChange: {
      description: 'Fired when file was uploaded',
      control: false,
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'FormImgUpload is a file image uploader using QFile from Quasar',
      },
      source: {
        code: `<form-img-upload
        :is-uploading="isUploading"
        :seleted-item-picture="selectedItem?.picture"
        v-model:picture="picture"
        :view="view"
        :validation="v$.picture"
        @download-url-change="saveOrUpdate($event)"
      />`,
        language: 'html',
      },
    },
  },
} as Meta<typeof FormImgUpload>;

const Template: StoryFn<typeof FormImgUpload> = (
  args: Record<string, unknown>,
) => ({
  components: { FormImgUpload },
  setup() {
    const state = reactive({
      picture: undefined,
    });
    const { picture } = toRefs(state);
    const rules = computed(() => ({
      picture: {
        fileSize,
      },
    }));
    const v$ = useVuelidate(rules, state, { $lazy: true });
    return { args, v$, picture };
  },
  template:
    '<FormImgUpload v-bind="args" v-model:picture="picture" :validation="v$.picture" />',
});

export const Default = Template.bind({});

Default.args = {
  isUploading: false,
};
