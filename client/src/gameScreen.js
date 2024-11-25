import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './gameScreen.css';

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
                        setMessage("Miss");
                    } 
                    else if (response.data.result === 'hit') {
                        setMessage("Hit");
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
            .catch((error) => {
                if (!error.response) {
                    setMessage("Game is currently unavailable. Please try again later.");
                } else {
                    setMessage(error.response.data.error);
                }
            });
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
            .catch((error) => {
                if (!error.response) {
                    setMessage("Game is currently unavailable. Please try again later.");
                } else {
                    setMessage(error.response.data.error || "An error occurred. Please try again.");
                }
            });
    };
    
    return (
        <div className="game-container">
            {message === "Invalid game ID" ? (
                <div className='end-game-container'>
                    <div className='message'>Please reload the game</div>
                </div>
            ) : message === 'Game is currently unavailable. Please try again later.' ? (
                <div className='end-game-container'>
                    <div className='message'>{message}</div>
                </div>
            ) : gameEnd ? (
                <div className='end-game-container'>
                    <div className='message'>{gameEnd}</div>
                    <div className='end-game-buttons'>
                        <button className='button' onClick={handleRestart}>Restart Game</button>
                        <button className='button' onClick={() => navigate("/")}>To Home Screen</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="button-container">
                        <button  onClick={() => navigate("/")}>To Home Screen</button>
                        <button  onClick={handleRestart}>Restart Game</button>
                    </div>
                    <div className="game-board-container">
                        <div  className='rules-container'> 
                            <p>Game rules:</p> 
                            <p>You need to destroy all enemy ships to win.</p> 
                            <p>There are: </p>
                            <ul>
                                <li>3 ships of size: (◼️)</li>
                                <li>3 ships of size: (◼️◼️)</li>
                                <li>2 ships of size: (◼️◼️◼️)</li>
                                <li>1 ship of size: &nbsp;(◼️◼️◼️◼️)</li>
                                <li>1 ship of size: &nbsp;(◼️◼️◼️◼️◼️)</li>
                            </ul>

                            <p>Good luck!</p>
                        </div>
                        <div className="game-board">
                            {board.map((row, rIndex) =>
                                row.map((cell, cIndex) => (
                                    <div
                                        key={`${rIndex}-${cIndex}`}
                                        onClick={() => handleGuess(rIndex, cIndex)}
                                        className="board-cell"
                                        style={{
                                            backgroundColor: cell === 'X' ? 'green' : cell === 'O' ? 'red' : cell === 'B' ? 'black' : 'white',
                                        }}
                                    />
                                ))
                            )}
                        </div>
                        <div className="shots-container">
                            <div>Shots Remaining: <b style={{fontSize: '2vw'}}>{shots}</b></div>
                        </div>
                    </div>
                    <div className="message">{message}</div>
                </>
            )}
        </div>
    );
    
};

export default GameScreen;
