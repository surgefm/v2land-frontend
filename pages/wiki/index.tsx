import React from 'react';
import { NextPage } from 'next';
import { Head } from '@Components';

const Wiki: NextPage = () => {
  return (
    <div>
      <Head title="浪潮使用指南" showSlogan={false} />
      <iframe src="https://wiki-mirror.langchao.org/" title="浪潮使用指南" />
      <style jsx>
        {`
          div,
          iframe {
            width: 100%;
            height: 100%;
            border: none;
            outline: 0;
          }

          div {
            height: 100vh;
            padding-top: 3.5rem;
            display: grid;
          }

          @media (max-width: 600px) {
            div {
              padding-top: 3rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Wiki;
