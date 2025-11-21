# AGENTS

## Overview

- Agents coordinate speech-capture, inference, and playback pipelines.
- Each agent runs independently but shares typed events via the app bus.
- Production focus: low-latency streaming, glitch-free audio, explicit observability.
- All agents run inside Expo/React Native contexts; backend services optional.
- The `(tabs)/index` demo surface includes manual AudioPro playback and Expo Speech Recognition controls that emit live transcripts via `useSpeechRecognitionEvent('result', ...)` for quick validation without wiring extra agents.

## VoiceCaptureAgent

- Manages microphone permissions and hotword triggers.
- Streams PCM chunks into the shared ring buffer; tags each chunk with timestamp + VAD flags.
- Emits `capture:status` events for UI state (idle, arming, recording).
- Hardened against backgrounding by halting acquisition once `AppState !== active`.

## TranscriptionAgent

- Subscribes to the ring buffer; batches frames (configurable 320-960 samples).
- Sends frames to the selected model provider (default: on-device whisper.cpp build).
- Provides word-level timings + confidence and emits `transcript:update`.
- Retries failed RPCs with exponential backoff; falls back to offline queueing when offline.

## IntentRouterAgent

- Listens to `transcript:final` messages and runs lightweight intent classification.
- Normalizes intents into the `IntentEnvelope` schema (`name`, `slots`, `confidence`).
- Dispatches matched intents to automation hooks (e.g., prompt composer, shortcut runner).
- Logs low-confidence intents for later tuning and A/B comparisons.

## PlaybackAgent

- Receives `intent:tts` requests, fetches synthesized audio, and streams playback.
- Crossfades with ongoing capture to avoid user-audible pops.
- Publishes `playback:metrics` (latency, underruns) to the diagnostics view.

## EvaluationAgent

- Periodically samples agent telemetry and runs drift checks (WER delta, VAD accuracy).
- Flags regressions to Sentry via `agent:alert` payloads with repro snippets.
- Generates nightly CSV reports stored under `assets/telemetry`.

## Extending

- Implement new agents by conforming to `AgentLifecycle` (`start`, `stop`, `handleEvent`).
- Register the agent inside `app/agents/index.ts` and expose its events in the `AgentBus`.
- Prefer stateless logic; persist mutable data through shared stores or secure storage.
- Document new agents in this file and update README usage examples accordingly.
