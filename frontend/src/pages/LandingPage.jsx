import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Calculator from '../components/Calculator';
import Footer from '../components/Footer';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import HeroStats from '../components/HeroStats';
import BanksSection from '../components/BanksSection';
import BenefitsSection from '../components/BenefitsSection';
import SubscribeBox from '../components/SubscribeBox';
import HowItWorks from '../components/HowItWorks';
import SimulatorSection from '../components/SimulatorSection';
import CouponsSection from '../components/CouponsSection';
import BannerCupon from '../components/BannerCupon';
import HeroSection from '../components/HeroSection';

const LandingPage = () => {
  return (
    <>
      <Header />
      <BannerCupon />
      <HeroSection />
      <HeroStats />
      <BanksSection />
      <BenefitsSection />
      <SubscribeBox />
      <HowItWorks />
      <SimulatorSection />
      <CouponsSection />
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
 