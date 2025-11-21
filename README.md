# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Reproducing the AudioPro resume bug

1. Tap **Play puppies.mp3** so the demo track is actively playing through the loudspeaker.
2. Tap **Start recognition** (permission required). That button first calls `AudioPro.pause()` and only then runs `ExpoSpeechRecognitionModule.start({ lang: 'en-US', interimResults: true, continuous: true, requiresOnDeviceRecognition: false })`.
3. End capture via **Stop recognition** (fires `ExpoSpeechRecognitionModule.stop()` then `AudioPro.resume()`) or tap **Abort recognition** (same button while active, calls `ExpoSpeechRecognitionModule.abort()` then `AudioPro.resume()`).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app
   - Build or install an Expo Dev Client on your device/emulator (required for `react-native-audio-pro` + `expo-speech-recognition` native modules).
   - Launch the Metro server:

     ```bash
     npx expo start --dev-client
     ```
