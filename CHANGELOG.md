# Changelog

All notable changes to Charty are documented here. The project follows
[Semantic Versioning](https://semver.org/).

## [0.3.0] - 2026-08-30

### Added

- Responsive and accessible `LineChart` with controlled single or multiple
  selection.
- Responsive `AreaChart` with solid or vertical gradient fills and the same
  controlled selection API.
- Accessible `ProgressRing` for bounded goals with theme colors, customizable
  center content, and safe handling of invalid values.
- Optional horizontal line gradients and point customization.
- Exported light and dark theme presets through `chartThemes`,
  `lightChartTheme`, and `darkChartTheme`.
- Shared cartesian layout primitives for future chart types.
- Accessible interaction hints through the shared `accessibilityHint` prop.
- System font scaling for cartesian SVG labels, with an optional `fontScale`
  override for deterministic previews and tests.
- Automated axe coverage and a manual accessibility test guide for all five
  chart types.

### Changed

- Chart selection types and transitions are now reusable across cartesian
  charts while the existing `BarChart` names remain compatible.
- Interactive web values expose their selection through `aria-pressed`.
- Light theme selection, reference, and donut colors now meet stronger contrast
  requirements on white backgrounds.
- Non-interactive progress rings are exposed as images without a disabled state.
- The README now documents shared customization, component APIs, theme
  fallbacks, responsive sizing, and custom center content.

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

[0.3.0]: https://github.com/dansalomon2015/charty/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/dansalomon2015/charty/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/dansalomon2015/charty/releases/tag/v0.1.1
