import { useEffect } from 'react';
import Hero from '../components/Hero.jsx';
import Welcome from '../components/Welcome.jsx';
import StoryFeature from '../components/StoryFeature.jsx';
import QuoteSection from '../components/QuoteSection.jsx';
import JourneyLinks from '../components/JourneyLinks.jsx';

export default function Home() {
  useEffect(() => {
    document.title = 'Austin Davis — Stories about remembering how to live.';
  }, []);

  return (
    <>
      <Hero />
      <Welcome />
      <StoryFeature />
      <QuoteSection />
      <JourneyLinks />
    </>
  );
}
