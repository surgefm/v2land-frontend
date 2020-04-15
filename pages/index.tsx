// #region Global Imports
import * as React from 'react';
import { NextPage } from 'next';
// #endregion Global Imports

// #region Local Imports
import { withTranslation } from '@Server/i18n';
import { Footer, EventCardList, Background } from '@Components';
// #endregion Local Imports

// #region Interface Imports
import { IHomePage } from '@Interfaces';
// #endregion Interface Imports

const Home: NextPage<IHomePage.IProps, IHomePage.InitialProps> = () => {
  return (
    <Background>
      <EventCardList />
      <Footer />
    </Background>
  );
};

Home.getInitialProps = async (): Promise<IHomePage.InitialProps> => {
  return { namespacesRequired: ['common'] };
};

const Extended = withTranslation('common')(Home);

export default Extended;
