import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navigation from './components/Navigation.jsx';
import Newsletter from './components/Newsletter.jsx';
import Footer from './components/Footer.jsx';
import PageTransition from './components/PageTransition.jsx';

import Home from './pages/Home.jsx';
import SectionPage from './pages/SectionPage.jsx';
import Story from './pages/Story.jsx';
import NotFound from './pages/NotFound.jsx';

import { markEntered } from './lib/entrance.js';
import { initMomentumScroll } from './lib/momentum.js';
import { initTextProtection } from './lib/protect.js';
import { PAGES } from './content/site.js';

export default function App() {
  const location = useLocation();

  /* Interior pages have no hero to wait for — let them in straight away. */
  useEffect(() => {
    if (location.pathname !== '/') markEntered();
  }, [location.pathname]);

  useEffect(() => initMomentumScroll(), []);
  useEffect(() => initTextProtection(), []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navigation />

      <main id="main">
        <PageTransition>
          {(shown) => (
            <Routes location={shown}>
              <Route path="/" element={<Home />} />
              <Route path="/stories" element={<SectionPage {...PAGES.stories} showFirstStory />} />
              <Route path="/poems" element={<SectionPage {...PAGES.poems} />} />
              <Route path="/journal" element={<SectionPage {...PAGES.journal} />} />
              <Route path="/about" element={<SectionPage {...PAGES.about} />} />
              <Route path="/letters" element={<SectionPage {...PAGES.letters} />} />
              <Route path="/stories/:slug" element={<Story />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </PageTransition>
      </main>

      <Newsletter />
      <Footer />
    </>
  );
}
