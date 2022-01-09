import React from 'react';
import Animated, {
  runOnJS,
  withSpring,
  Extrapolate,
  interpolate,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {
  State,
  PanGestureHandler,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

import { KeyboardLayout, useKeyboardEvent } from '../../hooks';
import { SpringConfiguration } from '../../constants';
import type { OverlayContentProps } from '../../types';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  },
});

const SlideUpInputContent: React.FC<OverlayContentProps> = ({
  onDismiss,
  contentAnimated,
  overlayAnimated,
  userInteractingContent,
  allowDismissWhenTouch,
  children,
  offsetY = 0,
  alphaOpacity = 0.7,
  backgroundColor = 'grey',
  swipeable,
}) => {
  const keyboardHeight = useSharedValue(0);

  const dismiss = () => {
    onDismiss && onDismiss();
  };

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startY = contentAnimated.value;
      userInteractingContent.value = true;
    },
    onActive: (event, ctx) => {
      contentAnimated.value = Math.max(
        ctx.startY + event.translationY,
        offsetY * -1
      );
    },
    onEnd: (_) => {
      if (contentAnimated.value > offsetY) {
        runOnJS(dismiss)();
      } else {
        contentAnimated.value = withSpring(
          0,
          SpringConfiguration,
          (isFinished) => {
            if (isFinished) {
              userInteractingContent.value = false;
            }
          }
        );
      }
    },
  });

  const animatedLayoutStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: contentAnimated.value }] };
  });

  const animatedLayoutWithKeyboardStyle = useAnimatedStyle(() => {
    return { marginBottom: keyboardHeight.value };
  });

  const opacityOverlayStyle = useAnimatedStyle(() => {
    if (!userInteractingContent.value) {
      return {
        opacity: interpolate(
          overlayAnimated.value,
          [0, 1],
          [0, alphaOpacity],
          Extrapolate.CLAMP
        ),
      };
    } else {
      return {
        opacity: interpolate(
          contentAnimated.value,
          [0, offsetY],
          [alphaOpacity, 0],
          Extrapolate.CLAMP
        ),
      };
    }
  });

  const onBackdropTapped = (event: TapGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.END) {
      userInteractingContent.value = false;
      //
      if (allowDismissWhenTouch) {
        dismiss();
      }
    }
  };

  useKeyboardEvent({
    onKeyboardHide: () => {
      keyboardHeight.value = withSpring(0, SpringConfiguration);
    },
    onKeyboardShow: ({ height }: KeyboardLayout) => {
      keyboardHeight.value = withSpring(height, SpringConfiguration);
    },
  });

  return (
    <React.Fragment>
      <Animated.View
        style={[styles.backdrop, { backgroundColor }, opacityOverlayStyle]}
      />
      <PanGestureHandler enabled={swipeable} onGestureEvent={gestureHandler}>
        <Animated.View
          style={[
            styles.content,
            animatedLayoutStyle,
            animatedLayoutWithKeyboardStyle,
          ]}
        >
          <TapGestureHandler onHandlerStateChange={onBackdropTapped}>
            <Animated.View
              style={{ ...styles.backdrop, backgroundColor: 'transparent' }}
            />
          </TapGestureHandler>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </React.Fragment>
  );
};

export { SlideUpInputContent };
