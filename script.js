const gameboard = (function(){
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const updateBoard = (player, position) => {
    board[position] = player.getSymbol();
    gameController.checkForWin(player);
  }

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  }

  return {updateBoard, getBoard, resetBoard};
})();

function player(sym){
  const symbol = sym;
  let name;
  let score = 0;

  const getSymbol = () => symbol;
  const getScore = () => score;
  const addToScore = () => score++;

  const getName = () => name;
  const setName = (playerName) => name = playerName;

  return {getSymbol, getName, setName, getScore, addToScore};
};


const gameController = (function(){
  let playerOne = null;
  let playerTwo = null;
  let rounds = 0;

  const assignCross = () => {
    playerOne = player("X");
    playerTwo = player("O");
    displayController.setIcons("cross");
    displayController.hideSelectWeapon();
    displayController.showGameboard();
  }
  
  const assignCircle = () => {
    playerOne = player("O");
    playerTwo = player("X");
    displayController.setIcons("circle");
    displayController.hideSelectWeapon();
    displayController.showGameboard();
  }

  //process player
  const playerOneTurn = (square) => {

    switch(square.id){
      case "btn0":
        gameboard.updateBoard(playerOne, 0);
        displayController.updateButton(playerOne, 0);
        break;
      case "btn1":
        gameboard.updateBoard(playerOne, 1);
        displayController.updateButton(playerOne, 1);
        break;
      case "btn2":
        gameboard.updateBoard(playerOne, 2);
        displayController.updateButton(playerOne, 2);
        break;
      case "btn3":
        gameboard.updateBoard(playerOne, 3);
        displayController.updateButton(playerOne, 3);
        break;
      case "btn4":
        gameboard.updateBoard(playerOne, 4);
        displayController.updateButton(playerOne, 4);
        break;
      case "btn5":
        gameboard.updateBoard(playerOne, 5);
        displayController.updateButton(playerOne, 5);
        break;
      case "btn6":
        gameboard.updateBoard(playerOne, 6);
        displayController.updateButton(playerOne, 6);
        break;
      case "btn7":
        gameboard.updateBoard(playerOne, 7);
        displayController.updateButton(playerOne, 7);
        break;
      case "btn8":
        gameboard.updateBoard(playerOne, 8);
        displayController.updateButton(playerOne, 8);
        break;
      default:
        console.log("error on player turn");
    }
  };

  //check square for winner
  const checkForWin = (player) => {
    let won = false;
    let board = gameboard.getBoard();
    let symbol = player.getSymbol();
    let gameEnded = checkGameEnded();

    if(!gameEnded){
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
          rounds++;
          addToScore(player);
          displayController.displayGameEnd(player);
        } else {
          if(player === playerOne){
            playerTwoTurn();
          } 
        }
    } else {
      rounds++;
      displayController.displayGameEnd("noone");
    }
  };

  const addToScore = (player) => {
    player.addToScore();
  }

  const checkGameEnded = () => {
    let gameEnded;
    let board = gameboard.getBoard();
    for(let i=0; i<board.length; i++){
      if(board[i] !== "X" || board[i] !== "O"){
        gameEnded = false;
      } else {
        gameEnded = true;
      }
    }
    return gameEnded;
  }

  //process playerTwo
  const playerTwoTurn = () => {
    let board = gameboard.getBoard();
    let availablePositions = [];
    for(let i=0; i<board.length; i++){
      if(board[i] === ""){
        availablePositions.push(i);
      }
    }
    if(availablePositions.length > 0){
      let randomNum = Math.floor(Math.random() * availablePositions.length);
      gameboard.updateBoard(gameController.getPlayerTwo(), availablePositions[randomNum]);
      displayController.updateButton("playerTwo", availablePositions[randomNum]);
    } else {
      displayController.displayGameEnd("noone");
    }
  }

  const getPlayerTwo = () => playerTwo;
  const getPlayerOne = () => playerOne;
  const getRounds = () => rounds;

  return {getPlayerTwo, getPlayerOne, assignCross, assignCircle, playerOneTurn, checkForWin, playerTwoTurn, getRounds};
})();

