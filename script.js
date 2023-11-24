const gameboard = (function(){
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const displayBoard = () => {
    console.log(board[0] + " " + board[1] + " " + board[2]);
    console.log(board[3] + " " + board[4] + " " + board[5]);
    console.log(board[6] + " " + board[7] + " " + board[8]);
    console.log("endgrid");
  };

  const updateBoard = (player, position) => {
    board[position] = player.getSymbol();
  }

  return {displayBoard, updateBoard, getBoard};
})();

function player(sym){
const symbol = sym;

const getSymbol = () => symbol;

return {getSymbol};
};


const gameController = (function(){
  let playerWins = false;
  let computerWins = false;
  let gameInPlay = true;
  const human = player("X");
  const computer = player("O");
  let currentTurn = human;

  const playGame = () => {
  
    gameboard.displayBoard();

    gameloop:
    while(gameInPlay){
      if(!playerWins && !computerWins){
        if(currentTurn === human){
          playerTurn();
          playerWins = checkForWin(human.getSymbol());
          currentTurn = computer;
        } else if(currentTurn === computer){
          computerTurn();
          computerWins = checkForWin(computer.getSymbol());
          currentTurn = human;
        }
      } else {
        gameInPlay = false;
        break gameloop;
      }
    }
    console.log("Final result: You win: " + playerWins + " Computer wins: " + computerWins);
  };

  //process player
  const playerTurn = () => {
    let playerInput = prompt("Select your position: ");
    gameboard.updateBoard(human, +playerInput);
    gameboard.displayBoard();
  };

  //check square for winner
  const checkForWin = (symbol) => {
    let won = false;
    let board = gameboard.getBoard();
    if(
      (board[0] === symbol && board[1] === symbol && board[2] === symbol) ||
      (board[0] === symbol && board[4] === symbol && board[8] === symbol) ||
      (board[0] === symbol && board[3] === symbol && board[6] === symbol) ||
      (board[1] === symbol && board[4] === symbol && board[7] === symbol) ||
      (board[2] === symbol && board[5] === symbol && board[8] === symbol) ||
      (board[2] === symbol && board[4] === symbol && board[6] === symbol) ||
      (board[3] === symbol && board[4] === symbol && board[5] === symbol) ||
      (board[6] === symbol && board[7] === symbol && board[8] === symbol)
      ){
        won = true;
      }
      return won;
  };

  //process computer
  const computerTurn = () => {
    let board = gameboard.getBoard();
    let availablePositions = [];
    for(let i=0; i<board.length; i++){
      if(board[i] === ""){
        availablePositions.push(i);
      }
    };
    let randomNum = Math.floor(Math.random() * availablePositions.length);
    gameboard.updateBoard(gameController.getComputer(), availablePositions[randomNum]);
    gameboard.displayBoard();
  }

  const getComputer = () => computer;

  return {playGame, getComputer};
})();


//main
gameController.playGame();



