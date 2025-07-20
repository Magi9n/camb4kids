import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Calculator from '../components/Calculator';
import Footer from '../components/Footer';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

const LandingPage = () => {
  return (
    <>
      <Header />
      <Banner />
      <Container maxWidth="md">
        <Box my={4}>
          <Calculator />
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default LandingPage; 
 