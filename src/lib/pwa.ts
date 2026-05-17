interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let _prompt: BeforeInstallPromptEvent | null = null;
const _listeners: Array<() => void> = [];

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    _prompt = e as BeforeInstallPromptEvent;
    _listeners.forEach((fn) => fn());
  });
}

export function onPromptReady(fn: () => void): () => void {
  _listeners.push(fn);
  if (_prompt) fn();
  return () => {
    const i = _listeners.indexOf(fn);
    if (i !== -1) _listeners.splice(i, 1);
  };
}

export function hasInstallPrompt(): boolean {
  return _prompt !== null;
}

export async function triggerInstall(): Promise<boolean> {
  if (!_prompt) return false;
  await _prompt.prompt();
  const { outcome } = await _prompt.userChoice;
  _prompt = null;
  return outcome === "accepted";
}

export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isInStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
}
