import { useEffect, useState } from 'react';

/**
 * Tracks vertical scroll offset. Used by the navbar to transition from
 * transparent (at the top of a hero) to solid black once the user scrolls.
 */
export function useScrollPosition(threshold = 16): { scrollY: number; isScrolled: boolean } {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollY, isScrolled: scrollY > threshold };
}
