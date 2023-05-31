# Vue superheroes

It is a kickoff vue project with quasar framework of a superhero crud using a scalable architecture and applying good practices and performance techniques.

- A feature-based directory structure was used to make it scalable and maintainable.
- Used eslint and prettier for readable and bug free code.
- Unit tests were used for each typed file that needs to be tested as components, service directives.
- Use global file with contents to keep all globals in the same file.
- i18n was used to keep all the text in global files and no harcode in the htmls files.
- Used the json server to simulate the backend when working on draft functions.
- Used storybook to document shared components, directives.
- Used the light and dark theme per operating system so that it changes according to the user's configuration.
- Used workbox to manage the app as a PWA, caching resources, and using offline mode.
- The navbar also show if there is internet connection.
- Used [ts-paths](https://www.typescriptlang.org/tsconfig#paths) and [barrels](https://basarat.gitbook.io/typescript/main-1/barrel) to improve imports in typescript files.

## Table of Contents

- [Structure directory](#structure-directory)
- [Development](#development)
  - [Development server](#development-server)
  - [Json server](#json-server)
  - [I18n](#i18n)
  - [Documentation](#documentation)
  - [PWA](#pwa)
  - [Development utilities](#development-utilities)
    - [Linting & Formating](#linting-&-formating)
    - [Testing](#testing)

## Structure directory

- Assets folder contains globals statics files like i18n json's, imgs.
- Boot folder is created by quasar and contains al third party or custom plugins integrations with vue.
- Components folder contains all shared components.
- Composables folder contains all globals composables.
- Config folder contains all about global configurations stuff.
- CSS folder contains globals styles.
- Directives folder contains all directives.
- Enums folder contains all enums.
- Interfaces folder contains globals interfaces.
- Layouts folder contains all layouts for the app.
- Modules folder contains all application modules. Contains all pages components also we can create a component folder with specific components for this module.
- Pages folder contains all global pages like not-found, unauthorized, and so on.
- Router folder contains globals routes and lazy load inyection from feature routes.
- Store folder contains root vuex store configuration.
- Testing folder contains all testing utils.
- Types folder contains globals types.
- Util folder contains all about utils functions and custom validators.

```
|-- src
    |-- boot
    |-- components
    |-- composables
    |-- config
    |-- css
    |-- directives
    |-- enum
    |-- interfaces
    |-- layouts
        |-- BaseLayout
    |-- modules
        |-- super-hero
            |-- pages
                |-- SuperHeroDetail
                    |-- SuperHeroDetail.vue|spec.ts
                |-- SuperHeroGrid
                    |-- SuperHeroGrid.vue|spec.ts
            |-- composables
                |-- useSuperHero.ts|spec.ts
            |-- interfaces
            |-- router
            |-- store
                |-- actions.ts
                |-- mutations.ts
                |-- state.ts
    |-- pages
        |-- NotFound
            |-- NotFound.vue|spec.ts
    |-- router
    |-- store
    |-- testing
    |-- types
    |-- utils
    |-- sw.js
    |-- assets
        |-- i18n
        |-- imgs
        |-- scss
    |-- App.vue|spec.ts
    |-- globals.ts
    |-- index.template.html
```

## Development

### Development server

> To start the development server run:

```bash
  yarn serve
```

After that navigate to `http://localhost:3001/`. The app will automatically reload if you change any of the source files.

### Json server

It's a mock server to run when the backend not exist or it'sn't updated.

> To install run:

```bash
  npm install -g json-server
```

> For run it server run:

```bash
  json-server --watch db.json
```

> Or if you configure some custom routes run:

```bash
  json-server db.json --routes routes.json
```

For more information go to [Json-server](https://github.com/typicode/json-server)

## I18n

Internationalization is made with [vue-i18n](https://vue-i18n.intlify.dev/) because you can change language at runtime without reload the whole app.

To create a new translation you just have to create a key-value tuple in each internationalization json file in assets/i18n

JSON structure used is as follows: have a node for each feature (page, section) and inside have all the children. In addition to having another globals node, where to place everything that is global to the application such as buttons, its title, etc. and finally one for validations

```json
{
  "featureNameInPlural": {
    "title": "Feature name in plural",
    "grid": {
      "columns": {
        // columns grid
        "name": "Name"
      }
    },
    "detail": {
      "title": "Feature Name",
      "form": {
        // for example the form fields placehoders
        "namePlaceholder": "Ex. name"
      }
    }
  },
  "globals": {
    "title": "Application title",
    "buttons": {
      "confirm": "Confirm",
      "cancel": "Cancel"
    },
    "enums": {
      // some enumeration translations
    },
    "dialogs": {
      // some dialog translations
    },
    "toasts": {
      // some toast(alert) translations
    }
  },
  "validations": {
    "required": "The field is required."
    // other validations
  }
}
```

## Documentation

Shared components were documented using a [storybook](https://storybook.js.org/docs/angular/get-started/introduction) and displayed in [chromatic](https://www.chromatic.com/).

Documententation live [link](https://634fe35cec053b270773f36e-wyivvyaywz.chromatic.com/)

> To start dev documentation server run:

```bash
  yarn storybook
```

After that navigate to `http://localhost:6006/`. The documentation will automatically reload if you change any of the source files.

> To deploy documentation changes run:

```bash
  yarn chromatic
```

### PWA

PWA is manage using [workbox](https://developer.chrome.com/docs/workbox/)
and compiling by [webpack](https://webpack.js.org/concepts/).

> To build the pwa-capable project run:

```bash
  yarn build:pwa
```

The build artifacts will be stored in the `dist/pwa` directory.

> To debbug locally the pwa run:

```bash
  yarn serve:pwa
```

Before that be sure to have [http-server](https://www.npmjs.com/package/http-server) already installed in our system.

### Build

Run `yarn build` to build the project. The build artifacts will be stored in the `dist/spa` directory.

### Development utilities

#### Linting & Formating

The code was linting by [eslint](https://eslint.vuejs.org/) against tslint because the latter was deprecated. Also use [prettier](https://prettier.io/) for formating propouses.

> To execute the linting validation run:

```bash
  yarn lint
```

#### Testing

To run the tests in debug mode with a browser, execute the following command and the browser will be open.

```bash
  yarn test:unit:watchAll
```

The tests are executed and created via [Jest](https://jestjs.io/).

> Or to execute production unit tests run:

```bash
  yarn test:unit:coverage
```

The production execution also generate code coverage. By architectural agreement I have taken 80% coverage as a base.
