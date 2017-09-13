import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  function winningLine(line, value) {
    line = line && line.line;
    if(line && (line[0] === value || line[1] === value || line[2] === value))
      return 'square won-square';
    else 
      return 'square';
  }
  return (
    
    <button className={winningLine(props.line, props.currentSqaure)} onClick={props.onClick} >
      {props.value}
    </button>
  );
}


function Board(props) {
  function renderSquare(row,col) {
    return <Square key={(row*3)+col} value={props.squares[(row*3)+col]} 
      onClick={()=> props.onClick((row*3)+col)}
      currentSqaure={(row*3)+col}
      line={props.line}/>;
  }

  function renderSquares (row, col) {
    let render = [];
    for (let i = 0; i < row; i++) {
      let cells = [];
      for (let j = 0; j < col; j++) {
        cells.push(renderSquare(i,j));  
      }
      render.push(<div key={i} className="board-row">{ cells }</div>);
    }
    return render;
  }

  return (
    <div>
      {renderSquares(3,3)}
    </div>
  );
}

class Game extends React.Component {

  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        selection: null
      }],
      xIsNext: true,
      stepNumber: 0,
      listOrderAscd: true,
    }
  }

  handleClick(i) {
    const selection = "(" + ~~(i/3) + "," + i%3 + ")";
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        selection: selection,
        active: false,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    // const history = this.state.history;
    // history.map((step)=> {
    //   step.active = false;
    //   return 0;
    // })
    // history[step].active = true;
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      //history: history,
    });
  }

  toggleOrder() {
    let listOrderAscd = this.state.listOrderAscd;
    this.setState({
      listOrderAscd: !listOrderAscd,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
        'Move :' + step.selection :
        'Game start';
        
      let link = null;
      if(move === this.state.stepNumber) {
        link = <a href="#" className='active-selection' onClick={() => this.jumpTo(move)}>{desc}</a>;
      } else {
        link = <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>;
      }

      return (
        <li key={move}>         
          {link}
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.winner;
    }
    else if(this.state.stepNumber === 9) {
      status = 'Game Draw';
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            line={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol start="0">
            <li style={{listStyleType:'none'}}>
              <button className='btn btn-primary' onClick={()=>this.toggleOrder()}>  
                Reverse Order
              </button>
            </li>
            {this.state.listOrderAscd ? moves : moves.reverse()}
          </ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return {line: lines[i], winner: squares[a]};
    }
  }
  return null;
}