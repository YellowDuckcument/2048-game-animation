import React, { useState } from 'react'
import Tile from './title'
import Cell from './Cell'
import { Board } from './helper'
import useEvent from '../hooks/useEvent';
import GameOverlay from './GameOverlay';

const BoardView = () => {
  const [board, setBoard] = useState(new Board())

  const handleKeyDown = (event) => {
    if (board.hasWon()) {
      return;
    }

    if (event.keyCode >= 37 & event.keyCode <= 40) {
      let direction = event.keyCode - 37;
      let boardClone = Object.assign(
        Object.create(Object.getPrototypeOf(board)),
        board
      );
      let newBoard = boardClone.move(direction);
      setBoard(newBoard)
    }
  }

  useEvent('keydown', handleKeyDown)
  
    // XỬ lý khi vuốt màn hình
  const [touchPositionX, setTouchPositionX] = useState(null)
  const [touchPositionY, setTouchPositionY] = useState(null)

  const handleTouchStart = (e) => {
    const touchDownX = e.touches[0].clientX
    setTouchPositionX(touchDownX)

    const touchDownY = e.touches[0].clientY
    setTouchPositionY(touchDownY)
  }


  // Hàm xử lý
  const handleTouchMove = (e) => {
    let boardClone = Object.assign(
      Object.create(Object.getPrototypeOf(board)),
      board
    );
    let direction;

    const touchDownX = touchPositionX
    const touchDownY = touchPositionY

    if (touchDownX === null && touchDownY === null) {
      return
    }

    const currentTouchX = e.touches[0].clientX
    const diffX = - touchDownX + currentTouchX

    const currentTouchY = e.touches[0].clientY
    const diffY = touchDownY - currentTouchY

    if (diffX > 10) {
      direction = 2;
    }

    if (diffX < -10) {
      direction = 0;
    }

    if (diffY > 10) {
      direction = 1;
    }

    if (diffY < -10) {
      direction = 3;
    }

    let newBoard = boardClone.move(direction);
      setBoard(newBoard)

    setTouchPositionX(null)
    setTouchPositionY(null)
  }

  
// In ra boardGame
  const cells = board.cells.map((row, rowindex) => {
    return (
      <div key={rowindex}>
        {row.map((col, colIndex) => {
          return <Cell key={rowindex * board.size + colIndex} />
        })}
      </div>
    )
  });

  const tiles = board.tiles
    .filter(tile => tile.value !== 0)
    .map((tile, index) => {
      return <Tile tile={tile} key={index} />
    })

  const resetGame = () => {
    setBoard(new Board())
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className='details-box'>
        <div className='resetButton' onClick={resetGame}>New Game</div>
        <div>
          <div className='score-header'>SCORE</div>
          <div className='score-box'>{board.score}</div>
        </div>
      </div>
      <div className='board'>
        {cells}
        {tiles}
        <GameOverlay 
          onRestart={resetGame}
          board={board}
        />
      </div>
    </div>
  )
};

export default BoardView;
