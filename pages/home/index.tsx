// #region Global Imports
import * as React from 'react';
import { NextPage } from 'next';
// #endregion Global Imports

// #region Local Imports
import { withTranslation } from '@Server/i18n';
import { Footer } from '@Components';
import { Center } from '@Styled/App';
// #endregion Local Imports

// #region Interface Imports
import { IHomePage } from '@Interfaces';
// #endregion Interface Imports

const Home: NextPage<IHomePage.IProps, IHomePage.InitialProps> = () => {
  return (
    <Center>
      <Footer />
    </Center>
  );
};

Home.getInitialProps = async (): Promise<IHomePage.InitialProps> => {
  return { namespacesRequired: ['common'] };
};

const Extended = withTranslation('common')(Home);

export default Extended;
