import { useState, useEffect, useRef } from 'react';

export function useToggle(initialValue) {
  const [value, setValue] = useState(initialValue);
  const toggleValue = () => setValue((v) => !v);
  return [value, toggleValue];
}

export function useDebouncedCallback(callback, wait) {
  const argsRef = useRef();
  const timeout = useRef();

  function cleanup() {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }
  useEffect(() => cleanup, []);
  return function debouncedCallback(...args) {
    argsRef.current = args;
    cleanup();
    timeout.current = setTimeout(() => {
      if (argsRef.current) {
        callback(...argsRef.current);
      }
    }, wait);
  };
}
