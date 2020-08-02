// #region Global Imports
import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { message } from 'antd';
// #endregion Global Imports

// #region Local Imports
import { withTranslation } from '@Server/i18n';
import { EventActions } from '@Actions';
import {
  Head,
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
import { IHomePage, ReduxNextPageContext } from '@Interfaces';
// #endregion Interface Imports

const Home: NextPage<IHomePage.IProps, IHomePage.InitialProps> = ({ t }) => {
  const router = useRouter();
  useEffect(() => {
    if (router.query.event_not_found) {
      message.error(t('Home_EventNotFound'));
      UtilService.replace('/', { shallow: true });
    }
  }, [router.query.event_not_found]);

  useEffect(() => {
    if (router.query.client_not_found) {
      message.error(t('Home_ClientNotFound'));
      UtilService.replace('/', { shallow: true });
    }
  }, [router.query.client_not_found]);

  return (
    <Background>
      <Head />
      <div className="grid">
        <EventCardList className="left" />
        <div className="right">
          <div>
            <SectionHeader>{t('Home_Topics_TrendingTopics')}</SectionHeader>
            <>
              <TagCard tag="新冠肺炎" />
              <TagCard tag="医患纠纷" />
              <TagCard tag="百度" />
              <TagCard tag="娱乐圈" />
              <TagCard tag="劳资纠纷" />
              <TagCard tag="非洲猪瘟" />
            </>
            <SectionHeader>{t('Home_Contributions_ContributionRanking')}</SectionHeader>
            <>
              <ContributorCard contributor="Vincent" />
              <ContributorCard contributor="CCAV" />
              <ContributorCard contributor="Alan" />
              <ContributorCard contributor="Erick" />
            </>
          </div>
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
            display: block;
            grid-column: 3;
          }

          .right > div {
            position: sticky;
            top: 5rem;
          }
        `}
      </style>
    </Background>
  );
};

Home.getInitialProps = async (ctx: ReduxNextPageContext): Promise<IHomePage.InitialProps> => {
  await ctx.store.dispatch(EventActions.GetEventList());
  return { namespacesRequired: ['common'] };
};

const Extended = withTranslation('common')(Home);

export default Extended;
