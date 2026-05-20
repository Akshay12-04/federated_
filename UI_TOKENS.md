# UI Tokens — CardioFL Healthcare ML

**Step:** 2 — Design system specification  
**Implementation:** `web/css/tokens.css` (dark default)  
**Architecture:** `ARCHITECTURE_PLAN.md` §9  
**Rule:** Component CSS must use `var(--token)` — no hardcoded hex in `components/` or `pages/`.

---

## 1. Design Principles

| Principle | Application |
|-----------|-------------|
| Dark-first | Default `data-theme="dark"` — matches healthcare dashboard mockups |
| Clinical clarity | High contrast text; semantic green/amber/red for risk |
| Density | Compact cards; 4px spacing scale |
| Consistency | One token file drives all routes |
| Accessibility | 44px touch targets; visible focus rings |

---

## 2. Color Palette

### 2.1 Backgrounds

| Token | Hex / value | Usage |
|-------|-------------|-------|
| `--color-bg-root` | `#0a0e17` | Page background |
| `--color-bg-elevated` | `#0f1520` | Main content area |
| `--color-bg-sidebar` | `#0c1019` | Sidebar |
| `--color-bg-card` | `#121a27` | Cards, panels |
| `--color-bg-card-hover` | `#161f2e` | Card hover |
| `--color-bg-input` | `#0d121c` | Inputs, nested panels |
| `--color-bg-overlay` | `rgba(0, 0, 0, 0.6)` | Mobile sidebar overlay |

### 2.2 Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--color-border-subtle` | `rgba(255, 255, 255, 0.06)` | Card outlines |
| `--color-border-default` | `rgba(255, 255, 255, 0.10)` | Inputs, dividers |
| `--color-border-strong` | `rgba(255, 255, 255, 0.16)` | Emphasis borders |
| `--color-border-active` | `rgba(59, 130, 246, 0.5)` | Active nav, focus |

### 2.3 Brand and accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#3b82f6` | Primary actions, links, active nav |
| `--color-primary-hover` | `#2563eb` | Button hover |
| `--color-primary-muted` | `rgba(59, 130, 246, 0.15)` | Active nav background |
| `--color-primary-glow` | `rgba(59, 130, 246, 0.35)` | CTA glow, stepper ring |
| `--color-accent-teal` | `#2dd4bf` | Network nodes, secondary charts |
| `--color-accent-green` | `#22c55e` | Success, low risk, accuracy |
| `--color-accent-purple` | `#a855f7` | F1, radar series |
| `--color-accent-amber` | `#f59e0b` | Warnings, loss curve |
| `--color-accent-red` | `#ef4444` | High risk, errors |
| `--color-accent-red-soft` | `#f87171` | Medical section accents |
| `--color-accent-coral` | `#fb7185` | Heart / medical icons |

### 2.4 Text

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text-primary` | `#f8fafc` | Headings, KPI values |
| `--color-text-secondary` | `#94a3b8` | Subtitles, labels |
| `--color-text-muted` | `#64748b` | Timestamps, hints |
| `--color-text-disabled` | `#475569` | Disabled controls |
| `--color-text-inverse` | `#ffffff` | Text on primary buttons |
| `--color-text-link` | `#60a5fa` | Inline links |

### 2.5 Semantic (maps to Streamlit messages)

| Token | Hex | Streamlit equivalent |
|-------|-----|----------------------|
| `--color-success` | `#22c55e` | `st.success`, LOW risk |
| `--color-warning` | `#f59e0b` | `st.warning`, HIGH risk copy |
| `--color-danger` | `#ef4444` | `st.error`, HIGH risk banner |
| `--color-info` | `#3b82f6` | `st.info` (train hints, sidebar) |

### 2.6 Chart series (Chart.js)

| Token | Hex | Series |
|-------|-----|--------|
| `--chart-line-primary` | `#3b82f6` | Weekly predictions, primary metric |
| `--chart-line-success` | `#22c55e` | Training accuracy |
| `--chart-line-danger` | `#ef4444` | Loss curve |
| `--chart-line-teal` | `#2dd4bf` | ROC / comparison |
| `--chart-grid` | `rgba(255, 255, 255, 0.06)` | Grid lines |
| `--chart-fill-primary` | `rgba(59, 130, 246, 0.25)` | Area under line |

---

## 3. Typography

### 3.1 Font families

| Token | Stack |
|-------|-------|
| `--font-sans` | `'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif` |
| `--font-mono` | `'JetBrains Mono', 'Fira Code', monospace` |

Loaded in `index.html` via Google Fonts (Inter 400–700).

### 3.2 Font sizes

| Token | Size | Line height | Usage |
|-------|------|-------------|-------|
| `--text-xs` | `0.75rem` (12px) | 1.4 | Badges, log timestamps |
| `--text-sm` | `0.875rem` (14px) | 1.5 | Labels, nav, table cells |
| `--text-base` | `1rem` (16px) | 1.5 | Body, inputs |
| `--text-lg` | `1.125rem` (18px) | 1.4 | Section titles |
| `--text-xl` | `1.25rem` (20px) | 1.3 | Card headers |
| `--text-2xl` | `1.5rem` (24px) | 1.25 | Page titles (`PageHeader`) |
| `--text-3xl` | `1.875rem` (30px) | 1.2 | KPI values (`MetricCard`) |
| `--text-4xl` | `2.25rem` (36px) | 1.1 | Risk % on result page |
| `--text-5xl` | `3rem` (48px) | 1.0 | Hero metrics (optional) |

