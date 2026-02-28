import React, { useEffect, useState, useCallback } from 'react';

import { CardPosition } from '../hooks/useCardPositions';
import { StackDiff } from '../hooks/useDiffData';

interface IProps {
  basePositions: Map<number, CardPosition>;
  targetPositions: Map<number, CardPosition>;
  stackDiffs: StackDiff[];
  containerRef: React.RefObject<HTMLDivElement>;
}

export const ConnectingWires: React.FC<IProps> = ({
  basePositions,
  targetPositions,
  stackDiffs,
  containerRef,
}) => {
  const [svgContent, setSvgContent] = useState<React.ReactNode[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);

  const computePaths = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const scrollTop = container.scrollTop;
    setContainerHeight(container.scrollHeight);

    const matchedDiffs = stackDiffs.filter(
      d => d.baseStackId !== null && d.targetStackId !== null
    );

    const paths = matchedDiffs
      .map(diff => {
        const basePos = basePositions.get(diff.absStackId);
        const targetPos = targetPositions.get(diff.absStackId);
        if (!basePos || !targetPos) return null;

        // Convert viewport coordinates to container-relative coordinates
        const y1 = basePos.midY - containerRect.top + scrollTop;
        const y2 = targetPos.midY - containerRect.top + scrollTop;

        // x: draw from ~47% to ~53% of container width (the gap between columns)
        const x1 = containerRect.width * 0.44;
        const x2 = containerRect.width * 0.56;
        const cpOffset = (x2 - x1) * 0.6;

        const color = diff.status === 'modified' ? '#fa8c16' : '#d9d9d9';
        const dashArray = diff.status === 'unchanged' ? '6,4' : 'none';
        const strokeWidth = diff.status === 'modified' ? 2.5 : 1.5;

        return (
          <path
            key={diff.absStackId}
            d={`M ${x1} ${y1} C ${x1 + cpOffset} ${y1}, ${x2 - cpOffset} ${y2}, ${x2} ${y2}`}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={dashArray}
            opacity={0.8}
          />
        );
      })
      .filter(Boolean);

    setSvgContent(paths as React.ReactNode[]);
  }, [basePositions, targetPositions, stackDiffs, containerRef]);

  useEffect(() => {
    computePaths();
  }, [computePaths]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => requestAnimationFrame(computePaths);
    container.addEventListener('scroll', onScroll);
    window.addEventListener('resize', computePaths);

    return () => {
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', computePaths);
    };
  }, [containerRef, computePaths]);

  return (
    <svg
      width="100%"
      height={containerHeight || '100%'}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      {svgContent}
    </svg>
  );
};
