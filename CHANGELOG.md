# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
