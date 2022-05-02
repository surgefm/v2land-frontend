import React from 'react';
import { NextPage } from 'next';

const RegistrationPage: NextPage = () => {
  return <></>;
};

RegistrationPage.getInitialProps = async (): Promise<any> => {
  return {
    redirect: '/signup',
  };
};

export default RegistrationPage;
