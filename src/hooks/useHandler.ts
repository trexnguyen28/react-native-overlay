import { useRef } from 'react';

// TODO use imperative handler
export const useHandler = <T>(): T => {
  const _handler = useRef({});
  return _handler.current as T;
};
