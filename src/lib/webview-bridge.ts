/**
 * WebView Bridge - Communication layer between the web app and native mobile app
 *
 * This module provides utilities for:
 * - Detecting if running inside a WebView
 * - Sending messages to the native app
 * - Receiving messages from the native app
 * - Handling navigation events
 * 
 * Security:
 * - All incoming messages are validated for origin and structure
 * - No sensitive data is transmitted
 * - Only whitelisted message types are processed
 */

export interface WebViewMessage {
  type: string;
  payload?: unknown;
}

export interface NativeAppMessage {
  type:
    | 'navigation'
    | 'theme'
    | 'locale'
    | 'progress'
    | 'challenge_complete'
    | 'chapter_complete'
    | 'haptic'
    | 'error';
  payload?: unknown;
}

// Security: Allowed message types from native apps
const ALLOWED_MESSAGE_TYPES = new Set([
  'navigation',
  'theme', 
  'locale',
  'progress',
  'challenge_complete',
  'chapter_complete',
  'haptic',
  'error',
]);

// Security: Allowed origins for postMessage (customize for your native app)
// null is included because native WebViews often have null origin
const ALLOWED_ORIGINS = new Set([
  'null', // Native WebView origin
  'file://', // iOS local files
  // Add your specific native app schemes here:
  // 'jamboscript://',
  // 'capacitor://',
]);

/**
 * Security: Validate message origin
 * Native WebViews typically have null or file:// origins
 */
function isValidOrigin(origin: string): boolean {
  if (!origin) return false;
  
  // Allow same-origin messages
  if (typeof window !== 'undefined' && origin === window.location.origin) {
    return true;
  }
  
  // Allow known native app origins
  if (ALLOWED_ORIGINS.has(origin)) {
    return true;
  }
  
  // Allow null origin (common for WebViews)
  if (origin === 'null') {
    return true;
  }
  
  return false;
}

/**
 * Security: Validate message structure
 */
function isValidMessage(data: unknown): data is WebViewMessage {
  if (!data || typeof data !== 'object') return false;
  const msg = data as Record<string, unknown>;
  if (typeof msg.type !== 'string') return false;
  if (!ALLOWED_MESSAGE_TYPES.has(msg.type)) return false;
  return true;
}

// Extend Window interface for WebView bridges
declare global {
  interface Window {
    // Android WebView
    AndroidBridge?: {
      postMessage: (message: string) => void;
    };
    // iOS WKWebView
    webkit?: {
      messageHandlers?: {
        nativeBridge?: {
          postMessage: (message: unknown) => void;
        };
      };
    };
    // React Native WebView
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    // Generic handler for receiving messages from native
    onNativeMessage?: (message: NativeAppMessage) => void;
  }
}

/**
 * Check if the app is running inside a WebView
 */
export function isWebView(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent.toLowerCase();

  // Check for common WebView indicators
  const isAndroidWebView =
    userAgent.includes('wv') ||
    (userAgent.includes('android') && userAgent.includes('version/'));
  const isIOSWebView =
    !userAgent.includes('safari') &&
    (userAgent.includes('iphone') || userAgent.includes('ipad'));
  const isReactNative = !!window.ReactNativeWebView;
  const hasAndroidBridge = !!window.AndroidBridge;
  const hasIOSBridge = !!window.webkit?.messageHandlers?.nativeBridge;

  return (
    isAndroidWebView ||
    isIOSWebView ||
    isReactNative ||
    hasAndroidBridge ||
    hasIOSBridge
  );
}

/**
 * Get the WebView platform type
 */
export function getWebViewPlatform():
  | 'android'
  | 'ios'
  | 'react-native'
  | 'web'
  | null {
  if (typeof window === 'undefined') return null;

  if (window.ReactNativeWebView) return 'react-native';
  if (window.AndroidBridge) return 'android';
  if (window.webkit?.messageHandlers?.nativeBridge) return 'ios';

  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes('android')) return 'android';
  if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';

  return 'web';
}

/**
 * Send a message to the native app
 */
