import React from 'react';
import { DEFAULT_CONTAINER_ID, OverlayManager } from './OverlayManager';
import type {
  ContentContext,
  OverlayHandler,
  ContentAlignment,
  ProgressAttributes,
  OverlayPresenterConfiguration,
} from '../types';
import type { ViewStyle } from 'react-native';
import { Overlay } from '../components/core';

class OverlayPresenter {
  alignmentStyle(viewAlignment: ContentAlignment | undefined): ViewStyle {
    switch (viewAlignment) {
      case 'top':
        return {
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        };
      case 'bottom':
        return {
          justifyContent: 'flex-end',
          alignItems: 'stretch',
        };
    }
    //
    return {
      justifyContent: 'center',
      alignItems: 'stretch',
    };
  }

  animationContainerStyle(viewAlignment?: ContentAlignment): ViewStyle {
    switch (viewAlignment) {
      case 'left':
        return {
          flex: 1,
          flexDirection: 'row',
        };
      case 'right':
        return {
          flex: 1,
          flexDirection: 'row-reverse',
        };
      case 'fill':
        return {
          flex: 1,
        };
      case 'auto':
        return {
          justifyContent: 'center',
          alignItems: 'center',
        };
    }
    //
    return {};
  }

  present<T>(config: OverlayPresenterConfiguration<T>) {
    return OverlayManager.present(
      (context: ContentContext) => {
        return (
          <Overlay
            onReady={(
              handler?: OverlayHandler,
              progressAttributes?: Partial<ProgressAttributes>
            ) => {
              context.overlayHandler = handler;
              context.overlayAnimated = progressAttributes?.overlayAnimated;
              context.contentAnimated = progressAttributes?.contentAnimated;
              context.userInteractingContent =
                progressAttributes?.userInteractingContent;
              //
              handler?.present();
            }}
            onDidDismiss={() => {
              OverlayManager.dismiss(context);
            }}
            animatedContentStyle={this.animationContainerStyle(
              config.alignment
            )}
            contentStyle={{
              flex: 1,
              ...this.alignmentStyle(config.alignment),
            }}
            {...config.overlayProps}
          >
            <config.component componentContext={context} {...config.props} />
          </Overlay>
        );
      },
      {
        containerId: config.containerId || DEFAULT_CONTAINER_ID,
      }
    );
  }
}

const instance = new OverlayPresenter();

export { instance as OverlayPresenter };
