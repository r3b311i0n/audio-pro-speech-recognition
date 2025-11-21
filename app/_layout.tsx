import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useEffect } from 'react';

import { Asset } from 'expo-asset';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AudioPro, AudioProContentType } from 'react-native-audio-pro';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

AudioPro.configure({
  debug: false,
  contentType: AudioProContentType.SPEECH,
  showNextPrevControls: true,
  showSkipControls: false,
});

const AUDIO_ASSETS = [require('../assets/audio/puppies.mp3')];

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    Asset.loadAsync(AUDIO_ASSETS).catch((error) => {
      console.warn('Failed to preload audio assets', error);
    });
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
