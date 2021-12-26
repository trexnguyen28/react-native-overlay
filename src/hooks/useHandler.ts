import { useRef } from 'react';

export const useHandler = <T>(): T => {
  const _handler = useRef({});
  return _handler.current as T;
};
