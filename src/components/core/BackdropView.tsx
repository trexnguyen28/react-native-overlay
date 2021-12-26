import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  Extrapolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  State,
  TapGestureHandler,
  HandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import type { BackdropAttributes } from '../../types';

export interface BackdropViewProps extends Partial<BackdropAttributes> {
  visible?: boolean;
  onTouched?: () => void;
  animatedProgress: Animated.SharedValue<number>;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const BackdropView: React.FC<BackdropViewProps> = ({
  visible = true,
  onTouched,
  animatedProgress,
  alphaOpacity = 0.7,
  backgroundColor = 'gray',
  allowBelowTouch = false,
}) => {
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animatedProgress.value,
        [0, 1],
        [0, alphaOpacity],
        Extrapolate.CLAMP
      ),
    };
  }, [alphaOpacity]);

  const onHandlerStateChanged = ({ nativeEvent }: HandlerStateChangeEvent) => {
    if (nativeEvent.state === State.ACTIVE) {
      onTouched && onTouched();
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <TapGestureHandler onHandlerStateChange={onHandlerStateChanged}>
      <Animated.View
        pointerEvents={allowBelowTouch ? 'none' : 'auto'}
        style={[styles.container, animatedStyles, { backgroundColor }]}
      />
    </TapGestureHandler>
  );
};

export { BackdropView };
