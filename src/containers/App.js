import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import './App.css';
import Board from '../components/Board/Board';
import Die from '../components/Die/Die';
import Popup from '../components/Popup.js/Popup';


export default function App() {
  const [ time, setTime ] = useState({
    startTime: '',
    endTime: ''
  })
  const [ dice, setDice ] = useState(() => createAllNewDice());
  const [ won, setWon ] = useState(false);
  const [ bestScore, setBestScore ] = useState(() => getBestScore());

  // get prev best score from local storage
  function getBestScore() {
    const prevBestScore = localStorage.getItem('score');
    if (prevBestScore) {
      return prevBestScore;
    } else {
      localStorage.setItem('score', '99:99:99');
      return '99:99:99'
    }
  }
  
  // generate random id
  function generateId() {
    return Math.ceil(Math.random() * 999999999);
  }

  // generate random die number, from 1 to 6
  function generateDieNum() {
    return Math.ceil(Math.random() * 6);
  }

  // create an array of new dice, with id, number and isHeld
  // track startTime in state, once a new set of dice is created 
  function createAllNewDice() {
    let newDiceArr = new Array(10).fill("");

    getStartTime();

    return newDiceArr.map(() => {
      return {
        id: generateId(),
        number: generateDieNum(),
        isHeld: false
      };
    });
  }

  // update the status of isHeld and track endTime, every time a die is clicked
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
    getEndTime();
  }

  // create a single die with id, number and isHeld
  function createNewDie() {
    return {
      id: generateId(),
      number: generateDieNum(),
      isHeld: false
    };
  }

  // determine what the button does
  // if game is won, set won to false and reset the whole board
  // else map through dice in state, check the isHeld property of each die
  // if isHeld is true, return the same die
  // else return a new die
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

  // track startTime
  function getStartTime() {
    setTime(prevScore => {
      return {
        ...prevScore,
        startTime: new Date()
      }
    })
  }

  // track endTime
  function getEndTime() {
    setTime(prevScore => {
      return {
        ...prevScore,
        endTime: new Date()
      }
    })
  }

  // get score by finding the difference between endTime and startTime in state
  // return the score in a format of HH:MM:SS
  function getScore() {
    const score = time.endTime - time.startTime;
    return new Date(score).toISOString().substring(11, 19);
  }

  // will run whenever dice state changes
  useEffect(() => {
    // compare newScore to prevBestScore from local storage
    // if newScore < prevBestScore
    // save newScore as newBestScore in local storage
    function saveBestScore() {
      const prevBestScore = localStorage.getItem('score');
      const prevBestScoreFront = prevBestScore.split(':')[0];
      const prevBestScoreMiddle = prevBestScore.split(':')[1];
      const prevBestScoreEnd = prevBestScore.split(':')[2];
      const newScore = getScore();
      const newScoreFront = newScore.split(':')[0];
      const newScoreMiddle = newScore.split(':')[1];
      const newScoreEnd = newScore.split(':')[2];
      let newBestScore;

      if (newScoreFront <= prevBestScoreFront && newScoreMiddle <= prevBestScoreMiddle && newScoreEnd < prevBestScoreEnd) {
        newBestScore = newScore;
        localStorage.setItem('score', newBestScore)
      }
    }
    // check if all dice are the same and are held, whenever dice state changes
    // if all dice are same and held, save the best score in local storage
    // update bestScore in state
    // update won in state to true
    function checkWin() {
      if (dice.every(die => die.isHeld && die.number === dice[0].number)) {
        saveBestScore();
        setBestScore(localStorage.getItem('score'));
        setWon(true);
      }
    }
    checkWin(); // eslint-disable-next-line
  }, [dice]) 

  const [ width, height ] = useWindowSize(); // for Confetti
  const pageStyle = won ? 'blur' : null; // blur background when won
  const currentScore = won ? getScore() : null; // get current score when won
  const diceToLoad = dice.map(die => <Die key={die.id} id={die.id} number={die.number} isHeld={die.isHeld} handleDieClick={handleDieClick} won={won} />) // convert dice state into Die components

  return (
    <div className='page center'>
      <div className={`main center ${pageStyle}`}>
        <h1 className='title'>TENZI</h1>
        <p className='sub-title'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <Board
          diceToLoad={diceToLoad}
        />
        <button
          className='btn'
          onClick={handleButtonClick}
        >
          Roll
        </button>
      </div>
      {won && <Confetti width={width} height={height} />}
      {won && <Popup won={won} handleButtonClick={handleButtonClick} currentScore={currentScore} bestScore={bestScore} />}
    </div>
  );
}
