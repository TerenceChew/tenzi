import './Board.css';

export default function Board(props) {
  const { diceToLoad } = props;

  return (
    <div className='board'>
      {diceToLoad}
    </div>
  )
}
