'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook that listens to a CSS media query and returns whether it matches.
 * Used for conditional rendering instead of CSS show/hide to avoid duplicate DOM nodes.
 *
 * @param query - A valid CSS media query string, e.g. '(min-width: 1024px)'
 * @returns boolean indicating if the media query currently matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
