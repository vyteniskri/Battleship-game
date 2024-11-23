import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GameScreen = () => {
    const [board, setBoard] = useState(Array(10).fill(null).map(() => Array(10).fill('')));
    const [shots, setShots] = useState(25);
    const [gameId, setGameId] = useState(null);
    const [message, setMessage] = useState(null);
    const [gameEnd, setGameEnd] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:9000/startGame')
            .then((response) => {
                if (response && response.data) {
                    setGameId(response.data.gameId);
                    setShots(response.data.shotsRemaining);
                }
            })
            .catch((error) => {
                console.error("Error fetching game data:", error);
            });
    }, []);


    const handleGuess = (row, col) => {
        axios.post('http://localhost:9000/guessLocation', { gameId, row, col })
            .then((response) => {
                const updatedBoard = [...board];
                updatedBoard[row][col] = response.data.result === 'miss' ? 'O' : 'X';
                setMessage(response.data.result === 'miss' ? "You missed" : response.data.result === 'hit' ? "You hit a ship" : "You sunk a ship" );
                if (response.data.message){
                    setGameEnd(response.data.message);
                }
                setBoard(updatedBoard);
                setShots(response.data.shotsRemaining);
            })
            .catch((error) => setMessage(error.response.data.error));
    };

    const handleRestart = () => {
        axios.post('http://localhost:9000/restartGame', {gameId})
            .then((response) => {
                setShots(response.data.shotsRemaining);
                setBoard(Array(10).fill(null).map(() => Array(10).fill('')));
                setGameEnd(null);
                setMessage(null);
            })
            .catch((error) => alert(error.response.data.error));
    };
    
    return (
        <div>
            <button onClick={() => navigate("/")}>To Home screen</button>
            <button onClick={handleRestart}>Restart game</button>
        <h1>Battleship Game</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 30px)' }}>
            {board.map((row, rIndex) =>
            row.map((cell, cIndex) => (
                <div
                    key={`${rIndex}-${cIndex}`}
                    onClick={() => handleGuess(rIndex, cIndex)}
                    style={{
                        width: 30,
                        height: 30,
                        border: '1px solid black',
                        backgroundColor: cell === 'X' ? 'green' : cell === 'O' ? 'red' : 'white',
                    }}
                />
            ))
        )}
        </div>
            <h2>Shots Remaining: {shots}</h2>
            <h2>{message}</h2>
            <h2>{gameEnd}</h2>
        </div>
        
    );
};

export default GameScreen;
