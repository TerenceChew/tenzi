import './Popup.css';

export default function Popup(props) {
  const { currentScore, bestScore, handleButtonClick } = props;

  return (
    <div className='popup center'>
      <h2>Your Score</h2>
      <p className='your-score'>{currentScore}</p>
      <h2>Best Score</h2>
      <p className='best-score'>{bestScore}</p>
      <button
          className='btn'
          onClick={handleButtonClick}
        >
          Play Again
        </button>
    </div>
  )
}
