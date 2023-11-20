import * as React from 'react';

const useDebounce = (value, timeout) => {
  const [debounced, setDebounced] = React.useState(() => value);

  React.useEffect(() => {
    const delay = setTimeout(() => {
      setDebounced(value);
    }, timeout || 1000);
    return () => {
      clearTimeout(delay);
    };
  }, [value]);
  return debounced;
};

export default useDebounce;
