import { useCallback, useEffect, useRef, useState } from 'react';

export default function useDebounce<T>(val: T, delay = 150) {
  const [debounced, setDebounced] = useState(val);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(val);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [val, delay]);

  return debounced;
}

type DebounceCallbackOptions = {
  delay?: number;
};

export function useDebounceCallback<T extends (...args: Parameters<T>) => void | Promise<void>>(
  callback: T,
  options: DebounceCallbackOptions = {},
): (...args: Parameters<T>) => void | Promise<void> {
  const { delay = 300 } = options;

  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay],
  );

  return debouncedCallback;
}
