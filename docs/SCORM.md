# SCORM packaging notes

## Required files in the SCORM ZIP
Include:
- `index.html`
- `index_fr.html`
- `manifest.xml`
- `assets/`

Optional (only if your workflow uses them):
- `package.json`
- lockfile (`package-lock.json` or `pnpm-lock.yaml` / `yarn.lock`)

## Manifest
`manifest.xml` defines:
- the organization / items (what launches)
- resources (what files are part of the package)

**Tip:** If the LMS only launches one entry point, you can:
- launch EN by default and provide an in-app language toggle, or
- include two items (EN/FR) if your LMS supports choosing entry points

## Common gotchas
- Paths must be **relative** within the package (avoid absolute `/content/enforced/...` paths for SCORM ZIPs).
- Ensure filenames match case (macOS can hide case mismatches; LMS servers may be case-sensitive).
