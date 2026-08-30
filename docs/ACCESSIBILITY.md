# Accessibility test guide

Charty provides chart semantics; consuming applications remain responsible for
surrounding instructions, focus order, localization, and testing their final
color overrides.

## Automated checks

Run the library verification before every release:

```sh
npm run verify
```

The suite runs axe against the DOM rendered by all five chart types and checks
selection semantics, accessible web toggle properties, SVG font scaling, and
the minimum contrast of built-in theme colors.

## iOS with VoiceOver

1. Open the Expo example on an iOS device or simulator.
2. Enable VoiceOver and navigate through every chart.
3. Confirm that each chart summary is announced once and each value has its
   label and formatted value.
4. On the line, area, and bar charts, confirm that values are announced as
   buttons, the selected state changes, and the application hint is announced.
5. Increase Larger Text and confirm that axis labels grow without being clipped.

## Android with TalkBack

Repeat the same checks on Android with TalkBack. Verify that swipe navigation
reaches every interactive value and that double tap and long press update the
controlled selection.

## Web

1. Navigate the interactive line, area, and bar values with the keyboard.
2. Confirm that each value is a button with an accessible name and
   `aria-pressed="true"` or `aria-pressed="false"`.
3. Confirm that `Ctrl + click` (Windows/Linux) or `Command + click` (macOS)
   starts multiple selection and ordinary clicks then add or remove values.
4. Run an accessibility inspector on the complete consuming application;
   Charty cannot validate headings, landmarks, or custom colors outside the
   chart components.
