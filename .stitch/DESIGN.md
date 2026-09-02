---
name: Kaarigar Setu
colors:
  surface: '#f5f0e6'
  surface-dim: '#eae4d8'
  surface-bright: '#f9f6ef'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fdfbf7'
  surface-container: '#f5f0e6'
  surface-container-high: '#ede7db'
  surface-container-highest: '#e4dcd0'
  on-surface: '#3a2e28'
  on-surface-variant: '#8a8f94'
  outline: '#8a8f94'
  outline-variant: '#c3c6c8'
  primary: '#2c3e52'
  on-primary: '#ffffff'
  primary-container: '#3f5670'
  on-primary-container: '#ffffff'
  secondary: '#a8432f'
  on-secondary: '#ffffff'
  secondary-container: '#c95944'
  on-secondary-container: '#ffffff'
  tertiary: '#d9a441'
  on-tertiary: '#3a2e28'
  tertiary-container: '#e0b462'
  on-tertiary-container: '#3a2e28'
  error: '#a8432f'
  on-error: '#ffffff'
  error-container: '#c95944'
  on-error-container: '#ffffff'
  background: '#f5f0e6'
  on-background: '#3a2e28'
typography:
  display-lg:
    fontFamily: Fraunces
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  headline-lg:
    fontFamily: Fraunces
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Fraunces
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.75rem
  md: 0.75rem
  lg: 1.25rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  touch-target-min: 48px
---
# Kaarigar Setu Design System

## Brand & Style
Kaarigar Setu is a voice-first Virtual Business Manager for low-literacy, low-income artisans. The design system is grounded in the material world of Indian handloom and natural dye craft — this is a Heritage & Culture theme, used literally, not decoratively.

## Colors
- **Indigo Deep (`#2C3E52`)**: Primary brand color. Used for primary actions, nav, and headers. Mapped to `primary`.
- **Madder Red (`#A8432F`)**: Used sparingly for the mic button and signature accents only. Mapped to `secondary`.
- **Turmeric (`#D9A441`)**: Used only for "attention/needs action" states (batch exceptions, missing documents). Never used decoratively. Mapped to `tertiary`.
- **Kora Cotton (`#F5F0E6`)**: Undyed handloom cotton, the base background. Mapped to `surface` and `background`.
- **Kattha Ink (`#3A2E28`)**: Betel-nut brown-black, primary text color. Never pure black. Mapped to `on-surface` and `on-background`.
- **Sage Thread (`#6B7F63`)**: Muted natural green, reserved for "Live/verified/complete" states only.
- **Slate Mist (`#8A8F94`)**: Neutral for secondary text, timestamps, metadata. Mapped to `on-surface-variant` and `outline`.

## Typography
- **Headings**: Fraunces (warm, slightly humanist serif with visible craft character). Used for headlines and artisan's own product titles only. Never for body copy.
- **Body**: Manrope (geometric, highly legible sans built for screen reading at small sizes). Carries almost everything in the artisan app.

## Layout & shape language
- Corner radius: 20px on primary cards/buttons, 12px on secondary chips. Soft but not bubbly.
- The signature element: a woven "thread-row" motif — a thin horizontal row of short offset dashes.
- Icons: rounded-line style, 2px stroke, filled on active/selected state. Every icon ships with a one-word label underneath.
