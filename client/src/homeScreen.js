import React from 'react';
import './homeScreen.css';

const HomeScreen = ({onStart}) => {
    return (
        <div className="home-container">
          <h1 className="home-title">Welcome to Battleships</h1>
           <button className="home-button" onClick={onStart}>Start Game</button>
        </div>
    );
};

export default HomeScreen;