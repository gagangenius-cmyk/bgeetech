// Thin wrappers over the browser's speech APIs (no keys, nothing leaves the device for speaking;
// listening uses the browser's own speech service). Everything degrades quietly when unsupported.

export const VOICE_KEY = "bgee_guide_voice";

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function voiceOn() {
  try {
    return localStorage.getItem(VOICE_KEY) === "1";
  } catch {
    return false;
  }
}

export function speak(text: string) {
  if (!canSpeak() || !text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  const v = window.speechSynthesis.getVoices().find((x) => x.lang.startsWith("en") && /female|zira|samantha|aria|jenny|susan|hazel|google uk english female/i.test(x.name));
  if (v) u.voice = v;
  u.rate = 1.03;
  u.pitch = 1.35;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}

type Alt = { transcript: string };
type Result = { isFinal: boolean; 0: Alt };
export type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<Result> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

export function createRecognition(): Recognition | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const r = new Ctor();
  r.lang = "en-US";
  r.interimResults = true;
  r.continuous = false;
  return r;
}
