import * as validators from '@vuelidate/validators';
import i18n from 'src/config/i18n';
import * as customValidators from './validators';

// or import { createI18nMessage } from '@vuelidate/validators'
const { createI18nMessage } = validators;

// extract the `t` helper, should work for both Vue 2 and Vue 3 versions of vue-i18n

const { t } = i18n.global || i18n;

// pass `t` and create your i18n message instance
const withI18nMessage = createI18nMessage({ t });

// wrap each validator.
export const required = withI18nMessage(validators.required);
// validators that expect a parameter should have `{ withArguments: true }` passed as a second parameter, to annotate they should be wrapped
export const minLength = withI18nMessage(validators.minLength, {
  withArguments: true,
});
// or you can provide the param at definition, statically
export const maxLength = withI18nMessage(validators.maxLength, {
  withArguments: true,
});

export const minValue = withI18nMessage(validators.minValue, {
  withArguments: true,
});

// Custom
export const fileSize = withI18nMessage(customValidators.fileSize);
