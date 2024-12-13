import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Optional for styling

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome</h1>
      <p>Select an option:</p>
      <div className="button-container">
        <Link to="/login">
          <button className="home-button">Login</button>
        </Link>
        <Link to="/register">
          <button className="home-button">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
