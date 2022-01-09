import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { BackdropView } from './BackdropView';
import { OverlayContent } from './OverlayContent';
//
import { createStaticHandler } from '../../utils';
import { useExposeHandler } from '../../hooks';
import { ScaleConfiguration } from '../../constants';
//
import type { OverlayHandler, AnimatedLayout, OverlayProps } from '../../types';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedContent: {
    alignItems: 'stretch',
  },
});

const Overlay: React.FC<OverlayProps> = ({
  hasBackdrop = true,
  handler = createStaticHandler<OverlayHandler>(),
  style = {},
  contentStyle = {},
  ContentComponent = OverlayContent,
  contentAttributes = {},
  backdropAttributes = {},
  animatedMetadata = {},
  animatedConfig = ScaleConfiguration,
  animatedContentStyle = {},
  onReady = () => {},
  onDidPresent = () => {},
  onWillPresent = () => {},
  onWillDismiss = () => {},
  onDidDismiss = () => {},
  children = [],
}) => {
  const { offsetX = 0, offsetY = 0 } = contentAttributes;
  const { allowDismissWhenTouch = true } = backdropAttributes;

  const startedAnimation = useRef(false);
  const [visible, setIsVisible] = useState(false);
  //
  const overlayAnimated = useSharedValue(0);
  const contentAnimated = useSharedValue(0);
  const contentLayoutAnimated = useSharedValue<AnimatedLayout>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    offsetX: offsetX,
    offsetY: offsetY,
  });
  const metadataAnimated = useSharedValue(animatedMetadata);
  const userInteractingContent = useSharedValue(false);
  //
  const animatedStyle = useAnimatedStyle(() => {
    return animatedConfig.style(overlayAnimated, {
      layout: contentLayoutAnimated,
      metadata: metadataAnimated,
    });
  });

  const runPresentAnimation = () => {
    animatedConfig?.present(overlayAnimated, () => {
      onDidPresent();
    });
  };

  const runDismissAnimation = (onFinished?: () => void) => {
    animatedConfig?.dismiss(overlayAnimated, () => {
      setIsVisible(false);
      //
      if (onFinished) {
        onFinished();
      }
      //
      onDidDismiss();
    });
  };

  const present = () => {
    onWillPresent();
    setIsVisible(true);
  };

  const dismiss = (onFinished?: () => void) => {
    onWillDismiss();
    runDismissAnimation(onFinished);
  };

  const onBackdropTouched = () => {
    if (allowDismissWhenTouch) {
      dismiss();
    }
  };

  const onAnimatedContentLayout = (e: LayoutChangeEvent) => {
    if (visible && !startedAnimation.current) {
      const { layout } = e.nativeEvent;
      //
      startedAnimation.current = true;
      //
      contentLayoutAnimated.value = {
        ...layout,
        offsetX: offsetX,
        offsetY: offsetY,
      };
      //
      runPresentAnimation();
    }
  };

  const onContentLayoutDismiss = () => {
    handler?.dismiss();
  };

  useExposeHandler<OverlayHandler>(
    handler,
    {
      present,
      dismiss,
    },
    [handler]
  );

  useEffect(() => {
    onReady(handler, {
      overlayAnimated,
      contentAnimated,
      userInteractingContent,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) {
    return null;
  }

  const OverlayContentComponent = ContentComponent || OverlayContent;
  //
  return (
    <View pointerEvents={'box-none'} style={[styles.container, style]}>
      <BackdropView
        {...backdropAttributes}
        visible={hasBackdrop}
        onTouched={onBackdropTouched}
        animatedProgress={overlayAnimated}
      />
      <OverlayContentComponent
        {...contentAttributes}
        {...backdropAttributes}
        style={contentStyle}
        onDismiss={onContentLayoutDismiss}
        overlayAnimated={overlayAnimated}
        contentAnimated={contentAnimated}
        userInteractingContent={userInteractingContent}
      >
        <Animated.View
          pointerEvents={'box-none'}
          onLayout={onAnimatedContentLayout}
          style={[styles.animatedContent, animatedContentStyle, animatedStyle]}
        >
          {children}
        </Animated.View>
      </OverlayContentComponent>
    </View>
  );
};

export { Overlay };
