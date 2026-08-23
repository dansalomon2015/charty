# Contributing to Charty

Thanks for helping make financial charts easier to use in React Native apps.

## Development

1. Fork and clone the repository.
2. Install dependencies with `npm install`.
3. Run `npm run verify` before opening a pull request.

Keep pull requests focused. New chart types should start with an issue that
describes the user need, accessibility behavior, and proposed API.

## Releasing

Maintainers publish releases from GitHub Actions using the manual **Release**
workflow:

1. Open **Actions → Release → Run workflow**.
2. Enter the branch containing the exact code to publish.
3. Select `patch`, `minor`, or `major` for the semantic version increment.
4. Run the workflow and review its summary.

The workflow verifies that the branch starts from the latest npm version, runs
the complete test and build suite, updates the package version, publishes to
npm, pushes the version commit and tag, and creates a GitHub Release with
generated notes.

npm publishing uses OpenID Connect. The package must trust the
`release.yml` workflow from `dansalomon2015/charty`; no `NPM_TOKEN` secret is
required.

## Bug reports

Include a minimal reproduction, the React Native or Expo version, the platform,
and the expected and actual behavior. Screenshots are useful for visual bugs,
but please also describe the underlying data.
