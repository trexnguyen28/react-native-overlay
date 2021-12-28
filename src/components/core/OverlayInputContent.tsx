import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
//
import { KeyboardLayout, useKeyboardEvent } from '../../hooks';
import { SpringConfiguration } from '../../constants';
import type { OverlayContentProps } from '../../types';

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
