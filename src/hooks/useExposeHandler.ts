import { useEffect } from 'react';

// TODO use imperative handler
export const useExposeHandler = <T>(
  handler: any,
  methods: T,
  dependency: any[] = []
) => {
  useEffect(() => {
    if (handler) {
      Object.assign(handler, methods);
    }
    return () => {
      if (handler) {
        Object.assign(handler, {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependency);
};
