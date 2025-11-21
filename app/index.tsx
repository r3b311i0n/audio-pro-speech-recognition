import { useCallback, useEffect, useMemo, useState } from 'react';

import { Asset } from 'expo-asset';
import { Image } from 'expo-image';
import type { ExpoSpeechRecognitionResultEvent } from 'expo-speech-recognition';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { Button, StyleSheet, View } from 'react-native';
import { AudioPro } from 'react-native-audio-pro';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [playbackState, setPlaybackState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [permissionStatus, setPermissionStatus] = useState<'checking' | 'granted' | 'denied'>(
    'checking',
  );

  const isPlaying = playbackState === 'playing';
  const isPaused = playbackState === 'paused';
  const hasPermission = permissionStatus === 'granted';

  useEffect(() => {
    (async () => {
      try {
        const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        setPermissionStatus(result.granted ? 'granted' : 'denied');
      } catch (error) {
        console.error('Failed to request speech recognition permission', error);
        setPermissionStatus('denied');
      }
    })();
  }, []);

  const puppiesTrack = useMemo(() => {
    const audioAsset = Asset.fromModule(require('@/assets/audio/puppies.mp3'));
    const artworkAsset = Asset.fromModule(require('@/assets/images/icon.png'));
    return {
      id: 'puppies-demo-track',
      url: audioAsset.localUri ?? audioAsset.uri,
      title: 'puppies.mp3',
      artist: 'AudioPro Demo',
      artwork: artworkAsset.localUri ?? artworkAsset.uri,
    };
  }, []);

  const handlePlayOrStopAudio = useCallback(() => {
    try {
      if (isPlaying) {
        AudioPro.stop();
        setPlaybackState('idle');
        return;
      }
      AudioPro.play(puppiesTrack);
      setPlaybackState('playing');
    } catch (error) {
      console.warn('Failed to play/stop audio', error);
    }
  }, [isPlaying, puppiesTrack]);

  const handlePauseOrResumeAudio = useCallback(() => {
    try {
      if (isPaused) {
        AudioPro.resume();
        setPlaybackState('playing');
        return;
      }
      if (!isPlaying) {
        console.warn('No playback to pause');
        return;
      }
      AudioPro.pause();
      setPlaybackState('paused');
    } catch (error) {
      console.warn('Failed to pause/resume audio', error);
    }
  }, [isPaused, isPlaying]);

  const handleStartOrAbortRecognition = useCallback(() => {
    try {
      if (isRecognitionActive) {
        ExpoSpeechRecognitionModule.abort();
        setIsRecognitionActive(false);
        AudioPro.resume();
        return;
      }
      if (!hasPermission) {
        console.warn('Microphone permission not granted');
        return;
      }
      const isModuleAvailable = ExpoSpeechRecognitionModule.isRecognitionAvailable();
      if (!isModuleAvailable) {
        console.warn('Speech recognition module is not available');
        return;
      }
      AudioPro.pause();
      ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        interimResults: true,
        continuous: true,
        requiresOnDeviceRecognition: false,
      });
      setIsRecognitionActive(true);
      setCurrentTranscript('');
    } catch (error) {
      console.warn('Failed to toggle recognition', error);
    }
  }, [hasPermission, isRecognitionActive]);

  const handleStopRecognition = useCallback(() => {
    try {
      ExpoSpeechRecognitionModule.stop();
      AudioPro.resume();
    } catch (error) {
      console.warn('Failed to stop recognition', error);
    } finally {
      setIsRecognitionActive(false);
    }
  }, []);

  useSpeechRecognitionEvent(
    'result',
    useCallback((event: ExpoSpeechRecognitionResultEvent) => {
      const transcript = event.results[0]?.transcript;
      if (transcript) {
        setCurrentTranscript(transcript);
      }
    }, []),
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">AudioPro Speech Recognition</ThemedText>
      </ThemedView>
      {permissionStatus === 'denied' && (
        <ThemedView style={styles.warningContainer}>
          <ThemedText type="subtitle" style={styles.warningTitle}>
            Microphone access blocked
          </ThemedText>
          <ThemedText style={styles.warningText}>
            Enable speech recognition permissions in system settings to validate capture events.
          </ThemedText>
        </ThemedView>
      )}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Playback & Recognition</ThemedText>
        <View style={styles.controlsContainer}>
          <Button
            title={isPlaying ? 'Stop puppies.mp3' : 'Play puppies.mp3'}
            onPress={handlePlayOrStopAudio}
          />
          <Button
            title={isPaused ? 'Resume audio' : 'Pause audio'}
            onPress={handlePauseOrResumeAudio}
          />
          <Button
            title={isRecognitionActive ? 'Abort recognition' : 'Start recognition'}
            onPress={handleStartOrAbortRecognition}
            disabled={!hasPermission}
          />
          <Button
            title="Stop recognition"
            onPress={handleStopRecognition}
            disabled={!hasPermission}
            color={hasPermission ? 'black' : 'gray'}
          />
        </View>
        {currentTranscript.length > 0 && (
          <ThemedText>Transcript: {currentTranscript}</ThemedText>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  warningContainer: {
    borderColor: '#F9A825',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFF8E1',
    gap: 4,
  },
  warningTitle: {
    color: '#8D6E63',
  },
  warningText: {
    color: '#5D4037',
  },
  section: {
    gap: 6,
    marginBottom: 16,
  },
  controlsContainer: {
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
