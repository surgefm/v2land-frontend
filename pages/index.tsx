// #region Global Imports
import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { message } from 'antd';
// #endregion Global Imports

// #region Local Imports
import { withTranslation } from '@Server/i18n';
import {
  Footer,
  EventCardList,
  TagCard,
  ContributorCard,
  Background,
  SectionHeader,
} from '@Components';
import { UtilService } from '@Services';
// #endregion Local Imports

// #region Interface Imports
import { IHomePage } from '@Interfaces';
// #endregion Interface Imports

const Home: NextPage<IHomePage.IProps, IHomePage.InitialProps> = () => {
  const router = useRouter();
  useEffect(() => {
    if (router.query.event_not_found) {
      message.error('未找到该事件');
      UtilService.replace('/', { shallow: true });
    }
  }, [router.query.event_not_found]);

  useEffect(() => {
    if (router.query.client_not_found) {
      message.error('未找到该用户');
      UtilService.replace('/', { shallow: true });
    }
  }, [router.query.client_not_found]);

  return (
    <Background>
      <div className="grid">
        <EventCardList className="left" />
        <div className="right">
          <SectionHeader>热点话题</SectionHeader>
          <>
            <TagCard tag="新冠肺炎" />
            <TagCard tag="医患纠纷" />
            <TagCard tag="百度" />
            <TagCard tag="娱乐圈" />
            <TagCard tag="劳资纠纷" />
            <TagCard tag="非洲猪瘟" />
          </>
          <SectionHeader>贡献榜</SectionHeader>
          <>
            <ContributorCard contributor="Vincent" />
            <ContributorCard contributor="CCAV" />
            <ContributorCard contributor="陈博士" />
            <ContributorCard contributor="Erick" />
          </>
        </div>
      </div>
      <Footer />
      <style jsx>
        {`
          .grid {
            display: grid;
            width: 100%;
            max-width: 58rem;
            grid-auto-columns: 40rem 2rem 16rem;
          }

          .left > :global(*) {
            grid-column: 1;
          }

          .right {
            grid-column: 3;
          }
        `}
      </style>
    </Background>
  );
};

Home.getInitialProps = async (): Promise<IHomePage.InitialProps> => {
  return { namespacesRequired: ['common'] };
};

const Extended = withTranslation('common')(Home);

export default Extended;
