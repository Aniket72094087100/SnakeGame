// src/GameBoard.js
import React, { useState, useEffect, useCallback } from 'react';
import Snake from './Snake';
import Food from './Food';
import useSound from 'use-sound';
import eatSound from './../sounds/eat.mp3';
import gameOverSound from './../sounds/gameover.mp3';

const GRID_SIZE = 95;
const CELL_SIZE = 5;
const INITIAL_SPEED = 150;

const generateFood = (snakeCells) => {
    let food;
    do {
        food = [
            Math.floor(Math.random() * GRID_SIZE),
            Math.floor(Math.random() * GRID_SIZE),
        ];
        // eslint-disable-next-line no-loop-func
    } while (snakeCells.some(cell => cell[0] === food[0] && cell[1] === food[1]));
    return food;
};

const GameBoard = () => {
    const [snakeCells, setSnakeCells] = useState([
        [5, 5],
        [5, 6],
    ]);
    const [foodCell, setFoodCell] = useState(() => generateFood(snakeCells));
    const [direction, setDirection] = useState('RIGHT');
    const [speed, setSpeed] = useState(INITIAL_SPEED);
    const [playEatSound] = useSound(eatSound);
    const [playGameOverSound] = useSound(gameOverSound);
    const [score, setScore] = useState(0);

    const checkCollision = useCallback((head) => {
        const [x, y] = head;
        return (
            x >= GRID_SIZE ||
            x < 0 ||
            y >= GRID_SIZE ||
            y < 0 ||
            snakeCells.slice(1).some(cell => cell[0] === x && cell[1] === y) // check if head hits body
        );
    }, [snakeCells]);

    const restartGame = () => {
        setSnakeCells([
            [5, 5],
            [5, 6],
        ]);
        setFoodCell(generateFood(snakeCells));
        setDirection('RIGHT');
        setSpeed(INITIAL_SPEED);
        setScore(0);
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
            switch (event.keyCode) {
                case 37:
                    if (direction !== 'RIGHT') setDirection('LEFT');
                    break;
                case 38:
                    if (direction !== 'DOWN') setDirection('UP');
                    break;
                case 39:
                    if (direction !== 'LEFT') setDirection('RIGHT');
                    break;
                case 40:
                    if (direction !== 'UP') setDirection('DOWN');
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [direction]);

    useEffect(() => {
        const interval = setInterval(() => {
            const [[headX, headY]] = snakeCells;
            let newHead;

            switch (direction) {
                case 'UP':
                    newHead = [headX, headY - 1 < 0 ? GRID_SIZE - 1 : headY - 1];
                    break;
                case 'DOWN':
                    newHead = [headX, (headY + 1) % GRID_SIZE];
                    break;
                case 'LEFT':
                    newHead = [headX - 1 < 0 ? GRID_SIZE - 1 : headX - 1, headY];
                    break;
                case 'RIGHT':
                    newHead = [(headX + 1) % GRID_SIZE, headY];
                    break;
                default:
                    newHead = [(headX + 1) % GRID_SIZE, headY];
            }

            if (checkCollision(newHead)) {
                clearInterval(interval);
                playGameOverSound();
                alert('Game Over! Your score: ' + score);
                restartGame();
                return;
            }

            const newSnakeCells = [...snakeCells];
            newSnakeCells.unshift(newHead);

            if (newHead[0] === foodCell[0] && newHead[1] === foodCell[1]) {
                playEatSound();
                setFoodCell(generateFood(snakeCells));
                setScore(score + 1);
            } else {
                newSnakeCells.pop();
            }

            setSnakeCells(newSnakeCells);
        }, speed);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snakeCells, direction, speed, foodCell, checkCollision, playEatSound, playGameOverSound, score]);

    return (
        <div className="game-board" style={{ width: `${GRID_SIZE * CELL_SIZE}px`, height: `${GRID_SIZE * CELL_SIZE}px` }}>
            <Snake snakeCells={snakeCells} />
            <Food foodCell={foodCell} />
            <div>Score: {score}</div>
        </div>
    );
};

export default GameBoard;
