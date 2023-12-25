import "./styles.css";
import { useReducer } from "react";
import "./App.css";
const NUM_ROW = 6;
const NUM_COL = 7;

export default function App() {
  const [{ board, winner, isGameOver }, dispatch] = useReducer(
    reducer,
    getInitialState()
  );
  return (
    <>
      {winner != null ? <h2>Player {winner} has won!</h2> : <></>}
      <div className="App">
        {board.map((col, colIndex) => {
          const onClickCol = () => {
            dispatch({ type: "move", colIndex });
          };
          return <Column key={colIndex} entries={col} onClick={onClickCol} />;
        })}
      </div>
      {isGameOver ? (
        <button
          onClick={() => {
            dispatch({ type: "restart" });
          }}
        >
          reset
        </button>
      ) : (
        <></>
      )}
    </>
  );
}
function Column({ entries, onClick }) {
  return (
    <div className="column">
      {entries.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="tile" onClick={onClick}>
            {row != null && <div className={`player player-${row}`}></div>}
          </div>
        );
      })}
    </div>
  );
}
function reducer(state, action) {
  switch (action.type) {
    case "restart":
      return getInitialState();
    case "move":
      const relevantCol = state.board[action.colIndex];
      const isColFull = relevantCol[0] == null;
      if (!isColFull || state.isGameOver) {
        return state;
      }
      const { board, currentPlayer } = state;
      const boardClone = [...board];
      const colRepl = [...relevantCol];
      const rowInd = colRepl.lastIndexOf(null);
      colRepl[rowInd] = currentPlayer;
      boardClone[action.colIndex] = colRepl;
      const didWinHorizonal = didWin(
        rowInd,
        action.colIndex,
        0,
        1,
        boardClone,
        currentPlayer
      );
      const didWinVertical = didWin(
        rowInd,
        action.colIndex,
        1,
        0,
        boardClone,
        currentPlayer
      );
      const didWinDiagonal =
        didWin(rowInd, action.colIndex, 1, 1, boardClone, currentPlayer) ||
        didWin(rowInd, action.colIndex, -1, 1, boardClone, currentPlayer);
      const winner =
        didWinVertical || didWinHorizonal || didWinDiagonal
          ? currentPlayer
          : null;

      const GameOver = boardClone.every((col) =>
        col.every((row) => row != null)
      );
      return {
        board: boardClone,
        currentPlayer: currentPlayer === 1 ? 2 : 1,
        winner,
        isGameOver: winner != null || GameOver,
      };
  }
}
function getInitialState() {
  return {
    board: new Array(NUM_COL)
      .fill(null)
      .map((_) => new Array(NUM_ROW).fill(null)),
    winner: null,
    currentPlayer: 1,
    isGameOver: false,
  };
}
function didWin(row, col, i, j, board, currentPlayer) {
  let total = 0;
  let Num_Row = row;
  let Num_Col = col;
  while (
    Num_Col < NUM_COL &&
    Num_Row < NUM_ROW &&
    board[Num_Col][Num_Row] === currentPlayer
  ) {
    total++;
    Num_Row += i;
    Num_Col += j;
  }
  Num_Row = row - i;
  Num_Col = col - j;
  while (
    Num_Col >= 0 &&
    Num_Row >= 0 &&
    board[Num_Col][Num_Row] === currentPlayer
  ) {
    total++;
    Num_Row -= i;
    Num_Col -= j;
  }
  return total >= 4;
}
