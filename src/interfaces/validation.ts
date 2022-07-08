import { ErrorObject } from '@vuelidate/core';

export interface Validation {
  $errors: ErrorObject[];
  $error: boolean;
  $touch: () => void;
}
