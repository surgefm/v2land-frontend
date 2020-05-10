import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

import { Card, LoginForm, Background, Footer } from '@Components';

const Login: NextPage = () => (
  <Background>
    <Card>
      <LoginForm />
    </Card>
    <Footer />
  </Background>
);

export default Login;
