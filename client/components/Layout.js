import React from 'react';
import Header from './Header';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';

export default (props) => {
  return (
      <Container className='container'>
        <Head>
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"></link>
        </Head>
        <h1 style = {{
            marginTop: '20px',
            marginWidth: '50px'
        }}>
          Decentralized Charity Platform
        </h1>
        <Header />
        {props.children}
      </Container>
  );
};
