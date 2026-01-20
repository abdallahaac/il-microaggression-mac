# Recognizing Microaggressions Towards Indigenous Peoples (SCORM 1.2)

This project is a modularized SCORM 1.2 + Brightspace-compatible version of the original single-file course, with shared CSS/JS for EN and FR.

## Run locally
- Open `index.html` (EN) or `index_fr.html` (FR) directly in a browser.
- Or run `npm run dev` after `npm install`, then open `http://127.0.0.1:8080/index.html` or `http://127.0.0.1:8080/index_fr.html`.

## Package SCORM ZIPs
1. Install dependencies: `npm install`
2. Package EN: `npm run package-en`
3. Package FR: `npm run package-fr`
4. Package both: `npm run package-all`

`package-fr` temporarily swaps `imsmanifest.xml` using `imsmanifest_fr.xml` to ensure the FR zip launches `index_fr.html`.

## Brightspace Manage Files (non-SCORM)
- Upload `index.html` (or `index_fr.html`) and the entire `assets` folder to the course files area.
- The course will run without SCORM API and still function normally.

## Brightspace core bundle reference
- If your deployment requires `brightspace-core-bundle.js`, keep or update the `<script type="module" src="...">` tag in `index.html` to match your enforced content path.
