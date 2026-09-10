import { useEffect } from 'react';
import Hero from '../components/Hero.jsx';
import Ground from '../components/Ground.jsx';
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

      {/* everything between the road and the field gate stands on one
          continuous drawn wall — see components/Ground */}
      <Ground>
        <Welcome />
        <StoryFeature />
        <QuoteSection />
        <JourneyLinks />
      </Ground>
    </>
  );
}
