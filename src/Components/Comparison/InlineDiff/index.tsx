import React from 'react';

interface DiffSegment {
  type: 'added' | 'removed' | 'equal';
  text: string;
}

function diffWords(oldText: string, newText: string): DiffSegment[] {
  const oldWords = oldText.split(/(\s+)/);
  const newWords = newText.split(/(\s+)/);

  const m = oldWords.length;
  const n = newWords.length;

  // LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldWords[i - 1] === newWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find diff
  const segments: DiffSegment[] = [];
  let i = m;
  let j = n;
  const raw: DiffSegment[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
      raw.push({ type: 'equal', text: oldWords[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      raw.push({ type: 'added', text: newWords[j - 1] });
      j--;
    } else {
      raw.push({ type: 'removed', text: oldWords[i - 1] });
      i--;
    }
  }

  raw.reverse();

  // Merge consecutive segments of the same type
  for (const seg of raw) {
    if (segments.length > 0 && segments[segments.length - 1].type === seg.type) {
      segments[segments.length - 1].text += seg.text;
    } else {
      segments.push({ ...seg });
    }
  }

  return segments;
}

interface IProps {
  oldText: string;
  newText: string;
}

export const InlineDiff: React.FC<IProps> = ({ oldText, newText }) => {
  if (!oldText && !newText) return null;

  const segments = diffWords(oldText || '', newText || '');

  return (
    <span className="inline-diff">
      {segments.map((seg, i) => {
        if (seg.type === 'removed') {
          return (
            <span key={i} className="diff-removed">
              {seg.text}
            </span>
          );
        }
        if (seg.type === 'added') {
          return (
            <span key={i} className="diff-added">
              {seg.text}
            </span>
          );
        }
        return <span key={i}>{seg.text}</span>;
      })}
      <style jsx>
        {`
          .diff-removed {
            background-color: #ffeef0;
            color: #b31d28;
            text-decoration: line-through;
            border-radius: 2px;
            padding: 0 1px;
          }

          .diff-added {
            background-color: #e6ffec;
            color: #22863a;
            border-radius: 2px;
            padding: 0 1px;
          }
        `}
      </style>
    </span>
  );
};
