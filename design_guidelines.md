# Design Guidelines: Modern Mobile-First Web Application

## Design Approach
**System-Based Approach**: Modern minimalist design inspired by Material Design 3 and Apple HIG, optimized for mobile-first utility applications with bottom tab navigation.

**Rationale**: This is a utility-focused starter app requiring clean, efficient patterns that prioritize usability and performance over visual flourishes.

## Core Design Principles
1. **Mobile-First Philosophy**: Design for small screens first, enhance for larger viewports
2. **Thumb-Zone Optimization**: Primary actions within comfortable reach (bottom 60% of screen)
3. **Clean Minimalism**: Generous whitespace, clear hierarchy, purposeful elements only
4. **Speed & Performance**: Lightweight, instant interactions, no unnecessary animations

---

## Color Palette

### Light Mode
- **Background Primary**: 0 0% 100% (pure white)
- **Background Secondary**: 240 5% 96% (subtle gray for cards/sections)
- **Text Primary**: 220 9% 15% (near-black for body text)
- **Text Secondary**: 220 8% 45% (muted for supporting text)
- **Accent Primary**: 221 83% 53% (vibrant blue for CTAs and active states)
- **Accent Hover**: 221 83% 48% (darker blue for hover states)
- **Border**: 220 13% 91% (light gray borders)

### Dark Mode
- **Background Primary**: 222 15% 12% (dark navy)
- **Background Secondary**: 222 15% 17% (slightly lighter for elevation)
- **Text Primary**: 0 0% 98% (off-white for readability)
- **Text Secondary**: 220 8% 70% (muted light gray)
- **Accent Primary**: 217 91% 60% (brighter blue for dark mode)
- **Accent Hover**: 217 91% 65%
- **Border**: 220 13% 25% (subtle dark borders)

---

## Typography

**Primary Font**: `Inter` (Google Fonts) - exceptional readability, modern aesthetic
**Monospace**: `JetBrains Mono` - for code snippets if needed

### Type Scale
- **Display**: 2.5rem (40px) / font-bold / leading-tight - Hero headlines
- **H1**: 2rem (32px) / font-bold / leading-tight - Page titles
- **H2**: 1.5rem (24px) / font-semibold / leading-snug - Section headers
- **H3**: 1.25rem (20px) / font-semibold / leading-snug - Card titles
- **Body**: 1rem (16px) / font-normal / leading-relaxed - Main content
- **Small**: 0.875rem (14px) / font-normal / leading-normal - Captions, labels
- **Tiny**: 0.75rem (12px) / font-medium / leading-tight - Badges, micro-text

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** for consistency
- Micro spacing: `p-2` (8px) - tight groupings
- Standard spacing: `p-4` (16px) - default component padding
- Section spacing: `p-6` or `p-8` (24-32px) - card/section padding
- Large gaps: `gap-12` or `gap-16` (48-64px) - between major sections

**Mobile Container**: `px-4` (16px horizontal padding) - comfortable edge spacing
**Desktop Container**: `max-w-7xl mx-auto px-6` - centered, constrained width

**Grid Usage**:
- Mobile: Single column (`grid-cols-1`)
- Tablet: 2 columns (`md:grid-cols-2`)
- Desktop: 3-4 columns (`lg:grid-cols-3` or `lg:grid-cols-4`)

---

## Component Library

### Navigation (Bottom Tabs)
- **Height**: 64px fixed height with safe-area-inset-bottom for iOS
- **Position**: Fixed bottom, full width, elevated shadow
- **Active State**: Accent color icon + text, 3px top border indicator
- **Inactive State**: Secondary text color, no border
- **Icon Size**: 24px (1.5rem) with 4px gap to label
- **Layout**: 3-5 tabs, evenly distributed (flex with flex-1)

### Cards
- **Background**: Secondary background color
- **Border**: 1px solid border color
- **Radius**: `rounded-xl` (12px) - soft, modern corners
- **Shadow**: `shadow-sm` on light mode, subtle glow on dark mode
- **Padding**: `p-6` (24px) for comfortable content spacing
- **Hover**: Slight scale transform (scale-[1.02]) + deeper shadow

### Buttons
- **Primary**: Accent background, white text, `rounded-lg`, `px-6 py-3`, font-semibold
- **Secondary**: Transparent background, accent border (2px), accent text
- **Ghost**: No border, accent text, hover background at 10% opacity
- **Sizes**: Small (px-4 py-2), Medium (px-6 py-3), Large (px-8 py-4)
- **States**: Hover (darken 5%), Active (darken 10%), Disabled (50% opacity)

### Form Inputs
- **Height**: 48px (comfortable tap target for mobile)
- **Border**: 1.5px solid border color, focus ring 2px accent color
- **Padding**: `px-4` horizontal, `py-3` vertical
- **Radius**: `rounded-lg` (8px)
- **Dark Mode**: Ensure background contrasts with page background (use secondary background)
- **Labels**: Above input, font-medium, text-sm, 8px bottom margin

### Data Display
- **Lists**: Divide by borders (border-b), py-4 spacing between items
- **Tables**: Minimal borders, zebra striping on rows (odd:bg-secondary/50)
- **Status Badges**: `rounded-full`, `px-3 py-1`, font-semibold, text-xs

---

## Responsive Behavior

**Breakpoints**:
- Mobile: < 640px (base styles)
- Tablet: 640px - 1024px (md:)
- Desktop: > 1024px (lg:)

**Mobile Optimizations**:
- Bottom tab navigation (primary navigation method)
- Single column layouts
- Full-width buttons for easy tapping
- Larger touch targets (minimum 44x44px)
- Reduced visual complexity

**Desktop Enhancements**:
- Optional sidebar navigation (in addition to bottom tabs)
- Multi-column grids for content
- Hover states and tooltips
- More dense information display

---

## Animations

**Philosophy**: Minimal, purposeful motion only

**Allowed**:
- Page transitions: Subtle fade (150ms)
- Bottom tab switch: Icon color transition (200ms)
- Button hover: Scale (100ms)
- Card hover: Shadow transition (200ms)

**Forbidden**:
- Complex entrance animations
- Scroll-triggered animations
- Excessive micro-interactions
- Loading spinners (use skeleton screens instead)

---

## Accessibility

- Maintain 4.5:1 contrast ratio minimum (WCAG AA)
- All interactive elements keyboard accessible
- Focus visible states with 2px accent outline
- Form inputs with descriptive labels
- Dark mode consistency (all inputs/text fields adapt)
- Touch targets minimum 44x44px
- Screen reader friendly semantic HTML

---

## Images

**Usage**: Sparingly - only when content-driven (user avatars, product images, illustrations)

**Hero Images**: NOT INCLUDED - This is a utility app starter, no hero section needed

**Asset Strategy**:
- Icons: Heroicons (outline for inactive, solid for active states)
- Avatars: Use placeholder with initials or icon
- Illustrations: Only if specific feature requires visual explanation