export function sendToNative(message: NativeAppMessage): boolean {
  if (typeof window === 'undefined') return false;

  const messageStr = JSON.stringify(message);

  try {
    // Try React Native WebView first
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(messageStr);
      return true;
    }

    // Try Android Bridge
    if (window.AndroidBridge) {
      window.AndroidBridge.postMessage(messageStr);
      return true;
    }

    // Try iOS WKWebView
    if (window.webkit?.messageHandlers?.nativeBridge) {
      window.webkit.messageHandlers.nativeBridge.postMessage(message);
      return true;
    }

    // Fallback: dispatch custom event (useful for testing)
    window.dispatchEvent(
      new CustomEvent('webview-message', { detail: message })
    );
    return false;
  } catch (error) {
    console.warn('Failed to send message to native app:', error);
    return false;
  }
}

/**
 * Notify native app of navigation change
 */
export function notifyNavigation(path: string, title?: string): void {
  sendToNative({
    type: 'navigation',
    payload: { path, title, timestamp: Date.now() },
  });
}

/**
 * Notify native app of challenge completion
 */
export function notifyChallengeComplete(
  chapterId: string,
  challengeId: string,
  success: boolean
): void {
  sendToNative({
    type: 'challenge_complete',
    payload: { chapterId, challengeId, success, timestamp: Date.now() },
  });
}

/**
 * Notify native app of chapter completion
 */
export function notifyChapterComplete(chapterId: string): void {
  sendToNative({
    type: 'chapter_complete',
    payload: { chapterId, timestamp: Date.now() },
  });
}

/**
 * Notify native app of user progress
 */
export function notifyProgress(progress: {
  chaptersCompleted: number;
  totalChapters: number;
  currentChapter?: string;
}): void {
  sendToNative({
    type: 'progress',
    payload: progress,
  });
}

/**
 * Notify native app of locale change
 */
export function notifyLocaleChange(locale: string): void {
  sendToNative({
    type: 'locale',
    payload: { locale },
  });
}

/**
 * Notify native app of an error
 */
export function notifyError(error: string, details?: unknown): void {
  sendToNative({
    type: 'error',
    payload: { error, details, timestamp: Date.now() },
  });
}

/**
 * Subscribe to messages from the native app
 * Security: Validates origin and message structure before processing
 */
export function subscribeToNative(
  callback: (message: WebViewMessage) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  // Handler for messages from native
  const handler = (event: MessageEvent | CustomEvent) => {
    try {
      // Security: Validate origin for MessageEvent
      if ('origin' in event && event.origin) {
        if (!isValidOrigin(event.origin)) {
          console.warn('WebView bridge: Blocked message from untrusted origin:', event.origin);
          return;
        }
      }
      
      const data =
        'detail' in event
          ? event.detail
          : typeof event.data === 'string'
            ? JSON.parse(event.data)
            : event.data;
      
      // Security: Validate message structure
      if (!isValidMessage(data)) {
        console.warn('WebView bridge: Blocked invalid message structure');
        return;
      }
      
      callback(data);
    } catch (error) {
      console.warn('Failed to parse native message:', error);
    }
  };

  // Set up global handler for native apps
  window.onNativeMessage = (message: NativeAppMessage) => {
    // Security: Validate message from global handler too
    if (!isValidMessage(message)) {
      console.warn('WebView bridge: Blocked invalid native message');
      return;
    }
    callback(message as WebViewMessage);
  };

  // Listen for postMessage events
  window.addEventListener('message', handler);

  // Cleanup function
  return () => {
    window.removeEventListener('message', handler);
    window.onNativeMessage = undefined;
  };
}

/**
 * React hook for WebView bridge (use in components)
 *
 * Usage:
 * ```tsx
 * import { useWebViewBridge } from '@/lib/webview-bridge';
 *
 * function MyComponent() {
 *   const { isInWebView, platform, sendMessage } = useWebViewBridge((msg) => {
 *     console.log('Received from native:', msg);
 *   });
 *
 *   return isInWebView ? <MobileView /> : <WebView />;
 * }
 * ```
 */
export function createWebViewBridgeHook() {
  // This returns a function that can be used as a hook
  // Import and use in your React components with useEffect
  return {
    isWebView,
    getWebViewPlatform,
    sendToNative,
    subscribeToNative,
    notifyNavigation,
    notifyChallengeComplete,
    notifyChapterComplete,
    notifyProgress,
    notifyLocaleChange,
    notifyError,
  };
}

export const webViewBridge = {
  isWebView,
  getWebViewPlatform,
  sendToNative,
  subscribeToNative,
  notifyNavigation,
  notifyChallengeComplete,
  notifyChapterComplete,
  notifyProgress,
  notifyLocaleChange,
  notifyError,
};

export default webViewBridge;
