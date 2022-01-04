import { useState, useEffect } from "react";

export default function useIntersection(ref: any, threshold = 0.5) {
  const [isIntersected, setIsIntersected] = useState(false);
  useEffect(
    () => {
      if (ref.current) {
        const ob = new IntersectionObserver(
          ([entry], observer) => {
            if (entry.intersectionRatio >= threshold) {
              setIsIntersected(true);
            } else {
              setIsIntersected(false);
            }
          },
          { threshold }
        );
        const current = ref.current; 
        ob.observe(current);

        return () => {
          ob.unobserve(current);
        };
      }
    },
    [ref, threshold]
  );
  return isIntersected;
}
