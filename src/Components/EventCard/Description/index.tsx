import React, { useState, useEffect, createRef } from 'react';

import commonStyles from '@Static/css/common.module.scss';
import { IEventCardDescription } from './Description';

export const EventCardDescription: React.FunctionComponent<IEventCardDescription.IProps> = ({
  children,
  styles,
  className,
}) => {
  let cloneElement: HTMLElement;
  let cloneChild: HTMLElement;
  let grandparent: HTMLElement;
  const ref = createRef<HTMLParagraphElement>();
  const [text, setText] = useState(children);

  const resize = () => {
    const rem = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    let child: HTMLElement | null = cloneChild || null;
    if (!cloneChild) {
      if (!ref.current || !ref.current.parentElement || !ref.current.parentElement.parentElement)
        return;
      grandparent = ref.current.parentElement.parentElement;

      const phantomNode = document.createElement('div');
      phantomNode.setAttribute('style', 'position: fixed; left: 10000vw; visibility: hidden');
      const body = document.getElementsByTagName('body')[0];

      const clone = grandparent.cloneNode(true);
      const element = clone as HTMLElement;
      element.setAttribute(
        'style',
        `${element.getAttribute('style')}; width: ${grandparent.offsetWidth}px; transition: all 0;`
      );
      body.appendChild(phantomNode);
      phantomNode.appendChild(clone);

      if (!clone.firstChild) return;
      (clone.firstChild as HTMLElement).setAttribute('style', 'transition: all 0;');

      for (let i = 0; i < clone.firstChild.childNodes.length; i += 1) {
        if ((clone.firstChild.childNodes[i] as any).className === ref.current.className) {
          child = clone.firstChild.childNodes[i] as HTMLElement;
        }
      }

      cloneChild = child;
      cloneElement = element;
    } else {
      cloneElement.style.width = `${grandparent.offsetWidth}px`;
    }

    if (!child) return;
    const height = window.innerHeight >= 600 ? 7.8 * rem : 9 * rem;
    (child.firstChild as any).textContent = children;
    if (child.offsetHeight <= height) {
      setText(children);
      return;
    }
    let shortText = children;
    while (child.offsetHeight > height) {
      shortText = shortText.slice(0, shortText.length - 1);
      (child.firstChild as any).textContent = `${shortText} ...`;
    }
    setText(`${shortText} ...`);
  };

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (cloneElement.parentElement && cloneElement.parentElement.parentElement) {
        cloneElement.parentElement.parentElement.removeChild(cloneElement.parentElement);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`description ${commonStyles['light-font']} ${className || ''}`}
      style={styles}
    >
      <span>{text}</span>
      <style jsx>
        {`
          .description {
            color: #333;
            padding: 0;
            position: relative;
            margin-top: 0.5rem;
            max-height: 7.8rem;
            margin-bottom: 0 !important;
          }

          span {
            line-height: 1.8 !important;
            display: block;
          }

          @media (max-width: 600px) {
            .description {
              max-height: 9rem;
            }
          }
        `}
      </style>
    </div>
  );
};
