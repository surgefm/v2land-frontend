import React, { useRef, useEffect } from 'react';

import { useDiffData, DiffResult } from './hooks/useDiffData';
import { useCardPositions } from './hooks/useCardPositions';
import { DiffSummary } from './DiffSummary';
import { EventDetailDiff } from './EventDetailDiff';
import { ComparisonColumn } from './ComparisonColumn';
import { ConnectingWires } from './ConnectingWires';

interface IProps {
  baseEventId: number;
  targetEventId: number;
  baseLabel?: string;
  targetLabel?: string;
  baseAccentColor?: string;
  targetAccentColor?: string;
  renderFooter?: (diffResult: DiffResult) => React.ReactNode;
}

export const ComparisonView: React.FC<IProps> = ({
  baseEventId,
  targetEventId,
  baseLabel = '已提交',
  targetLabel = '草稿',
  baseAccentColor = 'rgb(37, 116, 169)',
  targetAccentColor = '#52c41a',
  renderFooter,
}) => {
  const diffResult = useDiffData(baseEventId, targetEventId);
  const basePositions = useCardPositions();
  const targetPositions = useCardPositions();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      basePositions.measureAll();
      targetPositions.measureAll();
    }, 100);
    return () => clearTimeout(timer);
  }, [diffResult]);

  const handleScroll = () => {
    requestAnimationFrame(() => {
      basePositions.measureAll();
      targetPositions.measureAll();
    });
  };

  return (
    <div className="comparison-root">
      <DiffSummary
        diffResult={diffResult}
        baseLabel={baseLabel}
        targetLabel={targetLabel}
      />

      <EventDetailDiff
        baseEventId={baseEventId}
        targetEventId={targetEventId}
        diff={diffResult.eventDiff}
      />

      <div
        className="comparison-container"
        ref={containerRef}
        onScroll={handleScroll}
      >
        <ComparisonColumn
          title={baseLabel}
          side="base"
          stackDiffs={diffResult.stackDiffs}
          order={diffResult.baseOrder}
          registerCard={basePositions.registerCard}
          accentColor={baseAccentColor}
        />

        <div className="wires-gap" />

        <ComparisonColumn
          title={targetLabel}
          side="target"
          stackDiffs={diffResult.stackDiffs}
          order={diffResult.targetOrder}
          registerCard={targetPositions.registerCard}
          accentColor={targetAccentColor}
        />

        <ConnectingWires
          basePositions={basePositions.positions}
          targetPositions={targetPositions.positions}
          stackDiffs={diffResult.stackDiffs}
          containerRef={containerRef}
        />
      </div>

      {renderFooter && renderFooter(diffResult)}

      <style jsx>
        {`
          .comparison-root {
            padding: 5rem 1.5rem 1.5rem 1.5rem;
            max-width: 72rem;
            margin: 0 auto;
            min-height: 100vh;
          }

          .comparison-container {
            display: flex;
            align-items: flex-start;
            gap: 0;
            position: relative;
            overflow-y: auto;
            max-height: calc(100vh - 14rem);
          }

          .wires-gap {
            width: 6rem;
            min-width: 6rem;
            flex-shrink: 0;
          }

          @media (max-width: 768px) {
            .comparison-root {
              padding: 5rem 0.75rem 1rem 0.75rem;
            }

            .comparison-container {
              flex-direction: column;
              max-height: none;
              overflow-y: visible;
            }

            .wires-gap {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};
