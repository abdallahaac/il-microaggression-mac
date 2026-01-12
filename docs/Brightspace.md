# Brightspace deployment notes

## If used as HTML content (not SCORM)
When uploading to Brightspace Manage Files:
- keep `assets/` next to the HTML files
- verify image paths are relative, e.g. `assets/images/...`

## If used as SCORM in Brightspace
- Upload the SCORM ZIP via the SCORM tool / course admin workflow.
- Confirm the launch file matches what `manifest.xml` points to.

## Troubleshooting checklist
- Images missing: check relative paths + file case sensitivity.
- Fonts/CSS not loading: verify they’re packaged (or loaded from approved CDNs).
- Links redirect weirdly: confirm you’re not using environment-specific URLs.
