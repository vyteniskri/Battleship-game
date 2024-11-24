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
                if (response?.data) {
                    const updatedBoard = [...board];
                    updatedBoard[row][col] = response.data.result === 'miss' ? 'O' : 'X';

                    if (response.data.result === 'miss') {
                        setMessage("You missed");
                    } 
                    else if (response.data.result === 'hit') {
                        setMessage("You hit a ship");
                    } 
                    else if (response.data.result === 'sunk') {
                        setMessage("You sunk a ship");
                        handleShipSunkR(row, col);
                    }

                    if (response.data.message){
                        setGameEnd(response.data.message);
                    }

                    setBoard(updatedBoard);
                    setShots(response.data.shotsRemaining);
                }
                
            })
            .catch((error) => setMessage(error.response.data.error));
    };

    const handleShipSunkR = (row, col) => {

        if (row >= 0 && row < 10 && col >= 0 && col < 10 && board[row][col] === 'X'){
            board[row][col] = 'B';
            handleShipSunkR(row + 1, col);
            handleShipSunkR(row - 1, col);
            handleShipSunkR(row, col + 1);
            handleShipSunkR(row, col - 1);
        }
        else {
            return;
        }

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
            {message === "Invalid game ID" ? (
                <div style={{ textAlign: 'center' }}>
                    <h1>{message}</h1>
                </div>
            ) : gameEnd ? (
                    <div style={{ textAlign: 'center' }}>
                    <h1>{gameEnd}</h1>
                    <button onClick={handleRestart}>Restart Game</button>
                    <button onClick={() => navigate("/")}>To Home Screen</button>
                </div>
            ) : ( 
                <>
                    <button onClick={() => navigate("/")}>To Home Screen</button>
                    <button onClick={handleRestart}>Restart Game</button>
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
                                        backgroundColor: cell === 'X' ? 'green' : cell === 'O' ? 'red' : cell === 'B' ? 'black' : 'white',
                                    }}
                                />
                            ))
                        )}
                    </div>
                    <h2>Shots Remaining: {shots}</h2>
                    <h2>{message}</h2>
                </>
            )};

        </div>
    );
};

export default GameScreen;
