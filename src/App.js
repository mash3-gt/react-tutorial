import React, { useState } from "react"; // JSCエラー回避のため必要

/**
 * 各マスのコンポーネント
 * クリックでチェックがつく機能を持つ
 * propertyに値を渡す時は{value}などとobjectにする
 * @returns
 */
function Square({
  value, // マスに表示する値
  onSquareClick, // ますをクリックした時に呼ばれる処理
}) {
  // 引数でvalueを受け取り、そのままマスに表示

  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

/**
 * 9x9の盤面．
 * 各マスはコンポーネント化して実装を共通化する
 * @returns
 */
function Board({ xIsNext, squares, onPlay }) {
  // マスをクリックした時の処理
  function handleClick(i) {
    // すでにマスが埋まっている、または勝敗がついている場合、早期リターン
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    // sliceメソッドでsquaresのコピーを作成
    // sliceメソッド：
    // コピーする理由：直接変更でも良いが、のちの実装やimmutabilityのため
    const nextSquares = squares.slice();

    // Xの順か否かでマークを変更
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    // 盤面の更新.履歴管理のため、処理は上位レイヤーで作成
    onPlay(nextSquares);
  }

  // マス目の更新後に勝利判定．勝者、または次の手番を示すメッセージ（status）を作成
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div>
      {/* ゲームの状況を表示 */}
      <div className="status">{status}</div>

      {/* 盤面を表示 */}
      <div className="board-row">
        {/* 無限ループを避けるため、アロー関数を用いる．クリック時のみ=>の先が実行される */}
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </div>
  );
}

/**
 * 勝利判定する関数
 * 勝利するパターンを列挙し、一致するものがあるか確認
 * @param {*} squares
 * @returns
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

/**
 * 履歴管理するためトップコンポーネントをBoardの上に用意
 * @returns
 */
export default function Game() {
  // ゲーム全体で持つ状態を作成
  const [history, setHistory] = useState([Array(9).fill(null)]); //履歴
  const [currentMove, setCurrentMove] = useState(0); //現在見ている手順（

  // 次の手順がXか否か．currentMoveから決まるため、状態変数にはしない
  const xIsNext = currentMove % 2 === 0;

  // 現在の盤面を読み込む(履歴から現在位置を参照)
  const currentSquares = history[currentMove];

  // ゲーム内容を更新するためのhandle. Board内で呼び出す
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory); //上で作った履歴を反映
    setCurrentMove(nextHistory.length - 1);
  }

  // ？
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // 履歴として表示する文章の作成
  // square: 各手順での配置, move: 手順のindex？
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      //初手以降はその番号に移動
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      // listは手順ごとに作成されるため、区別するためkeyを与える（warning回避）
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        {/* 五目並べを呼び出す. 次の手番, 現在の盤面, 更新handleを渡す */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        {/* 履歴の文章を表示．olはなに？ */}
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
