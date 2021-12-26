import React from 'react';
import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { KeyboardLayout, useKeyboardEvent } from '../../hooks';
//
import type { OverlayContentProps } from 'react-native-overlay';
import { SpringConfiguration } from 'react-native-overlay';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
  },
});

const OverlayInputContent: React.FC<OverlayContentProps> = ({
  style,
  children,
}) => {
  const keyboardHeight = useSharedValue(0);

  const animatedContentStyle = useAnimatedStyle(() => {
    return { marginBottom: keyboardHeight.value };
  });

  useKeyboardEvent({
    onKeyboardShow: ({ height }: KeyboardLayout) => {
      keyboardHeight.value = withSpring(height, SpringConfiguration);
    },
    onKeyboardHide: () => {
      keyboardHeight.value = withSpring(0, SpringConfiguration);
    },
  });

  return (
    <Animated.View
      pointerEvents={'box-none'}
      style={[styles.container, style, animatedContentStyle]}
    >
      {children}
    </Animated.View>
  );
};

export { OverlayInputContent };
