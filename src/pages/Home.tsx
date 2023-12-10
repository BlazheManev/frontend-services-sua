import React from 'react';
import HomePageImage from '../images/HomePageWelcoming.jpeg'; // Update the path to your image
import '../styles/Home.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <main className="content">
        <section className="welcome-section">
          <div className="text">
            <h1>Welcome to Your Health App</h1>
            <p>Your one-stop destination for all health-related information.</p>
          </div>
          <div className="image">
            <img src={HomePageImage} alt="Welcome" />
          </div>
        </section>

        <section className="features">
          {/* Add your feature section here */}
          {/* ... */}
        </section>

        <section className="about">
          {/* Add your about section here */}
          {/* ... */}
        </section>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Your Health App. All rights reserved.</p>
      </footer>
    </div>
    
  );
};

export default HomePage;
