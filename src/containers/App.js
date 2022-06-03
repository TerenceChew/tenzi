import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import './App.css';
import Board from '../components/Board/Board';
import Die from '../components/Die/Die';

export default function App() {
  const [ dice, setDice ] = useState(() => createAllNewDice());
  const [ won, setWon ] = useState(false);

  function generateId() {
    return Math.ceil(Math.random() * 999999999);
  }

  function generateDieNum() {
    return Math.ceil(Math.random() * 6);
  }

  function createAllNewDice() {
    let newDiceArr = new Array(10).fill("");

    return newDiceArr.map(() => {
      return {
        id: generateId(),
        number: generateDieNum(),
        isHeld: false
      };
    });
  }

  function handleDieClick(id) {
    setDice(prevDice => {
      return prevDice.map(die => {
        return (id === die.id)
          ? {
              ...die,
              isHeld: !die.isHeld
            }
          : die
      })
    })
  }

  function createNewDie() {
    return {
      id: generateId(),
      number: generateDieNum(),
      isHeld: false
    };
  }

  function handleButtonClick() {
    if (won) {
      setWon(false);
      setDice(createAllNewDice());
    } else {
      setDice(prevDice => {
        return prevDice.map(die => die.isHeld ? die : createNewDie())
      });
    }
  }

  useEffect(() => {
    function checkWin() {
      if (dice.every(die => die.isHeld && die.number === dice[0].number)) {
        setWon(prevState => !prevState);
      }
    }
    checkWin();
  }, [dice])

  const [ width, height ] = useWindowSize();

  const diceToLoad = dice.map(die => <Die key={die.id} id={die.id} number={die.number} isHeld={die.isHeld} handleDieClick={handleDieClick} won={won} />)

  return (
    <div className='page center'>
      <div className='main center'>
        <h1 className='title'>{won ? 'YOU WON !' : 'TENZI'}</h1>
        <p className='sub-title'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <Board
          diceToLoad={diceToLoad}
        />
        <button
          className='btn-roll'
          onClick={handleButtonClick}
        >
          {won ? 'Play Again' : 'Roll'}
          {won && <Confetti width={width} height={height} />}
        </button>
      </div>
    </div>
  );
}
