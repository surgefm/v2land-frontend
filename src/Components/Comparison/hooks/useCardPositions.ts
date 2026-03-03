import { useRef, useState, useCallback, useEffect } from 'react';

export interface CardPosition {
  absStackId: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
  midY: number;
  midX: number;
}

export function useCardPositions() {
  const cardRefsMap = useRef<Map<number, HTMLDivElement>>(new Map());
  const [positions, setPositions] = useState<Map<number, CardPosition>>(new Map());

  const registerCard = useCallback(
    (absStackId: number, element: HTMLDivElement | null) => {
      if (element) {
        cardRefsMap.current.set(absStackId, element);
      } else {
        cardRefsMap.current.delete(absStackId);
      }
    },
    []
  );

  const measureAll = useCallback(() => {
    const newPositions = new Map<number, CardPosition>();
    cardRefsMap.current.forEach((el, id) => {
      const rect = el.getBoundingClientRect();
      newPositions.set(id, {
        absStackId: id,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        midY: rect.top + rect.height / 2,
        midX: rect.left + rect.width / 2,
      });
    });
    setPositions(newPositions);
  }, []);

  useEffect(() => {
    measureAll();
    window.addEventListener('resize', measureAll);
    return () => window.removeEventListener('resize', measureAll);
  }, [measureAll]);

  return { registerCard, positions, measureAll };
}
