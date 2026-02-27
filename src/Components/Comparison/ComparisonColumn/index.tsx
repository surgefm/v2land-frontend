import React from 'react';

import { ComparisonStackCard } from '../ComparisonStackCard';
import { StackDiff } from '../hooks/useDiffData';

interface IProps {
  title: string;
  side: 'base' | 'target';
  stackDiffs: StackDiff[];
  order: number[];
  registerCard: (absStackId: number, el: HTMLDivElement | null) => void;
  accentColor?: string;
}

export const ComparisonColumn: React.FC<IProps> = ({
  title,
  side,
  stackDiffs,
  order,
  registerCard,
  accentColor = side === 'base' ? 'rgb(37, 116, 169)' : '#52c41a',
}) => {
  const diffMap = new Map<number, StackDiff>();
  stackDiffs.forEach(d => diffMap.set(d.absStackId, d));

  // Build the display list from the order array for this side, plus items only on the other side
  const displayIds: number[] = [...order];
  const orderSet = new Set(order);

  // Add stacks that only exist on the other side (to show as placeholders)
  stackDiffs.forEach(d => {
    if (!orderSet.has(d.absStackId)) {
      if (side === 'base' && d.status === 'added') {
        // This stack only exists in target — show ghost in base column
        displayIds.push(d.absStackId);
      } else if (side === 'target' && d.status === 'removed') {
        // This stack only exists in base — show ghost in target column
        displayIds.push(d.absStackId);
      }
    }
  });

  return (
    <div className="comparison-column">
      <div className="column-header" style={{ backgroundColor: accentColor }}>
        <h3>{title}</h3>
      </div>
      <div className="column-body">
        {displayIds.map(absId => {
          const diff = diffMap.get(absId);
          if (!diff) return null;

          const stackId =
            side === 'base' ? diff.baseStackId : diff.targetStackId;

          // Ghost card for stacks that don't exist on this side
          if (stackId === null) {
            return (
              <div key={absId} className="ghost-card">
                <div className="ghost-inner" />
              </div>
            );
          }

          return (
            <ComparisonStackCard
              key={absId}
              stackId={stackId}
              status={diff.status}
              newsAdded={side === 'target' ? diff.newsAdded : []}
              newsRemoved={side === 'base' ? diff.newsRemoved : []}
              titleChanged={diff.titleChanged}
              descriptionChanged={diff.descriptionChanged}
              timeChanged={diff.timeChanged}
              cardRef={el => registerCard(absId, el)}
            />
          );
        })}
      </div>

      <style jsx>
        {`
          .comparison-column {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            border-radius: 0.5rem;
            overflow: hidden;
            background-color: #fafafa;
          }

          .column-header {
            padding: 0.75rem 1rem;
            color: #fff;
            position: sticky;
            top: 0;
            z-index: 10;
          }

          .column-header h3 {
            margin: 0;
            font-size: 1rem;
            font-weight: 600;
            color: #fff;
          }

          .column-body {
            padding: 0.75rem;
            flex: 1;
          }

          .ghost-card {
            margin-bottom: 1.25rem;
          }

          .ghost-inner {
            min-height: 4rem;
            border: 2px dashed #d9d9d9;
            border-radius: 0.5rem;
            opacity: 0.4;
          }
        `}
      </style>
    </div>
  );
};
