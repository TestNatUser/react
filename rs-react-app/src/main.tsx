import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import './i18n/config'; // Initialize i18n
import App from './App';
import About from './components/pages/About';
import NotFound from './components/pages/NotFound';
import { store } from './store/store';
import { ThemeProvider } from './contexts/ThemeContext';
import { InternationalizationProvider } from './contexts/InternationalizationContext';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <InternationalizationProvider>
        <Provider store={store}>
          <ThemeProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/about" element={<About />} />
                <Route path="/:page" element={<App />} />
                <Route path="/:page/:detailsId" element={<App />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </Provider>
      </InternationalizationProvider>
    </StrictMode>
  );
}
