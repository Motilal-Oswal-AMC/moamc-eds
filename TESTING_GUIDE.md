# Performance & Accessibility Testing Guide

## Quick Start

### 1. Run Lighthouse Audit
```bash
# Using Chrome DevTools
1. Open DevTools (F12)
2. Click "Lighthouse" tab
3. Select "Performance" + "Accessibility"
4. Click "Analyze page load"

# Target Scores:
# - Performance: 90+
# - Accessibility: 95+
```

### 2. Test Core Web Vitals
```bash
# Install Web Vitals debugger
npm install web-vitals

# Or use Chrome extension: Web Vitals

# Target metrics:
# - LCP (Largest Contentful Paint): < 2.5s
# - FCP (First Contentful Paint): < 1.8s
# - CLS (Cumulative Layout Shift): < 0.1
```

---

## Performance Testing Checklist

### Network Throttling (Chrome DevTools)

#### Test 1: Fast 3G Network
1. Open DevTools → Network tab
2. Set throttling to "Fast 3G"
3. Reload page
4. **Expected Results:**
   - LCP: < 3.5s
   - FCP: < 2.0s
   - No layout shift when loading tables

#### Test 2: Slow 3G Network
1. Set throttling to "Slow 3G"
2. Reload page
3. **Expected Results:**
   - Page remains interactive
   - Dropdown works
   - Tabs respond to clicks
   - No "Not Responding" errors

### CPU Throttling

1. DevTools → Performance tab
2. Set CPU throttling to "6x slowdown"
3. Reload page
4. **Verify:**
   - No jank during tab switching
   - Smooth animations
   - No long tasks blocking main thread

### Memory Profiling

```javascript
// In console, measure memory usage
console.memory.usedJSHeapSize / 1000000; // MB

// Before optimization: ~10-15 MB
// After optimization: ~8-12 MB
```

---

## Accessibility Testing

### Screen Reader Testing

#### Windows: NVDA (Free)
```bash
# Download: https://www.nvaccess.org/download/
# Test with Firefox or Chrome

# What to test:
1. Tab through all interactive elements
2. Verify announcements:
   - Button role announced
   - Dropdown state (expanded/collapsed)
   - Tab panel visibility
   - Table structure
```

#### macOS: VoiceOver (Built-in)
```bash
# Enable: System Preferences > Accessibility > VoiceOver
# Cmd + F5 to toggle

# Test:
1. Navigate with VO + Right Arrow
2. Verify all content is announced
3. Check that hidden content is skipped
```

#### Linux: Orca
```bash
# Install: sudo apt-get install gnome-shell-extension-dashtodock
# Verify announcements when navigating
```

### Keyboard Navigation Testing

#### Tab Order Test
```
Expected navigation flow:
1. Page loads
2. Tab to first tab button → focus visible
3. Tab to next tab button → focus visible
4. Tab to dropdown trigger → focus visible
5. Tab to table (if rendered) → focus visible
6. Tab to next interactive element
```

#### Keyboard Shortcuts Test
```
Test each shortcut:
┌─────────────────────────────────────────┐
│ Arrow Left/Right → Switch tabs          │
│ Home → First tab                        │
│ End → Last tab                          │
│ Space/Enter → Open/close dropdown       │
│ Escape → Close dropdown                 │
│ Tab → Next element                      │
│ Shift + Tab → Previous element          │
└─────────────────────────────────────────┘
```

### ARIA Validation

Use axe DevTools or accessibility inspector:

```javascript
// In browser console:
// Required ARIA attributes present:
1. [aria-selected] on tab buttons ✓
2. [aria-hidden] on hidden content ✓
3. [aria-expanded] on dropdown ✓
4. [aria-haspopup] on dropdown ✓
5. [role="tabpanel"] on tab content ✓
6. [role="listbox"] on dropdown list ✓
```

### Browser DevTools Accessibility Inspector

1. Right-click on element
2. Select "Inspect"
3. Go to "Accessibility" tab
4. **Verify:**
   - ARIA tree is correct
   - No missing labels
   - No redundant announcements
   - Proper role hierarchy

---

## Automated Testing Script

