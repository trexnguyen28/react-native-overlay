import type React from 'react';
import type Animated from 'react-native-reanimated';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

type SharedValue = number | string | boolean | object;

export interface OverlayHandler {
  present: (onFinished?: () => void) => void;
  dismiss: (onFinished?: () => void) => void;
}

export interface AnimatedLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

export interface AnimatedConfiguration<T extends SharedValue = any> {
  style: (
    progress: Animated.SharedValue<number>,
    extraParam: {
      metadata: Animated.SharedValue<T>;
      layout: Animated.SharedValue<AnimatedLayout>;
    }
  ) => ViewStyle;
  present: (
    progress: Animated.SharedValue<number>,
    onFinished: () => void
  ) => void;
  dismiss: (
    progress: Animated.SharedValue<number>,
    onFinished: () => void
  ) => void;
}

export interface ProgressAttributes {
  overlayAnimated: Animated.SharedValue<number>;
  contentAnimated: Animated.SharedValue<number>;
  userInteractingContent: Animated.SharedValue<boolean>;
}

export interface BackdropAttributes {
  alphaOpacity: number;
  backgroundColor: string;
  allowBelowTouch: boolean;
  allowDismissWhenTouch: boolean;
}

export interface ContentAttributes {
  offsetX: number;
  offsetY: number;
  swipeable: boolean;
}

export interface OverlayContentProps
  extends ViewProps,
    Partial<ContentAttributes>,
    Partial<BackdropAttributes>,
    Partial<ProgressAttributes> {
  onDismiss?: () => void;
}

export interface OverlayProps {
  hasBackdrop?: boolean;
  handler?: OverlayHandler;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  ContentComponent?: React.FC<OverlayContentProps>;
  contentAttributes?: Partial<ContentAttributes>;
  backdropAttributes?: Partial<BackdropAttributes>;
  //
  animatedMetadata?: object;
  animatedConfig?: AnimatedConfiguration;
  animatedContentStyle?: StyleProp<ViewStyle>;
  //
  onReady?: (
    handler?: OverlayHandler,
    progressAttributes?: Partial<ProgressAttributes>
  ) => void;
  onDidPresent?: () => void;
  onDidDismiss?: () => void;
  onWillPresent?: () => void;
  onWillDismiss?: () => void;
}
