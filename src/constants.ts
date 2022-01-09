import {
  Easing,
  runOnJS,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import type { AnimatedConfiguration } from './types';

const BaseDuration = 250;

export const SpringConfiguration = {
  mass: 1,
  damping: 60,
  velocity: 0,
  stiffness: 280,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

export const FadeConfiguration: AnimatedConfiguration = {
  style: (progress) => {
    'worklet';
    return { opacity: progress.value };
  },
  present: (progress, onFinished) => {
    progress.value = withTiming(
      1,
      { duration: BaseDuration, easing: Easing.ease },
      (isFinished) => {
        if (isFinished) {
          runOnJS(onFinished)();
        }
      }
    );
  },
  dismiss: (progress, onFinished) => {
    progress.value = withTiming(
      0,
      { duration: BaseDuration, easing: Easing.ease },
      () => {
        runOnJS(onFinished)();
      }
    );
  },
};

export const ScaleConfiguration: AnimatedConfiguration = {
  style: (progress) => {
    'worklet';
    return { transform: [{ scale: progress.value }] };
  },
  present: (progress, onFinished) => {
    progress.value = withSpring(1, SpringConfiguration, (isFinished) => {
      if (isFinished) {
        runOnJS(onFinished)();
      }
    });
  },
  dismiss: (progress, onFinished) => {
    progress.value = withTiming(
      0,
      { duration: BaseDuration, easing: Easing.ease },
      (isFinished) => {
        if (isFinished) {
          runOnJS(onFinished)();
        }
      }
    );
  },
};

export const SlideUpAnimation: AnimatedConfiguration = {
  style: (progress, extraInfo) => {
    'worklet';
    const { height, offsetY } = extraInfo.layout.value;
    return {
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [height, offsetY]),
        },
      ],
    };
  },
  present: (progress, onFinished) => {
    progress.value = withSpring(1, SpringConfiguration, (isFinished) => {
      if (isFinished) {
        runOnJS(onFinished)();
      }
    });
  },
  dismiss: (progress, onFinished) => {
    progress.value = withTiming(
      0,
      { duration: BaseDuration, easing: Easing.ease },
      (isFinished) => {
        if (isFinished) {
          runOnJS(onFinished)();
        }
      }
    );
  },
};

export const SlideDownConfiguration: AnimatedConfiguration = {
  style: (progress, extraInfo) => {
    'worklet';
    const { height, offsetY } = extraInfo.layout.value;
    //
    return {
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [-height, -offsetY]),
        },
      ],
    };
  },
  present: (progress, onFinished) => {
    progress.value = withSpring(1, SpringConfiguration, (isFinished) => {
      if (isFinished) {
        runOnJS(onFinished)();
      }
    });
  },
  dismiss: (progress, onFinished) => {
    progress.value = withTiming(
      0,
      { duration: BaseDuration, easing: Easing.ease },
      (isFinished) => {
        if (isFinished) {
          runOnJS(onFinished)();
        }
      }
    );
  },
};

export const SlideFromLeftConfiguration: AnimatedConfiguration = {
  style: (progress, extraInfo) => {
    'worklet';
    const { width, offsetX } = extraInfo.layout.value;
    return {
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
      transform: [
        {
          translateX: interpolate(progress.value, [0, 1], [-width, -offsetX]),
        },
      ],
    };
  },
  present: (progress, onFinished) => {
    progress.value = withSpring(1, SpringConfiguration, (isFinished) => {
      if (isFinished) {
        runOnJS(onFinished)();
      }
    });
  },
  dismiss: (progress, onFinished) => {
    progress.value = withTiming(
      0,
      { duration: BaseDuration, easing: Easing.ease },
      (isFinished) => {
        if (isFinished) {
          runOnJS(onFinished)();
        }
      }
    );
  },
};

export const SlideFromRightConfiguration: AnimatedConfiguration = {
  style: (progress, extraInfo) => {
    'worklet';
    const { width, offsetX } = extraInfo.layout.value;
    return {
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
      transform: [
        {
          translateX: interpolate(progress.value, [0, 1], [width, offsetX]),
        },
      ],
    };
  },
  present: (progress, onFinished) => {
    progress.value = withSpring(1, SpringConfiguration, (isFinished) => {
      if (isFinished) {
        runOnJS(onFinished)();
      }
    });
  },
  dismiss: (progress, onFinished) => {
    progress.value = withTiming(
      0,
      { duration: BaseDuration, easing: Easing.ease },
      (isFinished) => {
        if (isFinished) {
          runOnJS(onFinished)();
        }
      }
    );
  },
};

export const NoneConfiguration: AnimatedConfiguration = {
  style: (_) => {
    'worklet';
    return {};
  },
  present: (_, onFinished) => {
    runOnJS(onFinished)();
  },
  dismiss: (_, onFinished) => {
    runOnJS(onFinished)();
  },
};
