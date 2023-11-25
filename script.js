//---------- GAME BOARD DATA -------------

const gameboard = (function(){
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const updateBoard = (player, position) => {
    board[position] = player.getSymbol();
    checkForWin(player);
  }

  //Check Square for Winner
  const checkForWin = (player) => {
    let symbol = player.getSymbol();
    console.log(board);
    if(
      (board[0] === symbol && board[1] === symbol && board[2] === symbol) ||
      (board[0] === symbol && board[4] === symbol && board[8] === symbol) ||
      (board[0] === symbol && board[3] === symbol && board[6] === symbol) ||
      (board[1] === symbol && board[4] === symbol && board[7] === symbol) ||
      (board[2] === symbol && board[5] === symbol && board[8] === symbol) ||
      (board[2] === symbol && board[4] === symbol && board[6] === symbol) ||
      (board[3] === symbol && board[4] === symbol && board[5] === symbol) ||
      (board[6] === symbol && board[7] === symbol && board[8] === symbol)
      )
    {
      gameController.triggerWinner(player);
    } 
    else if(boardIsFull()){
      gameController.triggerDraw();
    }
    else { 
      gameController.triggerNextRound(player);
    } 
  }

  const boardIsFull = () => {
    let isFull = true;;
    for(let i=0; i<board.length; i++){
      if(board[i] === ""){
        isFull = false;
      }
      // if(board[i] !== "X" || board[i] !== "O"){
      //   isFull = false;
      // }
    }
    console.log(isFull);
    return isFull;
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
  let turns = 0; // a turn
  let rounds = 0; // a whole game
  let gameType = "";
  let gameEnded = false;

  players[0] = player();
  players[1] = player();

  const determinePlayers = (button) => {
    if(button.id === "humanVsHuman"){
      players[0].setType("human");
      players[1].setType("human");
      gameType = "humanVsHuman";
    } else if(button.id === "humanVsComp"){
      players[0].setType("human");
      players[1].setType("computer");
      players[1].setName("Robot Overlord");
      gameType = "humanVsComp";
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
    displayController.updateTurnText(players[0]);
  } 

  const processSquareClick = (square) => {
    let player;
    //even rounds, player[0] starts
    if(rounds % 2 === 0){
      if(turns % 2 === 0){
        player = players[0];
      } else {
        player = players[1];
      }
    } else { //odd rounds player[1] starts
      if(turns % 2 === 0){
        player = players[1];
      } else {
        player = players[0];
      }
    }
    switch(square.id){
      case "btn0":
        gameboard.updateBoard(player, 0);
        displayController.updateSquare(player, 0);
        break;
      case "btn1":
        gameboard.updateBoard(player, 1);
        displayController.updateSquare(player, 1);
        break;
      case "btn2":
        gameboard.updateBoard(player, 2);
        displayController.updateSquare(player, 2);
        break;
      case "btn3":
        gameboard.updateBoard(player, 3);
        displayController.updateSquare(player, 3);
        break;
      case "btn4":
        gameboard.updateBoard(player, 4);
        displayController.updateSquare(player, 4);
        break;
      case "btn5":
        gameboard.updateBoard(player, 5);
        displayController.updateSquare(player, 5);
        break;
      case "btn6":
        gameboard.updateBoard(player, 6);
        displayController.updateSquare(player, 6);
        break;
      case "btn7":
        gameboard.updateBoard(player, 7);
        displayController.updateSquare(player, 7);
        break;
      case "btn8":
        gameboard.updateBoard(player, 8);
        displayController.updateSquare(player, 8);
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
      gameboard.updateBoard(players[1], availablePositions[randomNum]);
      displayController.updateSquare(players[1], availablePositions[randomNum]);
    } else {
      displayController.displayGameEnd(null);
    }
  }
  
  const triggerNextRound = (player) => {
    let previousPlayer = player;
    let currentPlayer;

    turns++;
    if(previousPlayer === players[0]){
      currentPlayer = players[1];
    } else {
      currentPlayer = players[0];
    }
    if(currentPlayer.getType() === "human"){
      displayController.updateTurnText(currentPlayer);
    } else {
      computerTurn();
    }
  }

  const triggerWinner = (player) => {
    gameEnded = true;
    rounds++;
    turns = 0;
    player.addToScore();
    displayController.displayGameEnd(player);
  }

  const triggerDraw = () => {
    gameEnded = true;
    rounds++;
    turns = 0;
    console.log("draw");
    displayController.displayGameEnd(null);
  }

  const getPlayers = () => players;
  const getRounds = () => rounds;
  const getGameEnded = () => gameEnded;
  const setGameEnded = (value) => gameEnded = value;

  return {determinePlayers, getPlayers, assignWeapon, processSquareClick, computerTurn, getRounds, getGameEnded, setGameEnded, triggerDraw, triggerWinner, triggerNextRound};
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
  const selectSquare = document.querySelector(".selectSquare");

  let players = null;

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
      gameController.processSquareClick(this);
    });
  };

  //Player Names Screen
  const processPlayerNames = () => {
    hidePlayerSelect();
    showNameScreen();
    players = gameController.getPlayers();

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

    let nameText = document.createElement("p");
    nameText.textContent = "Choose your weapon, " + players[0].getName() + ":";
    nameText.style.padding = "30px 0";
    weaponText.appendChild(nameText);
  }

  //Update Square Tile Graphics
  const updateSquare = (player, num) => {
    squareBtns[num].style.backgroundImage = player.getIcon();
    squareBtns[num].style.backgroundColor = player.getBG();

    squareBtns[num].style.opacity = "100";
    squareBtns[num].style.backgroundSize = "75% 75%"; 
    squareBtns[num].style.backgroundRepeat = "no-repeat"; 
    squareBtns[num].style.backgroundPosition = "center"; 
    squareBtns[num].disabled = true;
  }

  const updateTurnText = (player) => {
    while(selectSquare.firstChild){
      selectSquare.removeChild(selectSquare.firstChild);
    }
    let text = document.createElement("p");
    if(!gameController.getGameEnded()){
      if(player.getType() === "human"){
        text.textContent = "Select a square, " + player.getName() + ":";
      } 
    } else {
      text.textContent = "The results are...";
    }
    selectSquare.appendChild(text);
  }

  const displayGameEnd = (player) => {
    let text = document.createElement("h2");
    if(player !== null){
      text.style.backgroundColor = player.getBG();
      if(player.getType() === "human"){
        text.textContent = player.getName() + " wins!";
      } else if(player.getType() === "computer"){
        text.textContent = "You lose.";
      } 
    } else {
      text.textContent = "It's a draw";
    }
    showScore();
    resultsDiv.append(text);
    for(let i=0; i<squareBtns.length; i++){
      squareBtns[i].disabled = true;
    }
    showRestart();
    playerOneScore.textContent = players[0].getName() + ": " + players[0].getScore();
    playerTwoScore.textContent = players[1].getName() + ": " + players[1].getScore();
  }


  const restartGame = () => {
    hideRestart();
    //destroy resultsDiv text
    while(resultsDiv.firstChild){
      resultsDiv.removeChild(resultsDiv.firstChild);
    }
    gameController.setGameEnded(false);
    gameboard.resetBoard();
    resetSquares();
    if(gameController.getRounds() % 2 !== 0){
      if(players[1].getType() === "computer"){
        gameController.computerTurn();
      } else {
        updateTurnText(players[1]);
      }
    } else {
      updateTurnText(players[0]);
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

  return {processPlayerNames, hideSelectWeapon, showGameboard, hideGameboard, updateSquare, updateTurnText, displayGameEnd};
})();








