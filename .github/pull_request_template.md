## 📋 Description
<!-- Briefly describe what this PR does -->


## 🔗 Preview URLs
<!-- REQUIRED: Add preview URLs where reviewers can see your changes -->
<!-- The CI will automatically add the preview URL as a comment -->

| Environment | URL |
|-------------|-----|
| Preview | https://BRANCH--DTIN-NipponAmc-Website-EDS--dept.aem.page/ |
| Block/Page | <!-- Add specific page URL --> |


## 🏷️ Type of Change

- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 Style/CSS changes
- [ ] ♻️ Refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] 🔧 Configuration change


## 🧩 Blocks/Components Affected
<!-- List the blocks or components modified -->

| Block | Change Type |
|-------|-------------|
| | |


## ✅ Pre-Merge Checklist

### Code Quality
- [ ] Code follows project style guidelines
- [ ] `npm run lint` passes with no errors
- [ ] No `console.log` or `debugger` statements
- [ ] No hardcoded strings (use placeholders)
- [ ] JSON files are valid

### Testing
- [ ] Tested locally with `aem up`
- [ ] Preview URL renders correctly
- [ ] Tested on desktop viewport (1280px+)
- [ ] Tested on tablet viewport (~768px)
- [ ] Tested on mobile viewport (~375px)
- [ ] Cross-browser tested (Chrome, Firefox, Safari)

### Performance (AEM PSI Check)
<!-- The AEM GitHub bot runs these automatically -->
- [ ] Lighthouse Performance score: 100 ✓
- [ ] Lighthouse Accessibility score: 100 ✓
- [ ] Lighthouse SEO score: 100 ✓
- [ ] Lighthouse Best Practices score: 100 ✓

### Accessibility (WCAG 2.1 AA)
- [ ] All images have descriptive `alt` text
- [ ] Interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Focus states are visible
- [ ] ARIA attributes used correctly (if applicable)
- [ ] Screen reader tested (if applicable)

### CSS Best Practices
- [ ] CSS selectors scoped to block (`.block-name ...`)
- [ ] Mobile-first approach (`min-width` media queries)
- [ ] Standard breakpoints: 600px, 900px, 1200px
- [ ] No `!important` unless absolutely necessary
- [ ] CSS variables used for theming

### JavaScript Best Practices
- [ ] No 3rd party libraries in `head.html`
- [ ] Dependencies loaded lazily (`loadScript()`)
- [ ] Modern JS features (browser-supported)
- [ ] No blocking scripts in critical path
- [ ] Error handling implemented


## 📸 Screenshots

### Before
<!-- Screenshot or "N/A" for new features -->

### After
<!-- Screenshot showing the changes -->

### Mobile View
<!-- Mobile screenshot if applicable -->


## 🧪 Test Coverage

### Manual Tests Performed
<!-- Describe manual testing done -->
1. 
2. 
3. 

### E2E Tests
<!-- Check if E2E tests were added/updated -->
- [ ] E2E tests added for new functionality
- [ ] Existing E2E tests pass
- [ ] N/A - No E2E tests needed


## 📝 Additional Notes
<!-- Any additional context, deployment notes, or information for reviewers -->


## 🔗 Related Issues/PRs
<!-- Link any related issues or PRs -->
- Closes #
- Related to #


---
<!-- 
Reviewer Checklist (for code reviewer):
- [ ] Code is readable and well-documented
- [ ] No obvious bugs or issues
- [ ] Performance impact is acceptable
- [ ] Accessibility requirements met
- [ ] Preview URL tested
-->