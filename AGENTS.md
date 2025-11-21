# AGENTS

## Setup commands

- Install dependencies: `npm install`
- Start dev server: `npm start` (runs `npx expo start --dev-client`)
- Run on Android: `npm run android`
- Run on iOS: `npm run ios`
- Run on web: `npm run web`
- Lint: `npm run lint`

## Project overview

- Expo/React Native app using Expo Router for navigation
- Requires Expo Dev Client (custom dev client) for native modules (`react-native-audio-pro`, `expo-speech-recognition`)
- TypeScript with strict mode enabled
- Uses React 19.1.0 and React Native 0.81.5

## Code style

- TypeScript strict mode (enforced in `tsconfig.json`)
- ESLint with `eslint-config-expo`
- Path aliases: `@/*` maps to project root
- Follow Expo conventions for file structure

## Development environment

- Metro bundler handles JavaScript/TypeScript bundling
- Native modules require Expo Dev Client (not Expo Go)
- Hot reload available during development
- Check `app.json` for Expo configuration

## Testing

- Run linting before committing: `npm run lint`
- No test suite configured yet; add tests as needed
- Manual testing: Use the demo surface at `(tabs)/index` for AudioPro playback and Speech Recognition validation

## File structure

- `app/` - Expo Router pages and layouts
- `components/` - Reusable React components
- `hooks/` - Custom React hooks
- `constants/` - App constants and theme
- `assets/` - Static assets (images, audio files)

## Native modules

- `react-native-audio-pro` - Audio playback/recording
- `expo-speech-recognition` - Speech recognition
- Both require native builds; cannot test in Expo Go

## Notes

- The app demonstrates AudioPro resume bug reproduction (see README.md)
- Uses `expo-router` for file-based routing
- Audio assets stored in `assets/audio/`
