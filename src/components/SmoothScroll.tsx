'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

function SmoothScrollHandler() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Find the closest anchor tag clicked
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Handle internal section hashes (e.g., /#community-impact or #community-impact)
      if (href.startsWith('/#') || (href.startsWith('#') && href.length > 1)) {
        const hash = href.startsWith('/#') ? href.substring(1) : href; // e.g. "#community-impact"

        // If on home page, intercept default instant jump and perform smooth Lenis scroll
        if (pathname === '/') {
          const element = document.querySelector(hash);
          if (element) {
            e.preventDefault();
            if (lenis) {
              lenis.scrollTo(hash, { offset: -64, duration: 1.4 });
            } else {
              element.scrollIntoView({ behavior: 'smooth' });
            }
            window.history.pushState(null, '', href);
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [lenis, pathname]);

  // Smooth scroll to target hash on initial page mount (e.g. navigating from another page)
  useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash;
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          if (lenis) {
            lenis.scrollTo(hash, { offset: -64, duration: 1.4 });
          } else {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [lenis, pathname]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.08, 
        duration: 1.2, 
        smoothWheel: true, 
        touchMultiplier: 1,
        syncTouch: false,
      }}
    >
      <SmoothScrollHandler />
      {children}
    </ReactLenis>
  );
}
