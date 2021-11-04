# Changelog

## v1.0.23 (2021-11-04)


## v1.0.22 (2021-11-04)

### Dependency Upgrades

- npm audit fix ([65ede34](https://github.com/kei-ito/rollup-plugin-embed-css/commit/65ede34c827ee468b16e84139da03d2c5adbd94b))
- eslint:7.32.0→8.1.0 ([4be0fb3](https://github.com/kei-ito/rollup-plugin-embed-css/commit/4be0fb3fc6e1a95859f5b8c37eae3cd37856c016))
- @nlib/eslint-config:3.17.25→3.17.28 @nlib/nodetool:0.4.1→1.0.0 @rollup/plugin-commonjs:17.1.0→21.0.1 @types/node:15.14.9→16.11.6 @types/selenium-webdriver:4.0.15→4.0.16 @typescript-eslint/eslint-plugin:4.31.1→5.3.0 @typescript-eslint/parser:4.31.1→5.3.0 esifycss:1.4.27→1.4.35 husky:4.3.8→7.0.4 lint-staged:11.1.2→11.2.6 postcss:8.3.8→8.3.11 rollup:2.56.3→2.59.0 selenium-webdriver:4.0.0-rc-1→4.0.0 systemjs:6.10.3→6.11.0 ts-node:9.1.1→10.4.0 typescript:4.4.3→4.4.4 ([4cbfe1f](https://github.com/kei-ito/rollup-plugin-embed-css/commit/4cbfe1fc2661919e10e2857fd543443b2b901c4c))


## v1.0.21 (2020-12-20)

### Bug Fixes

- uninstall remove-sourcemap ([1ef82a6](https://github.com/kei-ito/rollup-plugin-embed-css/commit/1ef82a6ab078a36c30d69aff67e4a360dec53163))


## v1.0.20 (2020-12-20)

### Dependency Upgrades

- upgrade dependencies (#139) ([160c96a](https://github.com/kei-ito/rollup-plugin-embed-css/commit/160c96a90b60154ef52c60e59641e4327b33f1f3))


## v1.0.19 (2020-10-04)

### Styles

- fix eslint errors ([3b9c6df](https://github.com/kei-ito/rollup-plugin-embed-css/commit/3b9c6df52a938a0dd04d82b728dd323682e48d45))

### Continuous Integration

- cleanup package.json before publish ([298c7dc](https://github.com/kei-ito/rollup-plugin-embed-css/commit/298c7dc2087b7fb5b872d617c375198de1bbb30e))


## v1.0.18 (2020-07-13)

### Bug Fixes

- update esifycss to support import url(...) ([4d3364c](https://github.com/kei-ito/rollup-plugin-embed-css/commit/4d3364c58324316e42e20bc98d5b86ef46771358))

### Tests

- set hostname ([a21e974](https://github.com/kei-ito/rollup-plugin-embed-css/commit/a21e97430caa9897cafb19f8c20163aac9948efc))

### Documentation

- change the badge ([e3756c3](https://github.com/kei-ito/rollup-plugin-embed-css/commit/e3756c3624571486c4def047967a329b59601623))

### Build System

- update workflow ([fb8a96a](https://github.com/kei-ito/rollup-plugin-embed-css/commit/fb8a96aac26f111ef3e448cfda82812df3583757))


## v1.0.17 (2020-06-26)

### Tests

- rewrite ([48d16ed](https://github.com/kei-ito/rollup-plugin-embed-css/commit/48d16ed31dc46a126966f415bd143e68c0a3d616))
- increase timeout ([2a819d5](https://github.com/kei-ito/rollup-plugin-embed-css/commit/2a819d52ea03faabaf2d111b0adb80e23227f2b7))
- change the image ([8198a43](https://github.com/kei-ito/rollup-plugin-embed-css/commit/8198a43c05ed4e2c662ec8ac7e72d34b338c84d4))
- install chromedriver ([4aa534c](https://github.com/kei-ito/rollup-plugin-embed-css/commit/4aa534cd8c6e53e08bf9465f2e2b70daaa4da4a1))
- add tests for each formats (#116, #105) ([ba5f593](https://github.com/kei-ito/rollup-plugin-embed-css/commit/ba5f5938489da68f6c8134e06cdb2437514e8fac))
- clear tests ([aa3263e](https://github.com/kei-ito/rollup-plugin-embed-css/commit/aa3263e15330875dd2fd9e44d8367555ca000d9d))

### Code Refactoring

- console output ([75db08c](https://github.com/kei-ito/rollup-plugin-embed-css/commit/75db08c63780d5d9d305e63fc973cff64dc1249a))
- remove unnecessary arguments ([e756870](https://github.com/kei-ito/rollup-plugin-embed-css/commit/e756870cb958735036b8df60fd5d3db2e70124d0))
- fix an eslint error ([9c53cd1](https://github.com/kei-ito/rollup-plugin-embed-css/commit/9c53cd1465dab3fe03b0189785fbba6b01f5cf07))


## v1.0.16 (2020-01-26)

### Bug Fixes

- use buildStart hook instead of options hook ([071bcf9](https://github.com/kei-ito/rollup-plugin-embed-css/commit/071bcf995e401634274f9053eb5cc7e07464db02))


## v1.0.15 (2020-01-23)

### Bug Fixes

- process dependencies first ([60371c1](https://github.com/kei-ito/rollup-plugin-embed-css/commit/60371c134ef3bd45a9e6d39bbf195ae14576eca7))

### Tests

- run tests without ava ([33072bf](https://github.com/kei-ito/rollup-plugin-embed-css/commit/33072bf37406fcabc571b3699f795cfdb749bd79))


## v1.0.14 (2020-01-22)

### Features

- hoist css imported by dependencies ([7b5794e](https://github.com/kei-ito/rollup-plugin-embed-css/commit/7b5794e1b4acd7fcb717f8b85dc991976773a59f))

### Bug Fixes

- sorting chunks ([e61fdd5](https://github.com/kei-ito/rollup-plugin-embed-css/commit/e61fdd52c43d83a0a50bd0f2f09f4c2b2b7e3107))

### Tests

- test css hoisting ([e1889e5](https://github.com/kei-ito/rollup-plugin-embed-css/commit/e1889e5ed7c457f275cd6ab3adc896c52ab9192a))

### Code Refactoring

- refactor plugin cores ([2c014ee](https://github.com/kei-ito/rollup-plugin-embed-css/commit/2c014eec49a079fde0261455f3ac2d7b6465ef1b))


## v1.0.13 (2020-01-19)

### Bug Fixes

- css output (#110) ([7dc0d1e](https://github.com/kei-ito/rollup-plugin-embed-css/commit/7dc0d1e7cede3457ddb1c2d8799106502e19bf6c))


## v1.0.12 (2020-01-19)

### Features

- support esifycss' feature that output css file (#109) ([596836f](https://github.com/kei-ito/rollup-plugin-embed-css/commit/596836f72551b4ff052e33ebb34dfc5a556f5c03))


## v1.0.11 (2019-12-09)

### Code Refactoring

- fix eslint errors ([9344e82](https://github.com/kei-ito/rollup-plugin-embed-css/commit/9344e8267a66bd16074227a90dd47f3220ea8e92))


## v1.0.10 (2019-12-09)


## v1.0.9 (2019-12-07)


## v1.0.8 (2019-12-06)


## v1.0.7 (2019-09-20)

### Bug Fixes

- updateBundle ([9d36ef9](https://github.com/kei-ito/rollup-plugin-embed-css/commit/9d36ef9655c9d3ffd3bfc09f91ff13978169ba42))


## v1.0.6 (2019-09-20)

### Bug Fixes

- summarize tokens before embedding dictionaries (#104) ([108fc71](https://github.com/kei-ito/rollup-plugin-embed-css/commit/108fc7112eddabc2bd3c9ea859d6bf0c015e10e6))


## v1.0.5 (2019-09-04)

### Bug Fixes

- upgrade esifycss to allow dynamic import (#102) ([e924275](https://github.com/kei-ito/rollup-plugin-embed-css/commit/e924275ca87e696b87bac75ce3061d36aff17700))


## v1.0.4 (2019-07-08)

### Bug Fixes

- overwrite module.exports directly (#98) ([dc7c50b](https://github.com/kei-ito/rollup-plugin-embed-css/commit/dc7c50bf2cfc95875d160a9f5d1a91fa878f65e7))


## v1.0.3 (2019-07-08)


## v1.0.2 (2019-07-05)

### Code Refactoring

- bundle without intermediates (#97) ([e110ca9](https://github.com/kei-ito/rollup-plugin-embed-css/commit/e110ca91059e264fe24a78556b467053d408f7c2))


## v1.0.1 (2019-06-22)

### Documentation

- update README ([cf3a362](https://github.com/kei-ito/rollup-plugin-embed-css/commit/cf3a362e2331981ccc1f3db4c2ba991b1c67de2f))


## v1.0.0 (2019-06-22)

### Features

- use esifycss (#92) ([5f55f2d](https://github.com/kei-ito/rollup-plugin-embed-css/commit/5f55f2d655c46522a6ad0ec248a863f8c9a965f1))

### Documentation

- add document about generateCode (#64) ([424c7be](https://github.com/kei-ito/rollup-plugin-embed-css/commit/424c7bebfa3fb9f3de4fd565046a261c887ebcdc))


## v0.4.0 (2019-01-23)

### Features

- permit specification of alternate CSS template (#62) ([798788c](https://github.com/kei-ito/rollup-plugin-embed-css/commit/798788ce21900033ebb4bfe76e11229f60fa6c74))

### Tests

- test generateCode (#63) ([eb10fc6](https://github.com/kei-ito/rollup-plugin-embed-css/commit/eb10fc663256c5f78fec1c63cfad3e6e4fae4a49))

### Code Refactoring

- fix eslint errors ([e6799d6](https://github.com/kei-ito/rollup-plugin-embed-css/commit/e6799d621a5bfb7c944b13be45dc84b8005de99a))


## v0.3.3 (2018-12-30)


## v0.3.2 (2018-10-05)


## v0.3.1 (2018-10-05)


## v0.3.0 (2018-09-19)


## v0.2.5 (2018-09-13)


## v0.2.4 (2018-09-13)


## v0.2.1 (2018-08-31)


## v0.2.0 (2018-08-29)


## v0.1.21 (2018-06-24)


## v0.1.20 (2018-06-23)


## v0.1.19 (2018-04-26)


## v0.1.17 (2018-04-23)


## v0.1.16 (2018-04-12)


## v0.1.15 (2018-04-09)


## v0.1.14 (2018-04-09)


## v0.1.13 (2018-04-09)


## v0.1.12 (2018-04-08)


## v0.1.10 (2018-02-01)


## v0.1.9 (2018-01-12)


## v0.1.8 (2018-01-09)


## v0.1.7 (2017-10-23)


## v0.1.6 (2017-10-23)


## v0.1.5 (2017-10-03)


## v0.1.4 (2017-09-22)


## v0.1.2 (2017-07-31)


## v0.1.1 (2017-07-24)


## v0.1.0 (2017-07-21)


## v0.0.8 (2017-07-21)


## v0.0.7 (2017-07-21)


## v0.0.6 (2017-07-21)


## v0.0.5 (2017-07-20)


## v0.0.4 (2017-07-20)


## v0.0.3 (2017-07-10)


## v0.0.2 (2017-07-03)


## v0.0.1 (2017-06-29)


