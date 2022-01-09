import type {
  ContentContext,
  ContentComponent,
  ContentConfiguration,
  OverlayContainerHandler,
} from '../types';
import { randomString } from '../utils';

export const DEFAULT_CONTAINER_ID = 'defaultContainerId';
export const DEFAULT_CONTENT_ID = 'defaultContentId';

class OverlayManager {
  overlayContainerHandlers: Map<string, OverlayContainerHandler> = new Map<
    string,
    OverlayContainerHandler
  >();

  contentConfigs: Map<string, ContentConfiguration[]> = new Map<
    string,
    ContentConfiguration[]
  >();

  getChildComponentFuncs(
    containerId: string = DEFAULT_CONTAINER_ID
  ): ContentConfiguration[] {
    if (this.contentConfigs.has(containerId)) {
      return this.contentConfigs.get(containerId) || [];
    }

    this.contentConfigs.set(containerId, []);

    return [];
  }

  getTopLayerHandler(containerId: string = DEFAULT_CONTAINER_ID) {
    if (this.overlayContainerHandlers.has(containerId)) {
      return this.overlayContainerHandlers.get(containerId);
    }

    return null;
  }

  setContainerHandler(
    handler: OverlayContainerHandler,
    containerId: string = DEFAULT_CONTAINER_ID
  ) {
    this.overlayContainerHandlers.set(containerId, handler);
  }

  present(
    contentComponent: ContentComponent,
    options: { containerId?: string } = { containerId: DEFAULT_CONTAINER_ID }
  ) {
    const containerId = options.containerId || DEFAULT_CONTAINER_ID;
    const contentId = randomString({ length: 8 });
    const contentConfiguration: ContentConfiguration = {
      id: contentId,
      component: contentComponent,
      context: { contentId, containerId },
    };
    const childContentConfigs = this.getChildComponentFuncs(
      options.containerId
    );
    const containerHandler = this.getTopLayerHandler(containerId);

    childContentConfigs.push(contentConfiguration);
    //
    if (containerHandler) {
      containerHandler.rerenderIfAny();
    } else {
      throw new Error(
        `OverlayContainer with containerId = ${options.containerId} could not be found.`
      );
    }

    return contentId;
  }

  removeContentById(containerId: string, contentId: string) {
    const childContentConfigs = this.getChildComponentFuncs(containerId);
    const index = childContentConfigs.findIndex((item) => {
      return item.id === contentId;
    });
    //
    if (index !== -1) {
      childContentConfigs.splice(index, 1);
    }
  }

  dismiss(
    context: ContentContext = {
      containerId: DEFAULT_CONTAINER_ID,
      contentId: DEFAULT_CONTENT_ID,
    }
  ) {
    this.removeContentById(context.containerId, context.contentId);
    //
    const containerHandler = this.getTopLayerHandler(context.containerId);
    //
    if (containerHandler) {
      containerHandler.rerenderIfAny();
    }
  }

  dismissAll(context = { containerId: DEFAULT_CONTAINER_ID }) {
    this.contentConfigs.set(context.containerId, []);
    //
    const containerHandler = this.getTopLayerHandler(context.containerId);
    if (containerHandler) {
      containerHandler.rerenderIfAny();
    }
  }

  dismissAllContainers() {
    this.contentConfigs.forEach((_, key) => {
      this.dismissAll({ containerId: key });
    });
  }

  cleanupContainer(containerId: string) {
    this.contentConfigs.set(containerId, []);
  }
}

const instance = new OverlayManager();

export { instance as OverlayManager };
