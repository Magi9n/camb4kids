import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroStats from '../components/HeroStats';
import BanksSection from '../components/BanksSection';
import BenefitsSection from '../components/BenefitsSection';
import SubscribeBox from '../components/SubscribeBox';
import HowItWorks from '../components/HowItWorks';
import BannerCupon from '../components/BannerCupon';
import HeroSection from '../components/HeroSection';
import AlertBlock from '../components/AlertBlock';

const LandingPage = () => {
  return (
    <>
      <Header />
      <BannerCupon />
      <HeroSection />
      <HeroStats />
      <BanksSection />
      <BenefitsSection />
      <AlertBlock />
      <HowItWorks />
      <SubscribeBox />
      <Footer />
    </>
  );
};

export default LandingPage; 
 