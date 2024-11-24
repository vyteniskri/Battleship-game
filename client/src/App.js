import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomeScreen from './homeScreen';
import GameScreen from './gameScreen';

const App = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<HomeScreen onStart={() => navigate("/game")} />} />
      <Route path="/game" element={<GameScreen />} />
    </Routes>
  );
};

export default App;


///TODO: Sutvarkyti UI home ir game ekranu. 


