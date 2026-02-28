import React, { useState } from 'react';

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

interface DisplayItem {
  type: 'card';
  absId: number;
  diff: StackDiff;
}

interface UnchangedGroup {
  type: 'unchanged-group';
  count: number;
  absIds: number[];
  diffs: StackDiff[];
}

type DisplayEntry = DisplayItem | UnchangedGroup;

export const ComparisonColumn: React.FC<IProps> = ({
  title,
  side,
  stackDiffs,
  order,
  registerCard,
  accentColor = side === 'base' ? 'rgb(37, 116, 169)' : '#52c41a',
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

  const diffMap = new Map<number, StackDiff>();
  stackDiffs.forEach(d => diffMap.set(d.absStackId, d));

  // Build the full display list
  const displayIds: number[] = [...order];
  const orderSet = new Set(order);

  stackDiffs.forEach(d => {
    if (!orderSet.has(d.absStackId)) {
      if (side === 'base' && d.status === 'added') {
        displayIds.push(d.absStackId);
      } else if (side === 'target' && d.status === 'removed') {
        displayIds.push(d.absStackId);
      }
    }
  });

  // Group consecutive unchanged stacks
  const entries: DisplayEntry[] = [];
  let i = 0;
  while (i < displayIds.length) {
    const absId = displayIds[i];
    const diff = diffMap.get(absId);
    if (!diff) { i++; continue; }

    if (diff.status === 'unchanged') {
      // Collect consecutive unchanged
      const groupStart = entries.length;
      const unchangedAbsIds: number[] = [];
      const unchangedDiffs: StackDiff[] = [];
      while (i < displayIds.length) {
        const id = displayIds[i];
        const d = diffMap.get(id);
        if (!d || d.status !== 'unchanged') break;
        unchangedAbsIds.push(id);
        unchangedDiffs.push(d);
        i++;
      }
      entries.push({
        type: 'unchanged-group',
        count: unchangedAbsIds.length,
        absIds: unchangedAbsIds,
        diffs: unchangedDiffs,
      });
    } else {
      entries.push({ type: 'card', absId, diff });
      i++;
    }
  }

  const toggleGroup = (groupIndex: number) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupIndex)) {
        next.delete(groupIndex);
      } else {
        next.add(groupIndex);
      }
      return next;
    });
  };

  return (
    <div className="comparison-column">
      <div className="column-header" style={{ backgroundColor: accentColor }}>
        <h3>{title}</h3>
      </div>
      <div className="column-body">
        {entries.map((entry, idx) => {
          if (entry.type === 'unchanged-group') {
            const expanded = expandedGroups.has(idx);

            if (expanded) {
              return (
                <div key={`group-${idx}`}>
                  <div className="unchanged-toggle" onClick={() => toggleGroup(idx)}>
                    <span>收起 {entry.count} 个无变化的进展</span>
                  </div>
                  {entry.absIds.map(absId => {
                    const diff = entry.diffs.find(d => d.absStackId === absId)!;
                    const stackId = side === 'base' ? diff.baseStackId : diff.targetStackId;
                    if (stackId === null) return null;
                    return (
                      <ComparisonStackCard
                        key={absId}
                        stackId={stackId}
                        status={diff.status}
                        cardRef={el => registerCard(absId, el)}
                      />
                    );
                  })}
                </div>
              );
            }

            return (
              <div
                key={`group-${idx}`}
                className="unchanged-summary"
                onClick={() => toggleGroup(idx)}
              >
                <span>{entry.count} 个进展无变化</span>
                <span className="expand-hint">点击展开</span>
              </div>
            );
          }

          const { absId, diff } = entry;
          const stackId = side === 'base' ? diff.baseStackId : diff.targetStackId;

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

          .unchanged-summary {
            margin-bottom: 1.25rem;
            padding: 0.75rem 1rem;
            border: 1px dashed #d9d9d9;
            border-radius: 0.5rem;
            text-align: center;
            color: #999;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
          }

          .unchanged-summary:hover {
            border-color: #bbb;
            color: #666;
            background-color: #f5f5f5;
          }

          .expand-hint {
            font-size: 0.75rem;
            opacity: 0.6;
          }

          .unchanged-toggle {
            margin-bottom: 0.75rem;
            padding: 0.5rem 1rem;
            text-align: center;
            color: #999;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s;
          }

          .unchanged-toggle:hover {
            color: #666;
          }
        `}
      </style>
    </div>
  );
};
