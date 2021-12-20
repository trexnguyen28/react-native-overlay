import React from 'react';
import { StyleSheet } from 'react-native';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

interface BackDropViewProps {
  visible?: boolean;
  onTapped?: () => void;
  alphaOpacity?: number;
  backgroundColor?: string;
  allowBelowTouch?: boolean;
  animatedProgress: Animated.SharedValue<number>;
}

const BackDropView: React.FC<BackDropViewProps> = ({
  onTapped,
  animatedProgress,
  visible = true,
  alphaOpacity = 0.7,
  backgroundColor = 'gray',
  allowBelowTouch = false,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        animatedProgress.value,
        [0, 1],
        [0, alphaOpacity],
        Extrapolate.CLAMP
      ),
    };
  }, [alphaOpacity]);

  if (!visible) {
    return null;
  }

  return (
    <TapGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          onTapped && onTapped();
        }
      }}
    >
      <Animated.View
        style={[styles.container, animatedStyle, { backgroundColor }]}
        pointerEvents={allowBelowTouch ? 'none' : 'auto'}
      />
    </TapGestureHandler>
  );
};
export { BackDropView };
