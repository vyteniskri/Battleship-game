import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [board, setBoard] = useState(Array(10).fill(null).map(() => Array(10).fill('')));
  const [shots, setShots] = useState(25);
  const [gameId, setGameId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:9000/startGame')
      .then((response) => {  if (response && response.data) {setGameId(response.data.gameId)}})
      .then((response) => {  if (response && response.data) {setShots(response.data.shotsRemaining)}});
  }, []);

  const handleGuess = (row, col) => {
    axios.post('http://localhost:9000/guessLocation', { gameId, row, col })
      .then((response) => {
        {if (response && response.data){
          const updatedBoard = [...board];
          updatedBoard[row][col] = response.data.result === 'miss' ? 'O' : 'X';
          setBoard(updatedBoard);
          setShots(response.data.shotsRemaining);
        }}
      })
      .catch((error) => alert(error.response.data.error));
  };

  return (
    <div>
      <h1>Battleship Game</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 30px)' }}>
        {board.map((row, rIndex) => 
          row.map((cell, cIndex) => (
            <div 
              key={`${rIndex}-${cIndex}`} 
              onClick={() => handleGuess(rIndex, cIndex)}
              style={{
                width: 30, height: 30, border: '1px solid black',
                backgroundColor: cell === 'X' ? 'green' : cell === 'O' ? 'red' : 'white'
              }}
            />
          ))
        )}
      </div>
      <h2>Shots Remaining: {shots}</h2>
    </div>
  );
};

export default App;

///TODO: Reikia sukurt atskira start game langa. Atvaizduot laukelius pataike, nuskandino ar nepataike, zaidimas laimetas ar pralaimetas. Jei nuskandino laiva,
/// nudazo visa nuskandinta laiva juodai.(Reikes kad serveris grazintu unikalius laivu id).
///Pritaikyt restart mygtuka.
