/**
 * Centralized icon components using lucide-react
 * Provides consistent sizing and styling across the app
 */

import {
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  Lightbulb,
  Volume2,
  VolumeX,
  Music,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Mic,
  MicOff,
  Settings,
  CheckCircle,
  Loader2,
  Zap,
  AlertTriangle,
  FileText,
} from 'lucide-react';

// Re-export with consistent props
export {
  ChevronRight,
  ChevronLeft,
  X as CloseIcon,
  Play as PlayIcon,
  Lightbulb as HintIcon,
  Volume2 as SoundOnIcon,
  VolumeX as SoundOffIcon,
  Music as MusicIcon,
  Sparkles as SuccessIcon,
  ArrowRight,
  ArrowLeft,
  Mic,
  MicOff,
  Settings,
  CheckCircle,
  Loader2 as SpinnerIcon,
  Zap as RunningIcon,
  AlertTriangle as ErrorIcon,
  FileText as OutputIcon,
};

// Common size presets
export const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
} as const;
