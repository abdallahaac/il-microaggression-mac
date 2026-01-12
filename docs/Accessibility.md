# Accessibility notes

## Goals
- Keyboard navigable
- Clear focus states
- Proper headings hierarchy
- Sufficient contrast
- Meaningful alt text for images that convey information

## Quick checks
- Tab through the full experience without a mouse.
- Ensure focus is always visible.
- Verify form controls have labels.
- Confirm language is set on each page (`<html lang="en">` / `<html lang="fr">`).

## Known patterns
If the IL uses modals, accordions, or custom controls:
- ensure ARIA attributes are correct
- ensure Esc closes modals where appropriate
- ensure focus is trapped inside modals when open
