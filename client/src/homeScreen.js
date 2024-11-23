import React from 'react';

const HomeScreen = ({onStart}) => {
    return (
        <div>
          <h1>Welcome to Battleship</h1>
          <button onClick={onStart}>Start Game</button>
        </div>
    );
};

export default HomeScreen;