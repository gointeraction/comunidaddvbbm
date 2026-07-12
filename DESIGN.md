# BBMDev — Design System & Visual Identity

> **Theme**: "Emerald Terminal" — Dark-first developer community platform inspired by `comunidad.eriktaveras.com` aesthetic.
> **Stack**: Next.js 15 + React 19 + Tailwind CSS v4 + shadcn/ui (Radix) + Lucide icons

---

## 1. Color Palette (CSS Variables)

All colors defined as CSS custom properties in `:root` (globals.css:59-93) for seamless dark-mode support.

| Token | Hex / Value | Usage |
|-------|-------------|-------|
| `--background` | `#030712` | Page background (near-black navy) |
| `--foreground` | `#F3F4F6` | Primary text (off-white) |
| `--card` | `#111827` | Card/surface backgrounds |
| `--card-foreground` | `#F3F4F6` | Text on cards |
| `--primary` | `#10B981` | **Emerald** — Brand, CTAs, links, focus rings |
| `--primary-foreground` | `#030712` | Text on primary buttons |
| `--secondary` | `#111827` | Secondary surfaces |
| `--secondary-foreground` | `#F3F4F6` | Text on secondary |
| `--muted` | `#111827` | Muted backgrounds |
| `--muted-foreground` | `#9CA3AF` | Secondary/disabled text |
| `--accent` | `#111827` | Accent surfaces |
| `--accent-foreground` | `#F3F4F6` | Text on accent |
| `--destructive` | `#EF4444` | Errors, delete actions |
| `--border` | `rgba(255,255,255,0.1)` | Borders, dividers |
| `--input` | `rgba(255,255,255,0.1)` | Input borders |
| `--ring` | `#10B981` | Focus rings |
| `--radius` | `0.75rem` (12px) | Base border radius |

### Semantic Terminal Colors (globals.css:40-52)

| Token | Hex | Purpose |
|-------|-----|---------|
| `--color-terminal-green` | `#10B981` | Success, prompts, primary accent |
| `--color-terminal-emerald-400` | `#34D399` | Bright emerald highlights |
| `--color-terminal-emerald-300` | `#6EE7B7` | Slogans, subtle highlights |
| `--color-terminal-amber` | `#fbbf24` | Warnings, XP, gold tier |
| `--color-terminal-red` | `#EF4444` | Errors, destructive |
| `--color-terminal-purple` | `#c084fc` | Epic rarity, special |
| `--color-terminal-dim` | `#6B7280` | Dimmed text, comments |
| `--color-terminal-subtle` | `#4B5563` | Borders, subtle elements |

### Achievement Rarity Colors (globals.css:264-272)

| Rarity | Text/Border | Background |
|--------|-------------|------------|
| Common | `#94a3b8` (slate) | `rgba(148,163,184,0.1)` |
| Rare | `#3b82f6` (blue) | `rgba(59,130,246,0.1)` |
| Epic | `#a855f7` (purple) | `rgba(168,85,247,0.1)` |
| Legendary | `#f59e0b` (amber) | `rgba(245,158,11,0.1)` |

### Course Gradients (courses-page.tsx:56-62)

Each course gets a distinct gradient cover:
- `c-001`: `from-cyan-900/40 to-blue-900/30`
- `c-002`: `from-emerald-900/40 to-teal-900/30`
- `c-003`: `from-violet-900/40 to-purple-900/30`
- `c-004`: `from-amber-900/40 to-orange-900/30`
- `c-005`: `from-rose-900/40 to-pink-900/30`

---

## 2. Typography

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| **Sans (UI)** | `Inter` (variable) | 300–700 | All UI text, body, headings |
| **Mono (Code/Terminal)** | `JetBrains Mono` | 400–700 | Code blocks, terminal prompts, counters, badges, XP displays |

