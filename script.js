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

  const getName = () => name;
  const setName = (playerName) => name = playerName;

  return {getSymbol, getName, setName, getScore};
};


const gameController = (function(){
  let human = null;
  let computer = null;
  let rounds = 0;

  const assignCross = () => {
    human = player("X");
    computer = player("O");
    displayController.setIcons("cross");
    displayController.hideSelectWeapon();
    displayController.showGameboard();
  }
  
  const assignCircle = () => {
    human = player("O");
    computer = player("X");
    displayController.setIcons("circle");
    displayController.hideSelectWeapon();
    displayController.showGameboard();
  }

  //process player
  const humanTurn = (square) => {

    switch(square.id){
      case "btn0":
        gameboard.updateBoard(human, 0);
        displayController.updateButton(human, 0);
        break;
      case "btn1":
        gameboard.updateBoard(human, 1);
        displayController.updateButton(human, 1);
        break;
      case "btn2":
        gameboard.updateBoard(human, 2);
        displayController.updateButton(human, 2);
        break;
      case "btn3":
        gameboard.updateBoard(human, 3);
        displayController.updateButton(human, 3);
        break;
      case "btn4":
        gameboard.updateBoard(human, 4);
        displayController.updateButton(human, 4);
        break;
      case "btn5":
        gameboard.updateBoard(human, 5);
        displayController.updateButton(human, 5);
        break;
      case "btn6":
        gameboard.updateBoard(human, 6);
        displayController.updateButton(human, 6);
        break;
      case "btn7":
        gameboard.updateBoard(human, 7);
        displayController.updateButton(human, 7);
        break;
      case "btn8":
        gameboard.updateBoard(human, 8);
        displayController.updateButton(human, 8);
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
          displayController.displayGameEnd(player);
        } else {
          if(player === human){
            computerTurn();
          } 
        }
    } else {
      rounds++;
      displayController.displayGameEnd("noone");
    }
  };

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

  //process computer
  const computerTurn = () => {
    let board = gameboard.getBoard();
    let availablePositions = [];
    for(let i=0; i<board.length; i++){
      if(board[i] === ""){
        availablePositions.push(i);
      }
    }
    if(availablePositions.length > 0){
      let randomNum = Math.floor(Math.random() * availablePositions.length);
      gameboard.updateBoard(gameController.getComputer(), availablePositions[randomNum]);
      displayController.updateButton("computer", availablePositions[randomNum]);
    } else {
      displayController.displayGameEnd("noone");
    }
  }

  const getComputer = () => computer;
  const getHuman = () => human;
  const getRounds = () => rounds;

  return {getComputer, getHuman, assignCross, assignCircle, humanTurn, checkForWin, computerTurn, getRounds};
})();

//dom controller
const displayController = (function() {
  const selectWeapon = document.querySelector(".selectWeapon");
  const gameScreen = document.querySelector(".gameScreen");
  const restart = document.querySelector(".restart");
  const restartBtn = document.querySelector(".playAgain");
  const resultsDiv = document.querySelector(".results");
  let humanIcon;
  let computerIcon;
  let humanBG;
  let computerBG;

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
      gameController.computerTurn();
    }
  }
  
  const crossBtn = document.querySelector(".crossBtn");
  const circleBtn = document.querySelector(".circleBtn");
  crossBtn.addEventListener("click", gameController.assignCross);
  circleBtn.addEventListener("click", gameController.assignCircle);

  squareBtns = document.querySelectorAll(".square");
  for(let i=0; i<squareBtns.length; i++){
    squareBtns[i].addEventListener("click", function(){
      gameController.humanTurn(this);
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
      humanIcon = "url(./graphics/cross.png)";
      humanBG = "rgb(38, 216, 207)";
      computerIcon = "url(./graphics/circle.png)";
      computerBG = "lightskyblue";
    } else {
      humanIcon = "url(./graphics/circle.png)";
      humanBG = "lightskyblue";
      computerIcon = "url(./graphics/cross.png)";
      computerBG = "rgb(38, 216, 207)";
    }
  }

  const hideSelectWeapon = () => {
    selectWeapon.style.display = "none";
  }

  const showSelectWeapon = () => {
    selectWeapon.style.display = "block";
  }

  const showGameboard = () => {
    gameScreen.style.display = "block";
  }

  const hideGameboard = () => {
    gameScreen.style.display= "none";
  }

  const updateButton = (player, num) => {
    if(player === gameController.getHuman()) {
      squareBtns[num].style.backgroundImage = humanIcon;
      squareBtns[num].style.backgroundColor = humanBG;
    } else {
      squareBtns[num].style.backgroundImage = computerIcon;
      squareBtns[num].style.backgroundColor = computerBG;
    }
    squareBtns[num].style.opacity = "100";
    squareBtns[num].style.backgroundSize = "75% 75%"; 
    squareBtns[num].style.backgroundRepeat = "no-repeat"; 
    squareBtns[num].style.backgroundPosition = "center"; 
    squareBtns[num].disabled = true;
  }

  const displayGameEnd = (player) => {
    let text = document.createElement("h3");
    if(player === gameController.getHuman()){
      text.textContent = "You win!";
    } else if(player === gameController.getComputer()){
      text.textContent = "You lose.";
    } else {
      text.textContent = "It's a draw";
    }
    resultsDiv.append(text);
    for(let i=0; i<squareBtns.length; i++){
      squareBtns[i].disabled = true;
    }
    showRestart();
  }

  const showRestart = () => {
    restart.style.display = "block";
  }

  const hideRestart = () => {
    restart.style.display = "none";
  }

  hideGameboard();
  hideRestart();

  return {hideSelectWeapon, showGameboard, hideGameboard, updateButton, setIcons, displayGameEnd};
})();


//main
// gameController.playGame();







