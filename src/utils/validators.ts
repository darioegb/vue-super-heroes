import { helpers } from '@vuelidate/validators';

export const fileSize = (value: File) =>
  !helpers.req(value) || value.size <= 200000;