### 3.3 Font weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-normal` | `400` | Body |
| `--font-medium` | `500` | Nav items, labels |
| `--font-semibold` | `600` | Card titles, topbar |
| `--font-bold` | `700` | Page headers, risk display |

### 3.4 Letter spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-tight` | `-0.02em` | Large headings |
| `--tracking-normal` | `0` | Body |
| `--tracking-wide` | `0.04em` | Uppercase badges |

---

## 4. Spacing

Base unit: **4px** (`0.25rem`).

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | `0` | — |
| `--space-1` | `0.25rem` (4px) | Tight gaps |
| `--space-2` | `0.5rem` (8px) | Icon gaps |
| `--space-3` | `0.75rem` (12px) | Inline padding |
| `--space-4` | `1rem` (16px) | Default gap |
| `--space-5` | `1.25rem` (20px) | Compact card padding |
| `--space-6` | `1.5rem` (24px) | Card padding |
| `--space-8` | `2rem` (32px) | Section gaps |
| `--space-10` | `2.5rem` (40px) | Below page header |
| `--space-12` | `3rem` (48px) | Large breaks |

### 4.1 Layout

| Token | Value | Usage |
|-------|-------|-------|
| `--sidebar-width` | `260px` | Desktop sidebar |
| `--sidebar-width-collapsed` | `72px` | Future collapsed mode |
| `--main-padding-x` | `2rem` | Main horizontal padding |
| `--main-padding-y` | `1.5rem` | Main vertical padding |
| `--card-gap` | `1.25rem` | CSS grid gap |
| `--grid-metrics` | `repeat(3, 1fr)` | Dashboard KPI row |

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `6px` | Badges, chips |
| `--radius-md` | `10px` | Buttons, inputs, segments |
| `--radius-lg` | `12px` | Cards |
| `--radius-xl` | `16px` | Large panels, modals |
| `--radius-full` | `9999px` | Pills, toggle track |

---

