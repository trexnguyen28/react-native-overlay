import React, { useState, useEffect } from 'react';
import { OverlayManager, DEFAULT_CONTAINER_ID } from './OverlayManager';
import { useExposeHandler, useHandler } from '../hooks';
import type { OverlayContainerHandler } from '../types';

export interface OverlayContainerProps {
  containerId?: string;
}

const OverlayProvider: React.FC<OverlayContainerProps> = ({
  containerId = DEFAULT_CONTAINER_ID,
}) => {
  const handler = useHandler<OverlayContainerHandler>();
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rerender, setRerender] = useState<number>(0);
  // TODO Check here
  const rerenderIfAny = () => {
    setRerender((value) => ++value);
  };

  OverlayManager.setContainerHandler(handler, containerId);

  const contentConfigs = OverlayManager.getChildComponentFuncs(containerId);

  useExposeHandler(handler, { rerenderIfAny }, [handler]);

  useEffect(() => {
    return () => {
      OverlayManager.cleanupContainer(containerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (contentConfigs.length > 0) {
    return (
      <React.Fragment>
        {contentConfigs.map((config) => {
          return (
            <React.Fragment key={config.id}>
              {config.component(config.context)}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  }
  //
  return null;
};

export { OverlayProvider };
