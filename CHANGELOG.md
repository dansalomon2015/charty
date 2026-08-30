# Changelog

All notable changes to Charty are documented here. The project follows
[Semantic Versioning](https://semver.org/).

## Unreleased

### Added

- Responsive and accessible `LineChart` with controlled single or multiple
  selection.
- Responsive `AreaChart` with solid or vertical gradient fills and the same
  controlled selection API.
- Optional horizontal line gradients and point customization.
- Exported light and dark theme presets through `chartThemes`,
  `lightChartTheme`, and `darkChartTheme`.
- Shared cartesian layout primitives for future chart types.

### Changed

- Chart selection types and transitions are now reusable across cartesian
  charts while the existing `BarChart` names remain compatible.

## [0.2.0] - 2026-08-23

### Added

- Controlled multiple selection for `BarChart`.
- Long-press activation on React Native and touch devices.
- `Ctrl + click` and `Command + click` activation on React Native Web.
- Selection transition metadata through `onSelectionChange`.
- Coordinated example that aggregates selected months into `DonutChart`.

### Changed

- An empty example selection now represents all months instead of hiding the
  donut chart.

## [0.1.1] - 2026-08-23

### Added

- First public npm release with `BarChart`, `DonutChart`, TypeScript types,
  responsive sizing, accessibility labels, theming, and Expo support.

[0.2.0]: https://github.com/dansalomon2015/charty/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/dansalomon2015/charty/releases/tag/v0.1.1
