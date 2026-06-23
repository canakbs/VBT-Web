'use client';

import { useLenis } from 'lenis/react';

/**
 * A custom hook to interact with the global Lenis smooth scrolling instance.
 * Allows components to scroll programmatically and listen to scroll events.
 */
export function useSmoothScroll() {
  const lenis = useLenis();

  const scrollTo = (
    target: string | number | HTMLElement,
    options?: {
      offset?: number;
      immediate?: boolean;
      duration?: number;
      easing?: (t: number) => number;
      lock?: boolean;
      force?: boolean;
      onComplete?: () => void;
    }
  ) => {
    if (lenis) {
      lenis.scrollTo(target, options);
    }
  };

  return {
    lenis,
    scrollTo,
  };
}
