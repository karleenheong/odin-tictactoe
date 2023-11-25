//---------- GAME BOARD DATA -------------

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


//---------- PLAYER FACTORY -------------

const player = () => {
  let name;
  let type;
  let symbol = null;
  let icon = null;
  let background = null;
  let score = 0;

  const setSymbol = (sym) => {
    symbol = sym;
    if(sym === "X"){
      icon = "url(./graphics/cross.png)";
      background = "rgb(38, 216, 207)";
    } else {
      icon = "url(./graphics/circle.png)";
      background = "lightskyblue";
    }
  }

  const getName = () => name;
  const setName = (playerName) => name = playerName;
  const getType = () => type;
  const setType = (playerType) => type = playerType;
  const getSymbol = () => symbol;
  const getIcon = () => icon;
  const getBG = () => background;
  const getScore = () => score;
  const addToScore = () => score++;

  
  return {getType, setType, getName, setName, getSymbol, setSymbol, getIcon, getBG, getScore, addToScore};
}


//---------- GAME CONTROLLER -------------

const gameController = (function(){
  let players = [];
  let rounds = 0;

  players[0] = player();
  players[1] = player();

  const determinePlayers = (button) => {
    if(button.id === "humanVsHuman"){
      players[0].setType("human");
      players[1].setType("human");
    } else if(button.id === "humanVsComp"){
      players[0].setType("human");
      players[1].setType("computer");
    } else {
      console.log("player select error");
    }
    displayController.processPlayerNames();
  }

  const assignWeapon = (weaponBtn) => {
    if(weaponBtn.id === "crossBtn"){
      players[0].setSymbol("X");
      players[1].setSymbol("O");
    } else if(weaponBtn.id === "circleBtn"){
      players[0].setSymbol("O");
      players[1].setSymbol("X");
    } else {
      console.log("error assigning weapon");
    }
    displayController.hideSelectWeapon();
    displayController.showGameboard();
  } 

  //Process Human Player
  const humanTurn = (square) => {

    switch(square.id){
      case "btn0":
        gameboard.updateBoard(playerOne, 0);
        displayController.updateSquare(playerOne, 0);
        break;
      case "btn1":
        gameboard.updateBoard(playerOne, 1);
        displayController.updateSquare(playerOne, 1);
        break;
      case "btn2":
        gameboard.updateBoard(playerOne, 2);
        displayController.updateSquare(playerOne, 2);
        break;
      case "btn3":
        gameboard.updateBoard(playerOne, 3);
        displayController.updateSquare(playerOne, 3);
        break;
      case "btn4":
        gameboard.updateBoard(playerOne, 4);
        displayController.updateSquare(playerOne, 4);
        break;
      case "btn5":
        gameboard.updateBoard(playerOne, 5);
        displayController.updateSquare(playerOne, 5);
        break;
      case "btn6":
        gameboard.updateBoard(playerOne, 6);
        displayController.updateSquare(playerOne, 6);
        break;
      case "btn7":
        gameboard.updateBoard(playerOne, 7);
        displayController.updateSquare(playerOne, 7);
        break;
      case "btn8":
        gameboard.updateBoard(playerOne, 8);
        displayController.updateSquare(playerOne, 8);
        break;
      default:
        console.log("error on player turn");
    }
  };

  //Process Computer Player
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
      gameboard.updateBoard(gameController.getPlayerTwo(), availablePositions[randomNum]);
      displayController.updateSquare("playerTwo", availablePositions[randomNum]);
    } else {
      displayController.displayGameEnd("noone");
    }
  }

  //Check Square for Winner
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
            computerTurn();
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

  //Check Gameboard Still Has Space
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

  const getPlayers = () => players;
  // const getPlayerTwo = () => playerTwo;
  // const getPlayerOne = () => playerOne;
  const getRounds = () => rounds;

  return {determinePlayers, getPlayers, assignWeapon, humanTurn, checkForWin, computerTurn, getRounds};
})();


//---------- DISPLAY CONTROLLER -------------

const displayController = (function() {

  const selectWeapon = document.querySelector(".selectWeapon");
  const gameScreen = document.querySelector(".gameScreen");
  const restart = document.querySelector(".restart");
  const restartBtn = document.querySelector(".playAgain");
  const resultsDiv = document.querySelector(".results");
  const scorePanel = document.querySelector(".scorePanel");
  const playerOneScore = document.querySelector(".playerOneScore");
  const playerTwoScore = document.querySelector(".playerTwoScore");
  const playerSelect = document.querySelector(".playerSelect");
  const nameScreen = document.querySelector(".nameScreen");
  const weaponText = document.querySelector(".weaponText");

  const playerSelectBtns = document.querySelectorAll(".playerSelectBtn");
  for(let i=0; i<playerSelectBtns.length; i++){
    playerSelectBtns[i].addEventListener("click", function(){
      gameController.determinePlayers(this);
    });
  }

  const weaponBtns = document.querySelectorAll(".weapon");
  for(let i=0; i<weaponBtns.length; i++){
    weaponBtns[i].addEventListener("click", function(){
      gameController.assignWeapon(this);
    });
  }

  const squareBtns = document.querySelectorAll(".square");
  for(let i=0; i<squareBtns.length; i++){
    squareBtns[i].addEventListener("click", function(){
      gameController.humanTurn(this);
    });
  };

  //Player Names Screen
  const processPlayerNames = () => {
    hidePlayerSelect();
    showNameScreen();
    let players = gameController.getPlayers();

    for(let i=0; i<players.length; i++){
      if(players[i].getType() === "human"){
        let instructionText = document.createElement("h3");
        instructionText.textContent = "Player " + (i+1) + ":";
        nameScreen.appendChild(instructionText);
        let inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.className = "inputBox";
        nameScreen.appendChild(inputBox);
      }
    }
    let newBtn = document.createElement("button");
    newBtn.className = "submitName";
    newBtn.textContent = "Let's Begin!";

    newBtn.addEventListener("click", () => {
      let inputBoxes = document.querySelectorAll(".inputBox");
      for(let i=0; i<inputBoxes.length; i++){
        players[i].setName(inputBoxes[i].value);
        console.log(players[i].getName());
      }
      processWeaponSelect(players);
    });
    
    nameScreen.appendChild(newBtn);
  }

  //Weapon Select Screen
  const processWeaponSelect = (players) => {
    hideNameScreen();
    showSelectWeapon();

    let nameText = document.createElement("h2");
    nameText.textContent = "Choose your weapon, " + players[0].getName() + ":";
    nameText.style.padding = "30px 0";
    weaponText.appendChild(nameText);
  }

  const updateSquare = (player, num) => {
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

  restartBtn.addEventListener("click", restartGame);
  
  const resetSquares = () => {
    for(let i=0; i<squareBtns.length; i++){
      squareBtns[i].style.backgroundImage = "url(./graphics/tile.png)";
      squareBtns[i].style.backgroundSize = "100% 100%"; 
      squareBtns[i].style.opacity = "50%";
      squareBtns[i].disabled = false;
    };
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
  const showPlayerSelect = () => {
    playerSelect.style.display = "block";
  }
  const hidePlayerSelect = () => {
    playerSelect.style.display = "none";
  }
  const showNameScreen = () => {
    nameScreen.style.display = "block";
  }
  const hideNameScreen = () => {
    nameScreen.style.display = "none";
  }

  hideNameScreen();
  hideSelectWeapon();
  hideGameboard();
  hideRestart();
  hideScore();

  return {processPlayerNames, hideSelectWeapon, showGameboard, hideGameboard, updateSquare, displayGameEnd};
})();