**CSS Variables** (globals.css:9-10):
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, monospace;
```

**Utility Classes** (globals.css:182-216):
```css
.terminal-text       { font-family: 'JetBrains Mono', ...; }
.terminal-prompt     { color: #10B981; }      /* $ prompt */
.terminal-path       { color: #34D399; }      /* ~/path */
.terminal-comment    { color: #6B7280; }      /* // comments */
.terminal-command    { color: #F3F4F6; }      /* typed commands */
.terminal-output     { color: #9CA3AF; }      /* command output */
.terminal-accent     { color: #6EE7B7; }      /* highlights */
.terminal-warning    { color: #fbbf24; }      /* warnings */
.terminal-error      { color: #EF4444; }      /* errors */
```

---

## 3. Layout & Spacing

| Metric | Value |
|--------|-------|
| **Base radius** | `0.75rem` (12px) — `var(--radius)` |
| **Radius scale** | `sm: calc(var(--radius)-4px)` • `md: calc(var(--radius)-2px)` • `lg: var(--radius)` • `xl: calc(var(--radius)+4px)` |
| **Container max-width** | `max-w-6xl` (72rem / 1152px) for main content |
| **Landing container** | `max-w-4xl` (56rem / 896px) for hero sections |
| **Sidebar width** | `260px` (desktop) • `280px` (mobile sheet) |
| **Header height** | `h-14` (56px) |
| **Grid gap** | `gap-4` (16px) standard, `gap-6` (24px) for sections |

---

## 4. Visual Effects & Atmosphere

### Background Layers (globals.css:233-238, landing-page.tsx:241-242)

```css
.grid-bg {
  background-image:
    linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px);
  background-size: 40px 40px;
}
```
- Subtle emerald grid pattern (40px squares) across landing & pages
- Two radial glow blobs on landing: top-center (emerald/10) + bottom-right (emerald/5)

### CRT Scanlines (globals.css:244-258, layout.tsx:27)
```css
.ad-scanlines::after {
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px
  );
  pointer-events: none; z-index: 9999; opacity: 0.04;
}
```
Applied to `<body>` for subtle retro monitor texture.

### Glass Morphism Cards (globals.css:222-227)
```css
.glass-card {
  background: rgba(17, 24, 39, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 0.75rem;
}
```
Used extensively: PostCard, CourseCard, widgets, dialogs.

### Shadows
- **Primary glow**: `shadow-[0_0_18px_rgba(16,185,129,0.25)]` — logo, primary buttons
- **Hover glow**: `hover:shadow-[0_0_18px_rgba(16,185,129,0.35)]` — feature cards
- **Dialog/Sheet**: `shadow-2xl shadow-black/60`
- **Card default**: `shadow-sm` (shadcn base)

---

## 5. Animations (globals.css:115-162)

| Class | Keyframes | Duration | Usage |
|-------|-----------|----------|-------|
| `animate-blink` | opacity 0↔1 | 1s step-end ∞ | Terminal cursors |
| `animate-fade-in-up` | opacity 0→1, translateY -10px→0 | 0.3s ease-out | Section reveals, staggered children |
| `animate-slide-down` | opacity 0→1, translateY -10px→0 | 0.2s ease-out | Dropdowns, toasts |
| `animate-slide-up` | opacity 0→1, translateY 10px→0 | 0.2s ease-out | Modals, sheets |
| `animate-count-up` | opacity 0→1, translateY 8px→0 | 0.6s ease-out | Animated counters |
| `animate-terminal-type` | width 0→100% | 1.5s steps(40) | Terminal typing effect |
| `animate-glow` | text-shadow pulse | 3s ease-in-out ∞ | Hero title "BBMDev" |
| `animate-slide-in` | opacity 0→1, translateX -8px→0 | 0.3s ease-out | Terminal output lines |

**Stagger helper** (globals.css:278-286):
```css
.stagger-children > *:nth-child(n) { animation-delay: n*60ms; }
```

---

## 6. Component Design Patterns

### Buttons (button.tsx)
| Variant | Style |
|---------|-------|
| **default** | `bg-primary text-primary-foreground` — emerald fill |
| **outline** | `border bg-background` — subtle border |
| **ghost** | `hover:bg-accent` — no border, hover only |
| **destructive** | `bg-destructive text-white` — red |
| **secondary** | `bg-secondary text-secondary-foreground` |

**Custom primary buttons** (landing, header, dialogs):
```tsx
className="bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)]"
```

### Cards (card.tsx + glass-card)
- Base: `bg-card text-card-foreground rounded-xl border py-6 shadow-sm`
- Glass variant: `.glass-card` (backdrop-blur, semi-transparent)
- Interactive: `hover:border-primary/30 transition-colors`

### Inputs (input.tsx, textarea.tsx)
- Background: transparent / `bg-transparent`
- Border: `border-white/10`
- Focus: `focus:border-[#10B981]/50`
- Placeholder: `placeholder:text-gray-600`
- Font: `font-mono text-sm`

### Badges (badge.tsx)
- **Outline** (default): `border-white/10 text-gray-400`
- **Primary tags**: `border-primary/30 text-primary/80 bg-primary/5`
- **Level badges**: Color-coded per experience (principiante=gray, intermedio=blue, avanzado=purple)
- **Rarity**: `.rarity-*` classes with matching border/bg

### Avatars (avatar.tsx)
- Sizes: `size-8` (header), `size-9` (sidebar), `size-10` (post detail), `size-12` (dropdown)
- Border: `border-2 border-[#10B981]` for current user
- Fallback: `bg-[#10B981] text-white font-mono` with initials

---

## 7. Key Pages — Visual Breakdown

### Landing Page (landing-page.tsx)
1. **Sticky transparent nav** → solid on scroll (`bg-gray-950/85 backdrop-blur-md border-b`)
2. **Hero**: Centered `BBMDev` title (animate-glow) + slogan + **Interactive Terminal** (live typing demo)
3. **Live Counters**: Animated numbers in terminal-style header `$ bbmdev stats --live`
4. **Feature Grid**: 4 cards with icons, terminal-style descriptions
5. **CTA**: Full-width primary button `$ Comienza a automatizar`
6. **Footer**: `// BBMDev v2.0 — built for developers, by developers`

### App Shell (Authenticated)
- **Desktop**: Fixed left sidebar (260px) + top header (56px) + main content
- **Mobile**: Header only, sidebar in Sheet (slide-in from left)
- **Header**: Logo `AD BBMDev_Community` + nav pills (active = emerald bg + left accent bar) + notification bell + XP/Level pill + avatar dropdown
- **Sidebar**: Brand + user XP/level badge + nav stack (active = emerald text + left bar) + bottom actions (profile, notifications, admin, logout)

### Forum (forum-page.tsx)
- **List**: Create post card → filters (search, sort, category chips) → 2-col layout (posts + widgets)
- **PostCard**: Glass card, author row (avatar + level badge), title, preview, tags, actions (like/comment)
- **Detail**: Full post + rich-content markdown rendering + comments thread + inline comment form
- **Create Dialog**: Terminal-styled header (`$ bbmdev post --create`), 2-col form (title/content + category/attachments/resources)

### Courses (courses-page.tsx)
- **Grid**: 3-col cards with gradient covers, progress bars (if enrolled), enroll/continue buttons
- **Detail**: Sidebar (lessons with checkboxes) + main content (markdown rendered via `dangerouslySetInnerHTML`)
- **Progress**: Top progress bar, certificate button at 100%
- **Admin**: Create/Edit dialog with cover upload, external URL option

### Other Pages (consistent patterns)
- **Resources**: Card grid with type badges, download counts, tags
- **Ranking**: Table with medal icons, XP, level badges, weekly/monthly toggle
- **Gamification**: Mission cards with progress rings, XP rewards, expandable completed
- **Profile**: Tabs (overview, stats, achievements), editable fields, avatar upload
- **Directos**: Video cards with live indicator, schedule
- **Admin**: Stats cards, user management table, content moderation

---

## 8. Iconography

- **Library**: `lucide-react` (consistent 24×24 base, sized via `size-{3,4,5,8,10}`)
- **Terminal icons**: `Terminal`, `Zap`, `MessageSquare`, `GraduationCap`, `Package`, `Radio`, `Users`, `Trophy`, `Target`, `Shield`, `BookOpen`, `Clock`, `Play`, `CheckCircle2`, `Plus`, `Search`, `Filter`, `ArrowLeft`, `Send`, `Heart`, `Tag`, `ExternalLink`, `Bell`, `Settings`, `LogOut`, `ChevronRight`, `PanelLeftClose`

---

## 9. Responsive Breakpoints (Tailwind defaults)

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Nav links show, 2-col feature grid |
| `md` | 768px | Hero text scaling, 2-col forum widgets |
| `lg` | 1024px | 3-col course grid, sidebar visible |
| `xl` | 1280px | Max container widths |

---

## 10. Accessibility Notes

- `focus-visible:ring-ring/50 focus-visible:ring-[3px]` on all interactive elements (button.tsx:8)
- `aria-label` on icon-only buttons (header, sidebar)
- `aria-current="page"` on active nav items
- Semantic HTML: `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`, `<article>`
- Color contrast: Primary emerald on dark meets WCAG AA for large text
- Reduced motion: Animations respect `prefers-reduced-motion` via Tailwind (not explicitly disabled but low-motion friendly)

---

## 11. Design Tokens Summary (for Figma / Design Handoff)

```json
{
  "colors": {
    "background": "#030712",
    "surface": "#111827",
    "surface-hover": "rgba(255,255,255,0.05)",
    "border": "rgba(255,255,255,0.1)",
    "primary": "#10B981",
    "primary-hover": "#34D399",
    "primary-foreground": "#030712",
    "text-primary": "#F3F4F6",
    "text-secondary": "#9CA3AF",
    "text-muted": "#6B7280",
    "accent-emerald": "#6EE7B7",
    "accent-amber": "#fbbf24",
    "accent-red": "#EF4444",
    "accent-purple": "#c084fc"
  },
  "typography": {
    "font-sans": "Inter",
    "font-mono": "JetBrains Mono",
    "scale": {
      "xs": "0.75rem",    // 12px
      "sm": "0.875rem",   // 14px
      "base": "1rem",     // 16px
      "lg": "1.125rem",   // 18px
      "xl": "1.25rem",    // 20px
      "2xl": "1.5rem",    // 24px
      "3xl": "1.875rem",  // 30px
      "4xl": "2.25rem",   // 36px
      "5xl": "3rem",      // 48px
      "7xl": "4.5rem"     // 72px (hero)
    }
  },
  "spacing": { "base": "0.25rem (4px)", "scale": "4px increments" },
  "radius": { "base": "0.75rem (12px)", "sm": "0.25rem", "md": "0.5rem", "lg": "0.75rem", "xl": "1rem" },
  "shadows": {
    "glow-sm": "0 0 18px rgba(16,185,129,0.25)",
    "glow-md": "0 0 18px rgba(16,185,129,0.35)",
    "glow-lg": "0 0 28px rgba(16,185,129,0.45)",
    "elevation-1": "0 1px 3px rgba(0,0,0,0.3)",
    "elevation-2": "0 4px 20px rgba(0,0,0,0.4)",
    "elevation-3": "0 8px 32px rgba(0,0,0,0.5)"
  }
}
```

---

## 12. Implementation Checklist (for new features)

- [ ] Use CSS variables (`var(--primary)`, `var(--radius)`, etc.) — never hardcode hex
- [ ] Apply `.glass-card` for floating panels, dialogs, widgets
- [ ] Use `font-mono` for: code, terminals, counters, badges, XP, levels
- [ ] Use `font-sans` (Inter) for: body text, headings, UI labels
- [ ] Primary CTAs: `bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)]`
- [ ] Secondary/ghost: `bg-transparent border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white`
- [ ] Inputs: `bg-transparent border border-white/10 focus:border-[#10B981]/50 font-mono text-sm`
- [ ] Add `animate-fade-in-up` + stagger delays for list/item entrances
- [ ] Include scanline body class (`ad-scanlines`) on authenticated layouts
- [ ] Grid background (`.grid-bg`) on landing/hero sections
- [ ] Terminal prompt styling: `$ ` in emerald, path in emerald-400, comments in dim
- [ ] Respect dark-mode only (app forced to `class="dark"` in layout.tsx:26)

---

*Generated from codebase analysis — `globals.css`, `tailwind.config.ts`, `landing-page.tsx`, `app-header.tsx`, `sidebar.tsx`, `forum-page.tsx`, `courses-page.tsx`, and shadcn/ui components.*