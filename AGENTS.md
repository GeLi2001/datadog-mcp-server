# Agent Instructions

## Release process (Release Please)
- **Do not manually edit `CHANGELOG.md`.**
- **Do not manually bump versions in `package.json` or `package-lock.json`.**
- This repo uses **Release Please** (`.github/workflows/release-please.yml`) to open release PRs and manage versions/changelogs.
- Release artifacts are produced by CI after Release Please creates a release. All release changes must go through that workflow.

If you need a release, create a PR with your changes and let Release Please handle the version + changelog.
