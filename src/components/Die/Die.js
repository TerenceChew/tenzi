import './Die.css';

export default function Die(props) {
  const { id, number, isHeld, handleDieClick, won } = props;
  const style = isHeld ? 'held' : '';

  return (
    <div
      className={`die center ${style}`}
      onClick={won ? null : () => handleDieClick(id)}
    >
      {number}
    </div>
  )
}
