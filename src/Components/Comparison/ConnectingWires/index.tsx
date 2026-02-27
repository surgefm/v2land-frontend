import React, { useEffect, useState, useRef, useCallback } from 'react';

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
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, offsetTop: 0, offsetLeft: 0 });

  const updateDimensions = useCallback(() => {
    if (!containerRef.current || !svgRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();
    setDimensions({
      width: svgRect.width,
      height: containerRect.height,
      offsetTop: svgRect.top - containerRect.top,
      offsetLeft: svgRect.left - containerRect.left,
    });
  }, [containerRef]);

  useEffect(() => {
    updateDimensions();
    const handle = requestAnimationFrame(updateDimensions);
    return () => cancelAnimationFrame(handle);
  }, [basePositions, targetPositions, updateDimensions]);

  const matchedDiffs = stackDiffs.filter(
    d => d.baseStackId !== null && d.targetStackId !== null
  );

  const paths = matchedDiffs
    .map(diff => {
      const basePos = basePositions.get(diff.absStackId);
      const targetPos = targetPositions.get(diff.absStackId);
      if (!basePos || !targetPos || !containerRef.current) return null;

      const containerRect = containerRef.current.getBoundingClientRect();
      const svgEl = svgRef.current;
      if (!svgEl) return null;
      const svgRect = svgEl.getBoundingClientRect();

      const y1 = basePos.midY - containerRect.top;
      const y2 = targetPos.midY - containerRect.top;
      const x1 = 0;
      const x2 = svgRect.width;

      const cpOffset = svgRect.width * 0.4;

      const color = diff.status === 'modified' ? '#fa8c16' : '#d9d9d9';
      const dashArray = diff.status === 'unchanged' ? '6,4' : 'none';

      return (
        <path
          key={diff.absStackId}
          d={`M ${x1} ${y1} C ${x1 + cpOffset} ${y1}, ${x2 - cpOffset} ${y2}, ${x2} ${y2}`}
          stroke={color}
          strokeWidth={2}
          fill="none"
          strokeDasharray={dashArray}
          opacity={0.7}
        />
      );
    })
    .filter(Boolean);

  return (
    <div className="wires-container">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      >
        {paths}
      </svg>

      <style jsx>
        {`
          .wires-container {
            position: relative;
            width: 6rem;
            min-width: 6rem;
            flex-shrink: 0;
          }

          @media (max-width: 768px) {
            .wires-container {
              width: 100%;
              min-width: unset;
              height: 4rem;
              min-height: 4rem;
            }
          }
        `}
      </style>
    </div>
  );
};
