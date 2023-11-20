import { useEffect } from 'react';

export function Service(paramsString, url) {
  useEffect(() => {
    const searchParams = new URLSearchParams(paramsString);

    const paramsObj = Array.from(searchParams.entries()).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {},
    );

    localStorage.setItem(
      'PageWithParams',
      JSON.stringify({ ...paramsObj, url }),
    );
  }, []);
}
