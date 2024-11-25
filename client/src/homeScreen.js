import React from 'react';
import './homeScreen.css';

const HomeScreen = ({onStart}) => {
    return (
        <div className="home-container">
          <div className='home-background'>
            <h1 className="home-title">Welcome to Battleships</h1>
            <button className="home-button" onClick={onStart}>Start Game</button>
          </div>
        </div>
    );
};

export default HomeScreen;