```javascript
// add to your test suite

describe('Embed Block - Performance & Accessibility', () => {
  
  // Performance Tests
  describe('Performance', () => {
    it('should have no layout thrashing', () => {
      const markStart = performance.now();
      // Trigger tab change
      document.querySelector('[aria-selected="false"]').click();
      const markEnd = performance.now();
      
      expect(markEnd - markStart).toBeLessThan(50); // Should be fast
    });

    it('should batch DOM operations', () => {
      // Monitor reflow count
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'measure-reflow') {
            expect(entry.duration).toBeLessThan(100);
          }
        }
      });
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const dropdown = document.querySelector('.selected-tab');
      expect(dropdown.getAttribute('role')).toBe('button');
      expect(dropdown.getAttribute('aria-haspopup')).toBe('listbox');
      expect(dropdown.getAttribute('aria-expanded')).toBeTruthy();
    });

    it('should support keyboard navigation', () => {
      const buttons = document.querySelectorAll('.tabs-list button');
      
      // Click first button
      buttons[0].click();
      expect(buttons[0].getAttribute('aria-selected')).toBe('true');
      
      // Simulate arrow right
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      buttons[0].dispatchEvent(event);
      // Next button should be focused (simulated)
    });

    it('should have accessible tables', () => {
      const table = document.querySelector('.coverage-table');
      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');
      
      expect(thead).toBeTruthy();
      expect(tbody).toBeTruthy();
      expect(table.querySelector('th')).toBeTruthy();
    });

    it('should set aria-hidden on hidden content', () => {
      const hiddenContent = document.querySelector('.coverage-hidden');
      expect(hiddenContent.getAttribute('aria-hidden')).toBe('true');
    });
  });

  // Integration Tests
  describe('Integration', () => {
    it('should render tab content without layout shift', () => {
      const initialHeight = document.body.offsetHeight;
      document.querySelector('[aria-selected="false"]').click();
      const finalHeight = document.body.offsetHeight;
      
      expect(Math.abs(finalHeight - initialHeight)).toBeLessThan(10);
    });

    it('should handle rapid tab switching', () => {
      const buttons = document.querySelectorAll('.tabs-list button');
      
      // Rapidly click buttons
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].click();
      }
      
      // Should not throw error or break
      expect(document.body).toBeTruthy();
    });
  });
});
```

---

## Lighthouse Audit Checklist

### Before Running Audit
- [ ] Clear browser cache (Chrome DevTools → Network → Disable cache)
- [ ] Close all tabs except one
- [ ] Disable extensions
- [ ] Use Incognito mode

### Expected Results

| Metric | Target | Current |
|--------|--------|---------|
| Performance | 90+ | ___ |
| Accessibility | 95+ | ___ |
| Best Practices | 90+ | ___ |
| SEO | 90+ | ___ |

### Passing Audits
- [ ] Largest Contentful Paint
- [ ] First Contentful Paint
- [ ] Speed Index
- [ ] Time to Interactive
- [ ] Total Blocking Time
- [ ] Cumulative Layout Shift

### Common Issues to Fix
```
❌ Unused CSS/JS → Tree shake, code split
❌ Large images → Optimize, WebP format
❌ Render-blocking resources → Defer JS, inline CSS
❌ Poor accessibility → Add ARIA, keyboard support
❌ Missing alt text → Add descriptions
❌ Low contrast → Use WCAG AAA colors
```

---

## Browser Compatibility Matrix

Test on these browsers/versions:

| Browser | Min Version | Status |
|---------|------------|--------|
| Chrome | 90+ | ✓ Must support |
| Firefox | 88+ | ✓ Must support |
| Safari | 14+ | ✓ Must support |
| Edge | 90+ | ✓ Must support |
| iOS Safari | 14+ | ✓ Must support |
| Chrome Mobile | 90+ | ✓ Must support |

---

## Mobile Testing

### iOS (Safari)
```
1. iPad/iPhone with Safari
2. Test touch interaction
3. Verify keyboard on BT keyboard
4. Check zoom behavior
5. Test dark mode
```

### Android (Chrome)
```
1. Android 10+ device
2. Test touch interaction
3. Verify voice control
4. Check zoom behavior
5. Test dark mode
```

### Responsive Testing
```
Breakpoints to test:
- 320px (small phone)
- 480px (large phone)
- 768px (tablet)
- 1024px (small desktop)
- 1920px (large desktop)
```

---

## Performance Budget

```
Performance budget for embed block:

Resource          Budget    Current   Status
──────────────────────────────────────────
JavaScript        50KB      ___ KB    ____
CSS               20KB      ___ KB    ____
Images            100KB     ___ KB    ____
Fonts             30KB      ___ KB    ____
──────────────────────────────────────────
Total             200KB     ___ KB    ____
```

---

## Continuous Monitoring

### Setup Performance Monitoring
```javascript
// Add to your analytics
window.addEventListener('load', () => {
  // Get Core Web Vitals
  const vitals = {
    lcp: Math.round(performance.getEntriesByType('largest-contentful-paint')[0]?.renderTime),
    fcp: Math.round(performance.getEntriesByType('paint')[1]?.startTime),
    cls: getCLS(),
  };
  
  // Send to analytics
  analytics.log('core-web-vitals', vitals);
});
```

### Tools to Monitor
1. **Google Search Console** - Core Web Vitals data
2. **Sentry** - Error tracking
3. **Lighthouse CI** - Automated testing
4. **WebPageTest** - Detailed performance analysis
5. **GTmetrix** - Performance metrics

---

## Performance Optimization Checklist

- [ ] No layout thrashing (< 10 reflows)
- [ ] No innerHTML += in loops
- [ ] DOM queries cached
- [ ] requestAnimationFrame used for DOM updates
- [ ] CSS classes instead of inline styles
- [ ] DocumentFragment for bulk operations
- [ ] Lazy loading images
- [ ] Keyboard navigation works
- [ ] ARIA attributes complete
- [ ] Focus indicators visible
- [ ] Table semantic HTML
- [ ] Screen reader tested
- [ ] Lighthouse 90+ score
- [ ] LCP < 2.5s
- [ ] FCP < 1.8s
- [ ] CLS < 0.1

---

**Last Updated:** November 25, 2025
**Testing Framework:** Lighthouse 11+, axe-core 4+
