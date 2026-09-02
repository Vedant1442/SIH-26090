# Kaarigar Setu - Project Memory

## Architecture
- **Frontend**: React Native (Expo Web/Mobile)
- **Backend**: FastAPI (Python)
- **UI Design System**: Extracted from Stitch (Tailwind classes -> React Native `StyleSheet`).

## Work Completed
1. **Repository Setup**: Initialized `d:\SIH` with GitHub (`SIH-26090`).
2. **Scaffolded Backend**: Set up FastAPI in `backend/` with a virtual environment and basic `app/main.py`.
3. **Scaffolded Frontend**: Set up Expo with TypeScript in `mobile/`. Added dependencies for React Navigation.
4. **Stitch Integration**:
   - Downloaded 9 screens from Stitch Project `6823564060261376044`.
   - Extracted global colors and typography into `mobile/src/theme.ts`.
5. **UI Implementation** (Following `Design_draft.md` flow):
   - `LanguageSelection.tsx` (Screen A0)
   - `ArtisanHome.tsx` (Screen A1)
   - `VoiceCreation.tsx` (Screen A2)
   - `AIPhotoStudio.tsx` (Screen A3)
   - `PricingAssistant.tsx` (Product Detail Sheet)
   - `ListingPreview.tsx` (Export Sheet)
   - `MyProducts.tsx` (Screen A4)
6. **Navigation Flow**: Wired up the precise linear product-capture flow matching the PRD:
   - Language -> Home -> Voice Creation -> AI Photo Studio -> Pricing -> Listing Preview -> My Products
7. **Iconography**:
   - Integrated `react-native-coolicons` based on the requested Figma community icon set. Replaced generic text labels in bottom navigation bars with true `<CoolIcon>` components.

## Known Issues / Next Steps
- The Python Backend currently only has a placeholder "Hello World". The next major step is to implement the ASR (Audio to Text) and AI Product Extraction endpoints and connect them to the `VoiceCreation` and `AIPhotoStudio` screens.
