'use client';

import React from 'react';
import { Link } from '../../lib/navigation';
import Image from 'next/image';
import ThemeToggle from '../common/ThemeToggle';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <header className="about-header">
          <div className="header-left">
            <Link href="/" className="back-link">
              ← Back to Search
            </Link>
          </div>
          <div className="header-right">
            <ThemeToggle />
          </div>
        </header>

        <main className="about-content">
          <section className="about-hero">
            <h1>About Star Trek Seasons Explorer</h1>
            <p className="hero-subtitle">
              A modern React application for exploring Star Trek television
              seasons
            </p>
          </section>

          <section className="about-section">
            <h2>🚀 About This Application</h2>
            <p>
              This application provides an intuitive interface for searching and
              exploring Star Trek television seasons. Built with modern web
              technologies, it features pagination, detailed views, theme
              switching, and responsive design.
            </p>

            <div className="features-grid">
              <div className="feature-card">
                <h3>🔍 Smart Search</h3>
                <p>
                  Search through Star Trek seasons with real-time results and
                  pagination
                </p>
              </div>
              <div className="feature-card">
                <h3>📱 Responsive Design</h3>
                <p>Optimized for desktop, tablet, and mobile devices</p>
              </div>
              <div className="feature-card">
                <h3>🌙 Theme Support</h3>
                <p>Light and dark themes with automatic preference saving</p>
              </div>
              <div className="feature-card">
                <h3>📋 Detailed Views</h3>
                <p>
                  Rich information about seasons, episodes, and production
                  details
                </p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>👨‍💻 About the Author</h2>
            <div className="author-info">
              <div className="author-details">
                <h3>Software Developer</h3>
                <p>
                  This application was developed as part of the RS School React
                  course, demonstrating modern React development practices
                  including:
                </p>
                <ul>
                  <li>React 18 with TypeScript</li>
                  <li>Redux Toolkit for state management</li>
                  <li>React Router for navigation</li>
                  <li>Responsive CSS with CSS Variables</li>
                  <li>Comprehensive testing with Jest</li>
                  <li>Modern development tooling with Vite</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>🎓 RS School React Course</h2>
            <div className="course-info">
              <p>
                This project was created as part of the{' '}
                <a
                  href="https://rs.school/react/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="course-link"
                >
                  RS School React Course
                </a>
                , a comprehensive program covering modern React development.
              </p>

              <div className="course-details">
                <h3>Course Highlights:</h3>
                <ul>
                  <li>
                    Modern React development with hooks and functional
                    components
                  </li>
                  <li>State management with Redux and Context API</li>
                  <li>TypeScript integration for type-safe development</li>
                  <li>Testing strategies and best practices</li>
                  <li>Performance optimization techniques</li>
                  <li>Real-world project development</li>
                </ul>
              </div>

              <div className="rs-school-logo">
                <a
                  href="https://rs.school/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="logo-link"
                >
                  <Image
                    src="https://rs.school/images/rs_school_js.svg"
                    alt="RS School Logo"
                    className="logo-image"
                    width={120}
                    height={60}
                  />
                </a>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>🛠️ Technologies Used</h2>
            <div className="tech-stack">
              <div className="tech-category">
                <h3>Frontend</h3>
                <div className="tech-tags">
                  <span className="tech-tag">React 18</span>
                  <span className="tech-tag">TypeScript</span>
                  <span className="tech-tag">Vite</span>
                  <span className="tech-tag">CSS3</span>
                </div>
              </div>
              <div className="tech-category">
                <h3>State Management</h3>
                <div className="tech-tags">
                  <span className="tech-tag">Redux Toolkit</span>
                  <span className="tech-tag">React-Redux</span>
                  <span className="tech-tag">Context API</span>
                </div>
              </div>
              <div className="tech-category">
                <h3>Routing & Testing</h3>
                <div className="tech-tags">
                  <span className="tech-tag">React Router</span>
                  <span className="tech-tag">Jest</span>
                  <span className="tech-tag">React Testing Library</span>
                </div>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>📊 Data Source</h2>
            <p>
              Season data is provided by the{' '}
              <a
                href="https://stapi.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="api-link"
              >
                Star Trek API (STAPI)
              </a>
              , a comprehensive database of Star Trek universe information.
            </p>
          </section>
        </main>

        <footer className="about-footer">
          <p>Built with ❤️ using React and modern web technologies</p>
          <p className="footer-note">
            Star Trek is a trademark of CBS Studios Inc.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default About;
