import React from 'react';
import { useSelector } from 'react-redux';
import { Link as ScrollLink } from 'react-scroll';
import { Skeleton } from 'antd';

import { getStackList } from '@Selectors';

import { IStackSideMenu } from './SideMenu';

export const StackSideMenu: React.FunctionComponent<IStackSideMenu.IProps> = ({
  title,
  stackIdList,
  loading,
  className,
}) => {
  const stackList = useSelector(getStackList(stackIdList));

  const shimmers = [0, 1, 2, 3, 4].map(i => (
    <div className="item" key={`shimmer-${i}`}>
      <Skeleton title={false} paragraph={{ rows: 1, width: '95%' }} active />
    </div>
  ));

  return (
    <div className={`top ${className || ''}`}>
      {title ? <span className="title">{title}</span> : null}
      <div>
        <div>
          {stackList.map((stack, index) => (
            <ScrollLink
              activeClass="active"
              to={`stack-${stack.id}`}
              smooth
              offset={-120}
              duration={500}
              key={`stack-link-${stack.id}`}
              spy
            >
              <div className="item">
                <span className="item-title">{stack.title}</span>
                <span className="index">{stackList.length - index}</span>
              </div>
            </ScrollLink>
          ))}
          {loading ? shimmers : null}
        </div>
      </div>
      <style jsx>
        {`
          .top {
            position: fixed;
            right: calc(50% + 22.5rem);
            top: 8rem;
            max-height: calc(100vh - 15rem);
            overflow-y: scroll;
            width: 15rem;
            display: flex;
            flex-direction: column;
            opacity: 1;
            transition: opacity 0.2s;
          }

          .top::-webkit-scrollbar {
            display: none;
          }

          .top > div {
            padding-right: 1rem;
          }

          .top > div > div {
            display: flex;
            flex-direction: column;
            border-right: 1px solid #eee;
          }

          .item {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            border-right: 2px solid rgba(255, 255, 255, 0);
            transition: all 0.2s;
            height: 24px;
            font-size: 12px;
            color: rgb(64, 64, 64);
          }

          .title {
            padding: 10px 10px 10px 0;
            line-height: 1.2;
            color: #1e8bc3;
            font-size: 18px;
            text-align: right;
            margin-right: 1rem;
            border-right: 1px solid #eee;
            background-color: #f6f8fa;
            position: sticky;
            top: 0;
          }

          .item-title {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: color 0.2s;
          }

          .index {
            padding: 0 10px;
          }

          .top :global(.active) .item,
          .item:hover {
            border-right-color: #1e8bc3;
          }

          .top :global(.active) .item-title,
          .item:hover .item-title {
            color: #1e8bc3;
          }

          @media (max-width: 1212px) {
            .top {
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};
