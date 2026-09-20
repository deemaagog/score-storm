# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.4.0](https://github.com/deemaagog/score-storm/compare/v0.3.4...v0.4.0) (2026-09-20)

### Bug Fixes

* fix clef changes, remove Clef-GrahicalClef relation ([c039d9c](https://github.com/deemaagog/score-storm/commit/c039d9c464ceac64ac740c374ad68ee8a7915f5c)) - by @deemaagog
* fix getting coordinates on scrolled page ([2d032f3](https://github.com/deemaagog/score-storm/commit/2d032f3a4a490f401a96685cd50ee4dae8739cf7)) - by @deemaagog
* fix hover and selection on multipage canvas ([8e5becf](https://github.com/deemaagog/score-storm/commit/8e5becfbe5d01cd57f4d241a7a501fb4ed07952d)) - by @deemaagog
* fix measure commands ([baedbaf](https://github.com/deemaagog/score-storm/commit/baedbafc24728b38c49c116f45834f3104126334)) - by @deemaagog
* fix selection provider ([9e2a12f](https://github.com/deemaagog/score-storm/commit/9e2a12ff08938b45d60965f5f22c67602048b4d5)) - by @deemaagog
* fix system Y position for pages other than first ([559a66f](https://github.com/deemaagog/score-storm/commit/559a66fb929ed19dc9b228568d0f08c7bb004696)) - by @deemaagog
* fix time signature selection ([17007cd](https://github.com/deemaagog/score-storm/commit/17007cd7b70c2df6d323db9219e0e51ef56a5286)) - by @deemaagog
* handle resize ([038f620](https://github.com/deemaagog/score-storm/commit/038f620a0e57707169ee4f70febe8c73c7a4a1ab)) - by @deemaagog
* row packing ([7bee518](https://github.com/deemaagog/score-storm/commit/7bee518aeb86a025f893969d62a6041dfbb9a41d)) - by @deemaagog
* typo ([d52ce65](https://github.com/deemaagog/score-storm/commit/d52ce65d43e51fba4623c216f1312f7cbc1d8ca1)) - by @deemaagog
* upgrade playwright and snapshots ([#85](https://github.com/deemaagog/score-storm/issues/85)) ([844765c](https://github.com/deemaagog/score-storm/commit/844765c26c6b39c6bbbb4ae8d66d2fc745f20341)) - by @deemaagog

### Features

* account for page index in editor events ([db2fc75](https://github.com/deemaagog/score-storm/commit/db2fc7550cf531d77b786a4939bc716b8c2a8a5a)) - by @deemaagog
* account for pages with fixed height  in page breaks calculation ([2df10cf](https://github.com/deemaagog/score-storm/commit/2df10cf1154a1068c1e3e9be4dca1b3daeb47bbc)) - by @deemaagog
* add layout interface ([af03fec](https://github.com/deemaagog/score-storm/commit/af03fecb8f7feee24a286a067551ff9f6f091749)) - by @deemaagog
* add layout switcher ([10c91bd](https://github.com/deemaagog/score-storm/commit/10c91bdd53db69048ace435a1dd435e3f9b2df04)) - by @deemaagog
* fix cursor for multipage score ([0537ae4](https://github.com/deemaagog/score-storm/commit/0537ae41006be6b3d1742efc2f903aee767df1ba)) - by @deemaagog
* implement horizontal justification (springs and rods), distribute available row space ([18b6fb4](https://github.com/deemaagog/score-storm/commit/18b6fb4ef1c604df1a2d346bde4cf8685c479a5c)) - by @deemaagog
* introduce pages in graphical score ([c74df6f](https://github.com/deemaagog/score-storm/commit/c74df6fe06d0ab6eda3c3dc09192ee64d1bfb7e0)) - by @deemaagog
* multipage layout for node skia renderer ([336acfb](https://github.com/deemaagog/score-storm/commit/336acfb8c564ce12add6934692e05e2f5e5d6b81)) - by @deemaagog
* multipage layout for svg and canvas renderers ([f90a540](https://github.com/deemaagog/score-storm/commit/f90a540740764e9ba96eb4dbb16dd03a107327d6)) - by @deemaagog
* render dots ([73d9e9c](https://github.com/deemaagog/score-storm/commit/73d9e9cb2b0f3965bfff986e21352ee5a08f98cb)) - by @deemaagog
* set default layout ([9c26f37](https://github.com/deemaagog/score-storm/commit/9c26f37bd4b1e797978f06cde3ca4c333ed5fad8)) - by @deemaagog
* store space between rows and space between instruments in settings ([47bddc4](https://github.com/deemaagog/score-storm/commit/47bddc4f8e3230ca82d8fcd4e9eb253b6f5de072)) - by @deemaagog
* upgrade mantine and setup notifications ([7b47787](https://github.com/deemaagog/score-storm/commit/7b477876c5647b7e381b950a8fb8eb1c78a3c6bd)) - by @deemaagog
* use stable graphical ids ([fd93bb4](https://github.com/deemaagog/score-storm/commit/fd93bb4c8f8de07e64b336825993464f2956e588)) - by @deemaagog

## [0.3.4](https://github.com/deemaagog/score-storm/compare/v0.3.3...v0.3.4) (2025-03-01)

### Features

* implement undo-redo ([a6fcdb9](https://github.com/deemaagog/score-storm/commit/a6fcdb947a5dbb7c7590821a4787c1f1f0bf9e78)) - by @deemaagog

## [0.3.3](https://github.com/deemaagog/score-storm/compare/v0.3.2...v0.3.3) (2025-02-23)

### Bug Fixes

* adjust cursor vertical position ([22c455e](https://github.com/deemaagog/score-storm/commit/22c455e668b105486666455962a3f83c064ac470)) - by @deemaagog
* **renderer:** fix renderer clean up ([8aa347e](https://github.com/deemaagog/score-storm/commit/8aa347e772978d1fa7761b432dd9d36261899816)) - by @deemaagog

### Features

* add initial web player implementation ([6554851](https://github.com/deemaagog/score-storm/commit/6554851a0c969a07a30dfd6a4546a21a6063cb3b)) - by @deemaagog
* redesign full-featured-editor and add basic cursor implementation ([0d68406](https://github.com/deemaagog/score-storm/commit/0d6840656f60e631d77e0bae9a6e9f9436ac9f65)) - by @deemaagog
* render ledger lines ([b373070](https://github.com/deemaagog/score-storm/commit/b373070c4fe7ee5964a7ce73bb6511aa94fb9677)) - by @deemaagog
* store global measure and global beat position, other rendering improvements ([492de0d](https://github.com/deemaagog/score-storm/commit/492de0d1766d8edd41f3e064ffa74d356f0ff05d)) - by @deemaagog

## [0.3.2](https://github.com/deemaagog/score-storm/compare/v0.2.2...v0.3.2) (2024-12-31)

### Features

* handle pitch ([e283991](https://github.com/deemaagog/score-storm/commit/e283991625413de76979cc675966bec60d3ec5eb)) - by @deemaagog

## [0.2.2](https://github.com/deemaagog/score-storm/compare/v0.2.1...v0.2.2) (2024-11-04)

### Features

* **node-skia-renderer:** add export svg ([0acc744](https://github.com/deemaagog/score-storm/commit/0acc744e32a97d91197dd17c4615ef4a1725dfe5)) - by @deemaagog

## [0.2.1](https://github.com/deemaagog/score-storm/compare/v0.1.1...v0.2.1) (2024-10-29)

### Features

* add node skia renderer ([4001290](https://github.com/deemaagog/score-storm/commit/4001290984e617494d2fb5f952312ddba05b6d88)) - by @deemaagog

## [0.1.1](https://github.com/deemaagog/score-storm/compare/v0.1.0...v0.1.1) (2024-10-24)

**Note:** Version bump only for package score-storm

# 0.1.0 (2024-10-24)

### Bug Fixes

* fix editor iframe url ([f116053](https://github.com/deemaagog/score-storm/commit/f116053ff59554edb2f39cd346137b03e558fb56)) - by @deemaagog

### Features

* add  bounding box in debug mode and adjust x position of clef and time ([baf7153](https://github.com/deemaagog/score-storm/commit/baf7153cdd90a93d202f10aef1920b40b0d16ebb)) - by @deemaagog
* add event manager ([a955fa7](https://github.com/deemaagog/score-storm/commit/a955fa7e8ce8dce62d3d2945f69fbf6d30fbfaef)), closes [#29](https://github.com/deemaagog/score-storm/issues/29) - by @deemaagog
* basic clef rendering implementation ([1bd9cf2](https://github.com/deemaagog/score-storm/commit/1bd9cf28619b038889adf5eed41e1d4bc00682e2)) - by @deemaagog
* canvas dynamic width ([f89a8d3](https://github.com/deemaagog/score-storm/commit/f89a8d32316ee5dc53d929d5b01b1bf44c0be803)) - by @deemaagog
* **canvas-renderer:** fix rendering for high resolution displays ([5639144](https://github.com/deemaagog/score-storm/commit/5639144fc277c84ea48065be76a57c4acf83dcc6)) - by @deemaagog
* **core:** init score model ([15891f1](https://github.com/deemaagog/score-storm/commit/15891f13bfe62f293230e3ad51b4ccbadade69b5)) - by @deemaagog
* **core:** introduce graphical score model ([2866485](https://github.com/deemaagog/score-storm/commit/28664858b656768cd4e7e24ac1f3ece4049cfefe)) - by @deemaagog
* implement svg renderer ([4107f3f](https://github.com/deemaagog/score-storm/commit/4107f3fdb0c7c4a9e4a9ced5f56a6f4a0393f9c6)) - by @deemaagog
* improve object selection ([47ed0ae](https://github.com/deemaagog/score-storm/commit/47ed0ae9cc8aa922d7c8ef699407911a6775eb9a)) - by @deemaagog
* improve score height calculation ([dbe20cf](https://github.com/deemaagog/score-storm/commit/dbe20cff579e3c73a6cda3478e6c4993a8473d08)), closes [#16](https://github.com/deemaagog/score-storm/issues/16) - by @deemaagog
* init full featured editor implementation ([c31d841](https://github.com/deemaagog/score-storm/commit/c31d8410a36ce78529f2530f90fb7edca2a4fe89)) - by @deemaagog
* init global measure justification ([7efcc78](https://github.com/deemaagog/score-storm/commit/7efcc78b61872e07a9b01bfeda5ae6a6fe2fb750)) - by @deemaagog
* init object selection ([9fcb18c](https://github.com/deemaagog/score-storm/commit/9fcb18c876d155ce4b9d7c77d5f7daf2cad61ab7)) - by @deemaagog
* render 8th, 16th, 32nd, 64th notes and rests ([e3e22cc](https://github.com/deemaagog/score-storm/commit/e3e22ccaaff183af7294925ac4abcfdbc6a019c9)) - by @deemaagog
* render and edit accidentals ([38bc677](https://github.com/deemaagog/score-storm/commit/38bc67781273a7245194c152846aa5edc1613fcc)) - by @deemaagog
* render instruments ([65113cc](https://github.com/deemaagog/score-storm/commit/65113cc2e14a16ff5f08ed0f4d0d29d233804f18)), closes [#28](https://github.com/deemaagog/score-storm/issues/28) - by @deemaagog
* render whole, half and quarter notes and rests ([404def0](https://github.com/deemaagog/score-storm/commit/404def0a6ab194016feafd66eed5181bb064c339)), closes [#14](https://github.com/deemaagog/score-storm/issues/14) - by @deemaagog
* restore selection after rerender ([602c187](https://github.com/deemaagog/score-storm/commit/602c18756beae9c11152753af3186343872470a7)) - by @deemaagog