//dom controller
const displayController = (function() {
  const selectWeapon = document.querySelector(".selectWeapon");
  const gameScreen = document.querySelector(".gameScreen");
  const restart = document.querySelector(".restart");
  const restartBtn = document.querySelector(".playAgain");
  const resultsDiv = document.querySelector(".results");
  const scorePanel = document.querySelector(".scorePanel");
  const playerOneScore = document.querySelector(".playerOneScore");
  const playerTwoScore = document.querySelector(".playerTwoScore");

  let playerOneIcon;
  let playerTwoIcon;
  let playerOneBG;
  let playerTwoBG;

  const restartGame = () => {
    console.log(gameController.getRounds());
    hideRestart();
    //destroy resultsDiv text
    while(resultsDiv.firstChild){
      resultsDiv.removeChild(resultsDiv.firstChild);
    }
    gameboard.resetBoard();
    resetSquares();
    if(gameController.getRounds() % 2 !== 0){
      gameController.playerTwoTurn();
    }
  }
  
  const crossBtn = document.querySelector(".crossBtn");
  const circleBtn = document.querySelector(".circleBtn");
  crossBtn.addEventListener("click", gameController.assignCross);
  circleBtn.addEventListener("click", gameController.assignCircle);

  squareBtns = document.querySelectorAll(".square");
  for(let i=0; i<squareBtns.length; i++){
    squareBtns[i].addEventListener("click", function(){
      gameController.playerOneTurn(this);
    });
  };

  const resetSquares = () => {
    for(let i=0; i<squareBtns.length; i++){
      squareBtns[i].style.backgroundImage = "url(./graphics/tile.png)";
      squareBtns[i].style.backgroundSize = "100% 100%"; 
      squareBtns[i].style.opacity = "50%";
      squareBtns[i].disabled = false;
    };
  }

  restartBtn.addEventListener("click", restartGame);

  const setIcons = (icon) => {
    if(icon === "cross"){
      playerOneIcon = "url(./graphics/cross.png)";
      playerOneBG = "rgb(38, 216, 207)";
      playerTwoIcon = "url(./graphics/circle.png)";
      playerTwoBG = "lightskyblue";
    } else {
      playerOneIcon = "url(./graphics/circle.png)";
      playerOneBG = "lightskyblue";
      playerTwoIcon = "url(./graphics/cross.png)";
      playerTwoBG = "rgb(38, 216, 207)";
    }
  }

  const updateButton = (player, num) => {
    if(player === gameController.getPlayerOne()) {
      squareBtns[num].style.backgroundImage = playerOneIcon;
      squareBtns[num].style.backgroundColor = playerOneBG;
    } else {
      squareBtns[num].style.backgroundImage = playerTwoIcon;
      squareBtns[num].style.backgroundColor = playerTwoBG;
    }
    squareBtns[num].style.opacity = "100";
    squareBtns[num].style.backgroundSize = "75% 75%"; 
    squareBtns[num].style.backgroundRepeat = "no-repeat"; 
    squareBtns[num].style.backgroundPosition = "center"; 
    squareBtns[num].disabled = true;
  }

  const displayGameEnd = (player) => {
    let text = document.createElement("h3");
    if(player === gameController.getPlayerOne()){
      text.textContent = "You win!";
    } else if(player === gameController.getPlayerTwo()){
      text.textContent = "You lose.";
    } else {
      text.textContent = "It's a draw";
    }
    showScore();
    resultsDiv.append(text);
    for(let i=0; i<squareBtns.length; i++){
      squareBtns[i].disabled = true;
    }
    showRestart();
    playerOneScore.textContent = gameController.getPlayerOne().getScore();
    playerTwoScore.textContent = gameController.getPlayerTwo().getScore();
  }

  const showRestart = () => {
    restart.style.display = "block";
  }
  const hideRestart = () => {
    restart.style.display = "none";
  }
  const showSelectWeapon = () => {
    selectWeapon.style.display = "block";
  }
  const hideSelectWeapon = () => {
    selectWeapon.style.display = "none";
  }
  const showGameboard = () => {
    gameScreen.style.display = "block";
  }
  const hideGameboard = () => {
    gameScreen.style.display= "none";
  }
  const showScore = () => {
    scorePanel.style.display = "block";
  }
  const hideScore = () => {
    scorePanel.style.display = "none";
  }

  hideGameboard();
  hideRestart();
 // hideScore();

  return {hideSelectWeapon, showGameboard, hideGameboard, updateButton, setIcons, displayGameEnd};
})();


//main
// gameController.playGame();







