/**
 * Haptic Feedback Utility
 * 
 * Provides cross-platform haptic feedback for mobile devices.
 * Supports:
 * - Native Capacitor apps (iOS & Android)
 * - Web Vibration API (Android browsers)
 * - Graceful fallback for unsupported platforms
 */

import { sendToNative } from './webview-bridge';

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export interface HapticOptions {
  /** Haptic intensity style */
  style?: HapticStyle;
  /** Whether haptics are enabled (defaults to true) */
  enabled?: boolean;
}

/**
 * Check if haptic feedback is available on this device
 */
export function isHapticAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for Vibration API (most Android browsers)
  if ('vibrate' in navigator) return true;
  
  // Check for Capacitor Haptics (if available)
  if (typeof window !== 'undefined' && (window as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.()) {
    return true;
  }
  
  return false;
}

/**
 * Trigger haptic feedback with specified style
 */
export async function triggerHaptic(options: HapticOptions = {}): Promise<void> {
  const { style = 'medium', enabled = true } = options;
  
  if (!enabled || typeof window === 'undefined') return;
  
  // Try Capacitor Haptics first (best for native apps)
  const sentToNative = sendToNative({
    type: 'haptic',
    payload: { style },
  });
  
  if (sentToNative) return;
  
  // Fallback to Web Vibration API
  if ('vibrate' in navigator) {
    const patterns: Record<HapticStyle, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      warning: [15, 30, 15],
      error: [30, 50, 30],
    };
    
    const pattern = patterns[style] || 20;
    navigator.vibrate(pattern);
  }
}

/**
 * Pre-configured haptic feedback functions for common interactions
 */

/** Light tap feedback (e.g., button press, toggle) */
export function hapticLight(enabled = true) {
  return triggerHaptic({ style: 'light', enabled });
}

/** Medium tap feedback (e.g., important button, selection) */
export function hapticMedium(enabled = true) {
  return triggerHaptic({ style: 'medium', enabled });
}

/** Heavy tap feedback (e.g., significant action, confirmation) */
export function hapticHeavy(enabled = true) {
  return triggerHaptic({ style: 'heavy', enabled });
}

/** Success feedback (e.g., challenge completed, correct answer) */
export function hapticSuccess(enabled = true) {
  return triggerHaptic({ style: 'success', enabled });
}

/** Warning feedback (e.g., hint used, approaching limit) */
export function hapticWarning(enabled = true) {
  return triggerHaptic({ style: 'warning', enabled });
}

/** Error feedback (e.g., wrong answer, invalid input) */
export function hapticError(enabled = true) {
  return triggerHaptic({ style: 'error', enabled });
}

/**
 * Hook for using haptics with game store settings
 * Usage: const haptic = useHaptic();
 * Then: haptic.success();
 */
export function useHaptic() {
  // Note: In a real implementation, this would check the game store
  // for a "hapticsEnabled" setting. For now, we default to true.
  const enabled = true;
  
  return {
    light: () => hapticLight(enabled),
    medium: () => hapticMedium(enabled),
    heavy: () => hapticHeavy(enabled),
    success: () => hapticSuccess(enabled),
    warning: () => hapticWarning(enabled),
    error: () => hapticError(enabled),
    trigger: (style: HapticStyle) => triggerHaptic({ style, enabled }),
  };
}