## 6. Shadows and Effects

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.3)` | Subtle lift |
| `--shadow-md` | `0 4px 12px rgba(0, 0, 0, 0.35)` | Cards |
| `--shadow-lg` | `0 8px 24px rgba(0, 0, 0, 0.45)` | Modals |
| `--shadow-glow-primary` | `0 0 20px var(--color-primary-glow)` | Primary CTA |
| `--shadow-glow-danger` | `0 0 16px rgba(239, 68, 68, 0.35)` | High-risk gauge |

### 6.1 Gradients

| Token | Value | Usage |
|-------|-------|-------|
| `--gradient-primary` | `linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)` | Streamlit-style header replacement |
| `--gradient-card` | `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)` | Card sheen |
| `--gradient-network-center` | `radial-gradient(circle, #3b82f6 0%, #1d4ed8 70%)` | FL hub node |

---

## 7. Motion

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | `150ms` | Hover, toggles |
| `--duration-normal` | `250ms` | Sidebar, route fade |
| `--duration-slow` | `400ms` | Chart enter animation |
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Stepper (optional) |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | `0` | Page content |
| `--z-dropdown` | `100` | Menus |
| `--z-sticky` | `200` | Sidebar |
| `--z-overlay` | `300` | Mobile backdrop |
| `--z-modal` | `400` | Dialogs |
| `--z-toast` | `500` | Notifications |

---

## 9. Component Tokens

### 9.1 Sidebar

| Token | Value |
|-------|-------|
| `--sidebar-nav-item-height` | `44px` |
| `--sidebar-nav-active-bg` | `var(--color-primary-muted)` |
| `--sidebar-brand-icon-size` | `40px` |

### 9.2 Cards

| Token | Value |
|-------|-------|
| `--card-padding` | `var(--space-6)` |
| `--card-border` | `1px solid var(--color-border-subtle)` |
| `--card-radius` | `var(--radius-lg)` |

### 9.3 Buttons

| Token | Value |
|-------|-------|
| `--btn-height-sm` | `36px` |
| `--btn-height-md` | `44px` |
| `--btn-height-lg` | `52px` |
| `--btn-padding-x` | `var(--space-6)` |
| `--btn-radius` | `var(--radius-md)` |

### 9.4 Form controls

| Token | Value |
|-------|-------|
| `--input-height` | `44px` |
| `--slider-track-height` | `4px` |
| `--slider-thumb-size` | `18px` |
| `--toggle-width` | `44px` |
| `--toggle-height` | `24px` |

### 9.5 Stepper (Predict wizard)

| Token | Value |
|-------|-------|
| `--stepper-node-size` | `40px` |
| `--stepper-line-height` | `2px` |
| `--stepper-active-ring` | `0 0 0 4px var(--color-primary-muted)` |

### 9.6 Metric card (Dashboard / Analytics)

| Token | Value |
|-------|-------|
| `--metric-value-size` | `var(--text-3xl)` |
| `--metric-label-size` | `var(--text-sm)` |
| `--metric-icon-box` | `44px` |

### 9.7 Risk result (Predict result page)

| Token | Value |
|-------|-------|
| `--risk-gauge-size` | `200px` |
| `--risk-low-bg` | `var(--color-success)` |
| `--risk-high-bg` | `var(--color-danger)` |

### 9.8 Chat (Assistant)

| Token | Value |
|-------|-------|
| `--chat-bubble-radius` | `var(--radius-lg)` |
| `--chat-ai-bg` | `var(--color-bg-card)` |
| `--chat-user-bg` | `var(--color-primary-muted)` |

---

## 10. Breakpoints

| Token | Value | Layout behavior |
|-------|-------|-----------------|
| `--bp-sm` | `640px` | Metric grid 3 → 2 columns |
| `--bp-md` | `768px` | Sidebar overlay; menu button visible |
| `--bp-lg` | `1024px` | Two-column chart rows |
| `--bp-xl` | `1280px` | Full dashboard width |

```css
@media (max-width: 768px) {
  :root {
    --main-padding-x: 1rem;
  }
}
```

---

## 11. Light Theme Overrides

Apply on `<html data-theme="light">`:

| Token | Light value |
|-------|-------------|
| `--color-bg-root` | `#f1f5f9` |
| `--color-bg-elevated` | `#ffffff` |
| `--color-bg-card` | `#ffffff` |
| `--color-bg-sidebar` | `#f8fafc` |
| `--color-text-primary` | `#0f172a` |
| `--color-text-secondary` | `#475569` |
| `--color-border-subtle` | `rgba(0, 0, 0, 0.08)` |
| `--chart-grid` | `rgba(0, 0, 0, 0.08)` |

---

## 12. Component → CSS File Map

| UI block | CSS file | JS module |
|----------|----------|-----------|
| Sidebar | `components/sidebar.css` | `components/sidebar.js` |
| Card / placeholder | `components/card.css` | — |
| Page header | `components/page-header.css` | `components/pageHeader.js` |
| Buttons | `components/button.css` | — |
| Metric card | `components/metric-card.css` | `components/metricCard.js` |
| Stepper | `components/stepper.css` | `components/stepper.js` |
| Form controls | `components/form-controls.css` | `segmentControl.js`, `rangeSlider.js` |
| Toggle | `components/toggle.css` | `toggleSwitch.js` |
| Charts wrapper | `components/chart-container.css` | `charts/*.js` |
| Log item | `components/log-item.css` | — |
| Chat | `components/chat.css` | — |
| Network diagram | `components/network-diagram.css` | — |
| Dashboard layout | `pages/dashboard.css` | `dashboardPage.js` |
| Predict wizard | `pages/predict.css` | `predictPage.js` |
| Train | `pages/train.css` | `trainPage.js` |
| Analytics | `pages/analytics.css` | `analyticsPage.js` |
| Logs | `pages/logs.css` | `logsPage.js` |
| Assistant | `pages/assistant.css` | `assistantPage.js` |
| Settings | `pages/settings.css` | `settingsPage.js` |

---

## 13. Utility Classes (`utilities.css`)

| Class | Purpose |
|-------|---------|
| `.sr-only` | Screen reader only |
| `.text-muted` | `color: var(--color-text-muted)` |
| `.font-semibold` | `font-weight: var(--font-semibold)` |
| `.flex`, `.flex-col`, `.gap-4` | Layout helpers (minimal set) |

---

## 14. Implementation Status

| Asset | Status |
|-------|--------|
| `web/css/tokens.css` | ✅ Implemented (subset of full token list) |
| Component CSS files | Partial (sidebar, card, button, page-header) |
| Page CSS files | Partial (dashboard + shared `pages.css`) |
| Light theme block in `tokens.css` | ⬜ Add `[data-theme="light"]` in Phase A polish |

---

## 15. Accessibility Minimums

| Rule | Implementation |
|------|----------------|
| Body contrast | `--color-text-secondary` on `--color-bg-root` ≥ 4.5:1 |
| Focus visible | `outline: 2px solid var(--color-primary); outline-offset: 2px` |
| Touch target | `min-height: var(--btn-height-md)` (44px) |
| Charts | Respect `prefers-reduced-motion` |
| Risk color | Do not rely on color alone — include text label HIGH/LOW |

---

## 16. Step 2 Checklist

- [x] Colors (backgrounds, borders, brand, semantic, charts)
- [x] Typography (families, sizes, weights)
- [x] Spacing and layout tokens
- [x] Radius, shadows, gradients
- [x] Motion and z-index
- [x] Per-component tokens (sidebar, card, button, forms, stepper, metrics, chat)
- [x] Breakpoints and light theme overrides
- [x] Component → file mapping for implementers
- [x] Link to `tokens.css` implementation

---

*Use this document as the single design reference. Update `tokens.css` when adding tokens — do not fork hex values into page CSS.*
