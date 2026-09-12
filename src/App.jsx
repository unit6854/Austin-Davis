import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navigation from './components/Navigation.jsx';
import Newsletter from './components/Newsletter.jsx';
import Footer from './components/Footer.jsx';
import CopyNote from './components/CopyNote.jsx';
import PageTransition from './components/PageTransition.jsx';

import Home from './pages/Home.jsx';
import SectionPage from './pages/SectionPage.jsx';
import Story from './pages/Story.jsx';
import Poems from './pages/Poems.jsx';
import Poem from './pages/Poem.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

import { markEntered } from './lib/entrance.js';
import { initMomentumScroll } from './lib/momentum.js';
import { initQuoting } from './lib/quote.js';
import { PAGES } from './content/site.js';

export default function App() {
  const location = useLocation();

  /* Interior pages have no hero to wait for — let them in straight away. */
  useEffect(() => {
    if (location.pathname !== '/') markEntered();
  }, [location.pathname]);

  useEffect(() => initMomentumScroll(), []);
  useEffect(() => initQuoting(), []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navigation />

      <main id="main">
        <PageTransition>
          {(shown) => (
            <>
              <Routes location={shown}>
                <Route path="/" element={<Home />} />
                <Route path="/stories" element={<SectionPage {...PAGES.stories} showStories />} />
                <Route path="/poems" element={<Poems />} />
                <Route path="/poems/:slug" element={<Poem />} />
                <Route path="/about" element={<About />} />
                <Route path="/stories/:slug" element={<Story />} />
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Join the Journey turns with the page it ends. The field gate
                  belongs to the homepage; every other page is already
                  standing on a photograph of its own — except About, which
                  stands on the drawn wall and lays the band on it itself. */}
              {shown.pathname !== '/about' ? (
                <Newsletter scene={shown.pathname === '/' ? 'journey' : undefined} />
              ) : null}
            </>
          )}
        </PageTransition>
      </main>

      <Footer />

      <CopyNote />
    </>
  );
}
