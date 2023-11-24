const gameboard = (function(){
  let board = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];

  const getBoard = () => board;

  const displayBoard = () => {
    for(let i=0; i<board.length; i++){
      for(let j=0; j<board[i].length; j++){
        console.log(board[i][j]);
      }
    };
  };

  const updateBoard = (player, position) => {
    for(let i=0; i<board.length; i++){
      for(let j=0; j<board[i].length; j++){
        if(board[i][j] == position){
          board[i][j] = player.getSymbol();
        }
      }
    };
  }

  return {displayBoard, updateBoard, getBoard};
})();

function player(sym){
let score = 0;
const symbol = sym;

const getSymbol = () => symbol;

const getScore = () => score;

return {getScore, getSymbol};
};


const gameController = (function(){
  let gameOver = false;
  const human = player("X");
  const computer = player("O");

  let playerInput = null;

  const playGame = () => {
    //process player input
    takeInput();
    gameboard.updateBoard(human, playerInput);
    gameboard.displayBoard();
  };

  // while(!gameOver){

  // };
  const takeInput = () => {
    playerInput = prompt("Select your position: ");
  };

 

  return {playGame};
})();


//main
gameController.playGame();



