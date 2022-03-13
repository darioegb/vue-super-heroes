import { boot } from 'quasar/wrappers';
import { uppercase } from 'src/directives';

export default boot(({ app }) => {
  app.directive(uppercase.name, uppercase.function);
});
