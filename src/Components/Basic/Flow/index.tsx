import React, { useState, useEffect } from 'react';
import { IFlow } from './Flow';

export const Flow: React.FC<IFlow.IProps> = ({ Component, elementProps, numLine = 2 }) => {
  const getNumLine = () => {
    let nl = numLine;
    while (nl >= 1) {
      if (elementProps.length / nl < 1) {
        nl -= 1;
      } else {
        break;
      }
    }
    return nl;
  };
  const [numLines, setNumLines] = useState(getNumLine());

  const getRows = (nl: number) => {
    const rs: any[][] = [];
    for (let i = 0; i < nl; i += 1) {
      rs.push([]);
    }

    for (let i = 0; i < elementProps.length; i += 1) {
      rs[i % nl].push(elementProps[i]);
    }

    return rs;
  };
  const [rows, setRows] = useState<any[][]>(getRows(numLines));

  const updateRows = () => {
    const nl = getNumLine();
    setNumLines(nl);
    setRows(getRows(nl));
  };

  useEffect(() => {
    updateRows();
  }, [numLine, elementProps]);

  return (
    <div className="container">
      <div className="sub-container">
        {rows.map(row => (
          <div className="row" key={JSON.stringify(row)}>
            {row.map(props => (
              <React.Fragment key={JSON.stringify(props)}>
                <Component {...props} />
                <div />
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
      <div className="left" />
      <div className="right" />
      <style jsx>
        {`
          .container {
            width: 100%;
            position: relative;
            display: grid;
            margin-bottom: .3rem;
          }

          .sub-container {
            width: calc(100% + 2rem);
            margin-left: -1rem;
            overflow-x: auto;
            overflow-y: visible;
            height: max-content;
            padding-bottom: 0.7rem;
          }

          .row {
            display: inline-flex;
            margin-bottom: 0.5rem;
          }

          .row > :global(*) {
            margin-right: 0.5rem;
          }

          .gutter {
            width: 0.5rem;
            visibility: hidden;
          }

          .row > :global(*:first-child) {
            margin-left: 1rem;
          }

          .left,
          .right {
            position: absolute;
            height: 100%;
            width: 1rem;
            top: 0;
            background: #f6f8fa;
          }

          .left {
            left: -1rem;
            background: linear-gradient(90deg, #f6f8fa, transparent);
          }

          .right {
            left: 100%;
            background: linear-gradient(270deg, #f6f8fa, transparent);
          }
        `}
      </style>
    </div>
  );
};
