import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import glob from 'glob-all';
import { readFileSync } from 'fs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';

const { version } = JSON.parse(readFileSync('./package.json'));
const buildDate = Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto' }).format(new Date());

const jsGlob = [
'@(components|controllers|directives|helpers|mixins|templates|test)/**/*.js',
'./index.js',
'!**/*.@(test|axe|vdiff).js',
];
const nonJsGlob = [
'@(components|controllers|directives|helpers|mixins|templates|test)/**/*.*',
'*.*',
'!**/*.@(js|md|json)',
'!**/golden/**/*',
'./custom-elements.json',
];

export default {
input: glob.sync(jsGlob),
output: { dir: 'build', format: 'es', preserveModules: true },
external: ['@brightspace-ui/testing', 'sinon'],
plugins: [
del({ targets: 'build' }),
copy({
targets: [{
src: nonJsGlob,
dest: 'build',
rename: (_name, _extension, fullpath) => fullpath,
}],
}),
replace({
include: './index.js',
preventAssignment: false,
values: {
'window.**buildDate**': JSON.stringify(buildDate),
'window.**buildVersion**': JSON.stringify(version),
},
}),
resolve(),
dynamicImportVars(),
],
};

rollup.js

import resolve from '@rollup/plugin-node-resolve';

const stripD2lIconDefine = () => ({
name: 'strip-d2l-icon-define',
renderChunk(code) {
const updated = code.replace(
/if\\s*\\(!customElements\\.get\\(\"d2l-icon\"\\)\\)\\s*\\{\\s*customElements\\.define\\(\"d2l-icon\",\\s*Icon\\);\\s*\\}\\s*/g,
''
);
if (updated === code) return null;
return { code: updated, map: null };
},
});

export default {
input: 'brightspace-bundle/entry.js',
output: {
file: 'dist/brightspace-core-bundle.js',
format: 'es',
inlineDynamicImports: true,
},
plugins: [
resolve({ browser: true }),
stripD2lIconDefine(),
],
treeshake: true,
};

entry.js
/_ ==========================================================
Brightspace Core Components - Entry Imports
(Excludes /test/ and /demo/ files)
========================================================== _/

/_ alert _/
import "../components/alert/alert-toast.js";
import "../components/alert/alert.js";

/_ backdrop _/
import "../components/backdrop/backdrop.js";

/_ breadcrumbs _/
import "../components/breadcrumbs/breadcrumb-current-page.js";
import "../components/breadcrumbs/breadcrumb.js";
import "../components/breadcrumbs/breadcrumbs.js";

/_ button _/
import "../components/button/button-add.js";
import "../components/button/button-copy.js";
import "../components/button/button-icon.js";
import "../components/button/button-mixin.js";
import "../components/button/button-move.js";
import "../components/button/button-split-item.js";
import "../components/button/button-split.js";
import "../components/button/button-styles.js";
import "../components/button/button-subtle.js";
import "../components/button/button-toggle.js";
import "../components/button/button.js";
import "../components/button/floating-buttons.js";

/_ calendar _/
import "../components/calendar/calendar.js";

/_ card _/
import "../components/card/card-content-meta.js";
import "../components/card/card-content-title.js";
import "../components/card/card-footer-link.js";
import "../components/card/card-loading-shimmer.js";
import "../components/card/card.js";

/_ collapsible-panel _/
import "../components/collapsible-panel/collapsible-panel-group.js";
import "../components/collapsible-panel/collapsible-panel-summary-item.js";
import "../components/collapsible-panel/collapsible-panel.js";

/_ colors _/
import "../components/colors/colors.js";

/_ count-badge _/
import "../components/count-badge/count-badge-icon.js";
import "../components/count-badge/count-badge-mixin.js";
import "../components/count-badge/count-badge.js";

/_ description-list _/
import "../components/description-list/description-list-wrapper.js";

/_ dialog _/
import "../components/dialog/dialog-confirm.js";
import "../components/dialog/dialog-fullscreen.js";
import "../components/dialog/dialog-mixin.js";
import "../components/dialog/dialog-styles.js";
import "../components/dialog/dialog.js";

/_ dropdown _/
import "../components/dropdown/dropdown-button-subtle.js";
import "../components/dropdown/dropdown-button.js";
import "../components/dropdown/dropdown-content-mixin.js";
import "../components/dropdown/dropdown-content-styles.js";
import "../components/dropdown/dropdown-content.js";
import "../components/dropdown/dropdown-context-menu.js";
import "../components/dropdown/dropdown-menu.js";
import "../components/dropdown/dropdown-more.js";
import "../components/dropdown/dropdown-opener-mixin.js";
import "../components/dropdown/dropdown-opener-styles.js";
import "../components/dropdown/dropdown-popover-mixin.js";
import "../components/dropdown/dropdown-tabs.js";
import "../components/dropdown/dropdown.js";

/_ empty-state _/
import "../components/empty-state/empty-state-action-button.js";
import "../components/empty-state/empty-state-action-link.js";
import "../components/empty-state/empty-state-illustrated.js";
import "../components/empty-state/empty-state-mixin.js";
import "../components/empty-state/empty-state-simple.js";
import "../components/empty-state/empty-state-styles.js";

/_ expand-collapse _/
import "../components/expand-collapse/expand-collapse-content.js";

/_ filter _/
import "../components/filter/filter-dimension-set-date-text-value.js";
import "../components/filter/filter-dimension-set-date-time-range-value.js";
import "../components/filter/filter-dimension-set-empty-state.js";
import "../components/filter/filter-dimension-set-value.js";
import "../components/filter/filter-dimension-set.js";
import "../components/filter/filter-overflow-group.js";
import "../components/filter/filter-tags.js";
import "../components/filter/filter.js";

/_ focus-trap _/
import "../components/focus-trap/focus-trap.js";

/_ form _/
import "../components/form/form-element-localize-helper.js";
import "../components/form/form-element-mixin.js";
import "../components/form/form-error-summary.js";
import "../components/form/form-helper.js";
import "../components/form/form.js";

/_ hierarchical-view _/
import "../components/hierarchical-view/hierarchical-view-mixin.js";
import "../components/hierarchical-view/hierarchical-view.js";

/_ html-block _/
import "../components/html-block/html-block.js";

/_ icons _/
import "../components/icons/fix-svg.js";
import "../components/icons/getFileIconType.js";
import "../components/icons/icon-custom.js";
import "../components/icons/icon-styles.js";
import "../components/icons/icon.js";
import "../components/icons/slotted-icon-mixin.js";

/_ inputs _/
import "../components/inputs/input-checkbox-group.js";
import "../components/inputs/input-checkbox.js";
import "../components/inputs/input-color.js";
import "../components/inputs/input-date-range.js";
import "../components/inputs/input-date-time-range-to.js";
import "../components/inputs/input-date-time-range.js";
import "../components/inputs/input-date-time.js";
import "../components/inputs/input-date.js";
import "../components/inputs/input-fieldset.js";
import "../components/inputs/input-group.js";
import "../components/inputs/input-inline-help.js";
import "../components/inputs/input-label-styles.js";
import "../components/inputs/input-number.js";
import "../components/inputs/input-percent.js";
import "../components/inputs/input-radio-group.js";
import "../components/inputs/input-radio-spacer.js";
import "../components/inputs/input-radio-styles.js";
import "../components/inputs/input-radio.js";
import "../components/inputs/input-search.js";
import "../components/inputs/input-select-styles.js";
import "../components/inputs/input-styles.js";
import "../components/inputs/input-text.js";
import "../components/inputs/input-textarea.js";
import "../components/inputs/input-time-range.js";
import "../components/inputs/input-time.js";

/_ link _/
import "../components/link/link-mixin.js";
import "../components/link/link-styles.js";
import "../components/link/link.js";

/_ list _/
import "../components/list/list-controls.js";
import "../components/list/list-item-button-mixin.js";
import "../components/list/list-item-button.js";
import "../components/list/list-item-checkbox-mixin.js";
import "../components/list/list-item-content.js";
import "../components/list/list-item-drag-drop-mixin.js";
import "../components/list/list-item-drag-handle.js";
import "../components/list/list-item-drag-image.js";
import "../components/list/list-item-expand-collapse-mixin.js";
import "../components/list/list-item-generic-layout.js";
import "../components/list/list-item-link-mixin.js";
import "../components/list/list-item-mixin.js";
import "../components/list/list-item-nav-mixin.js";
import "../components/list/list-item-nav.js";
import "../components/list/list-item-placement-marker.js";
import "../components/list/list-item-role-mixin.js";
import "../components/list/list-item.js";
import "../components/list/list.js";

/_ loading-spinner _/
import "../components/loading-spinner/loading-spinner.js";

/_ menu _/
import "../components/menu/menu-item-checkbox.js";
import "../components/menu/menu-item-link.js";
import "../components/menu/menu-item-mixin.js";
import "../components/menu/menu-item-radio-mixin.js";
import "../components/menu/menu-item-radio.js";
import "../components/menu/menu-item-return.js";
import "../components/menu/menu-item-selectable-mixin.js";
import "../components/menu/menu-item-selectable-styles.js";
import "../components/menu/menu-item-separator.js";
import "../components/menu/menu-item-styles.js";
import "../components/menu/menu-item.js";
import "../components/menu/menu.js";

/_ meter _/
import "../components/meter/meter-circle.js";
import "../components/meter/meter-linear.js";
import "../components/meter/meter-mixin.js";
import "../components/meter/meter-radial.js";
import "../components/meter/meter-styles.js";

/_ more-less _/
import "../components/more-less/more-less.js";

/_ object-property-list _/
import "../components/object-property-list/object-property-list-item-link.js";
import "../components/object-property-list/object-property-list-item-tooltip-help.js";
import "../components/object-property-list/object-property-list-item.js";
import "../components/object-property-list/object-property-list.js";

/_ offscreen _/
import "../components/offscreen/offscreen.js";
import "../components/offscreen/screen-reader-pause.js";

/_ overflow-group _/
import "../components/overflow-group/overflow-group-mixin.js";
import "../components/overflow-group/overflow-group.js";

/_ paging _/
import "../components/paging/pageable-mixin.js";
import "../components/paging/pageable-subscriber-mixin.js";
import "../components/paging/pager-load-more.js";

/_ popover _/
import "../components/popover/popover-mixin.js";

/_ progress _/
import "../components/progress/progress.js";

/_ scroll-wrapper _/
import "../components/scroll-wrapper/scroll-wrapper.js";

/_ selection _/
import "../components/selection/selection-action-dropdown.js";
import "../components/selection/selection-action-menu-item.js";
import "../components/selection/selection-action-mixin.js";
import "../components/selection/selection-action.js";
import "../components/selection/selection-controls.js";
import "../components/selection/selection-input.js";
import "../components/selection/selection-mixin.js";
import "../components/selection/selection-observer-mixin.js";
import "../components/selection/selection-select-all-pages.js";
import "../components/selection/selection-select-all.js";
import "../components/selection/selection-summary.js";

/_ skeleton _/
import "../components/skeleton/skeleton-group-mixin.js";
import "../components/skeleton/skeleton-mixin.js";

/_ sorting _/
import "../components/sorting/sort-item.js";
import "../components/sorting/sort.js";

/_ status-indicator _/
import "../components/status-indicator/status-indicator.js";

/_ switch _/
import "../components/switch/switch-mixin.js";
import "../components/switch/switch-visibility.js";
import "../components/switch/switch.js";

/_ table _/
import "../components/table/table-col-sort-button-item.js";
import "../components/table/table-col-sort-button.js";
import "../components/table/table-controls.js";
import "../components/table/table-wrapper.js";

/_ tabs _/
import "../components/tabs/tab-internal.js";
import "../components/tabs/tab-mixin.js";
import "../components/tabs/tab-panel-mixin.js";
import "../components/tabs/tab-panel.js";
import "../components/tabs/tab.js";
import "../components/tabs/tabs.js";

/_ tag-list _/
import "../components/tag-list/tag-list-item-mixin.js";
import "../components/tag-list/tag-list-item.js";
import "../components/tag-list/tag-list.js";

/_ tooltip _/
import "../components/tooltip/tooltip-help.js";
import "../components/tooltip/tooltip.js";

/_ typography _/
import "../components/typography/styles.js";
import "../components/typography/typography.js";

/_ validation _/
import "../components/validation/validation-custom-mixin.js";
import "../components/validation/validation-custom.js";

/_ view-switcher _/
import "../components/view-switcher/view-switcher-button.js";
import "../components/view-switcher/view-switcher.js";

orhinal package.json
{
"name": "@brightspace-ui/core",
"version": "3.206.0",
"description": "A collection of accessible, free, open-source web components for building Brightspace applications",
"type": "module",
"repository": "https://github.com/BrightspaceUI/core.git",
"publishConfig": {
"access": "public"
},
"scripts": {
"build:clean": "node ./cli/clean.js",
"build:icons": "node ./cli/icon-generator.js",
"build:illustrations": "node ./cli/empty-state-illustration-generator.js",
"build:sass": "sass ./test/sass.scss > ./test/sass.output.css",
"build:wca": "wca analyze \"{components,templates}/**/\*.js\" --format json --outFile custom-elements.json",
"build": "npm run build:clean && npm run build:icons && npm run build:illustrations && npm run build:sass && npm run build:wca",
"build:brightspace-bundle": "rollup -c ./rollup/rollup.brightspace-bundle.config.js",
"build-static": "rollup -c ./rollup/rollup.config.js",
"lint": "npm run lint:eslint && npm run lint:style",
"lint:eslint": "eslint .",
"lint:style": "stylelint \"**/\*.{js,html}\" --ignore-path .gitignore",
"start": "web-dev-server --node-resolve --watch --open",
"test": "npm run lint && npm run test:translations && npm run test:unit && npm run test:axe",
"test:axe": "d2l-test-runner axe --chrome",
"test:unit": "d2l-test-runner",
"test:translations": "mfv -s en -p ./lang/ -i untranslated,category-missing",
"test:vdiff": "d2l-test-runner vdiff --timeout 10000",
"test:wca": "node ./cli/validate-wca.js"
},
"files": [
"custom-elements.json",
"/components",
"/controllers",
"/directives",
"/generated",
"/helpers",
"/lang",
"/mixins",
"/templates",
"/tools",
"!demo",
"!test",
"/components/demo",
"!/components/demo/demo"
],
"author": "D2L Corporation",
"license": "Apache-2.0",
"devDependencies": {
"@brightspace-ui/stylelint-config": "^1",
"@brightspace-ui/testing": "^1",
"@rollup/plugin-dynamic-import-vars": "^2",
"@rollup/plugin-node-resolve": "^16",
"@rollup/plugin-replace": "^6",
"@web/dev-server": "^0.4",
"chalk": "^5",
"eslint": "^9",
"eslint-config-brightspace": "^2.0.0",
"eslint-plugin-unicorn": "^62",
"glob-all": "^3",
"messageformat-validator": "^3.0.0-beta",
"rollup": "^4",
"rollup-plugin-copy": "^3",
"rollup-plugin-delete": "^3",
"sass": "^1",
"sinon": "^21",
"stylelint": "^16",
"web-component-analyzer": "^2"
},
"dependencies": {
"@brightspace-ui/intl": "^3",
"@brightspace-ui/lms-context-provider": "^1",
"@open-wc/dedupe-mixin": "^2",
"ifrau": "^0.41",
"lit": "^3",
"prismjs": "^1",
"resize-observer-polyfill": "^1"
}
}
