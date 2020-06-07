//variables
let dieRollTimes = 0;
let dieRoll = 6;
let turnWho = 1;
let lockedA = 2;
let lockedB = 2;
let wonA = 0;
let wonB = 0;
let isMoveOver = true;
let nCells = 8;
let locked = { A1: true, A2: true, B1: true, B2: true };
let won = { A1: false, A2: false, B1: false, B2: false };

let A1 = { x: undefined, y: undefined };
let A2 = { x: undefined, y: undefined };
let B1 = { x: undefined, y: undefined };
let B2 = { x: undefined, y: undefined };

let moveSound = new Audio("audio/move.mp3");
let noMoveSound = new Audio("audio/no-move.mp3");
let lockSound = new Audio("audio/lock.mp3");
let winSound = new Audio("audio/win.mp3");
let winnerSound = new Audio("audio/winner.mp3");

initialize();

function handleClick(token, num, id) {
  if (!isMoveOver) move(token, num, id);
}

document.getElementById("roll").addEventListener("click", rollDie);
document.getElementById("dieval-form").addEventListener("submit", (event) => {
  event.preventDefault();
  rollDie("manual", parseInt(document.getElementById("dieval").value));
});
document.getElementById("play-again").addEventListener("click", initialize);
document
  .getElementById("change-rows-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    //clear board
    let board = document.getElementById("main");
    let child = board.lastElementChild;
    while (child) {
      board.removeChild(child);
      child = board.lastElementChild;
    }

    nCells = document.getElementById("change-rows-input").value;
    initialize();
  });

function initialize() {
  createBoard();

  let tokenElement = document.getElementById("A1");
  tokenElement && tokenElement.parentNode.removeChild(tokenElement);
  tokenElement = document.getElementById("A2");
  tokenElement && tokenElement.parentNode.removeChild(tokenElement);
  tokenElement = document.getElementById("B1");
  tokenElement && tokenElement.parentNode.removeChild(tokenElement);
  tokenElement = document.getElementById("B2");
  tokenElement && tokenElement.parentNode.removeChild(tokenElement);

  dieRollTimes = 0;
  dieRoll = 6;
  turnWho = 1;
  lockedA = 2;
  lockedB = 2;
  wonA = 0;
  wonB = 0;
  isMoveOver = true;
  locked = { A1: true, A2: true, B1: true, B2: true };
  won = { A1: false, A2: false, B1: false, B2: false };

  A1 = { x: undefined, y: undefined };
  A2 = { x: undefined, y: undefined };
  B1 = { x: undefined, y: undefined };
  B2 = { x: undefined, y: undefined };

  const playerA1 = createToken("player-A", "A1");
  document.getElementById("player-A").appendChild(playerA1);
  const playerA2 = createToken("player-A", "A2");
  document.getElementById("player-A").appendChild(playerA2);
  const playerB1 = createToken("player-B", "B1");
  document.getElementById("player-B").appendChild(playerB1);
  const playerB2 = createToken("player-B", "B2");
  document.getElementById("player-B").appendChild(playerB2);

  document.getElementById("A1").addEventListener("click", () => {
    handleClick(A1, dieRoll, "A1");
  });
  document.getElementById("A2").addEventListener("click", () => {
    handleClick(A2, dieRoll, "A2");
  });
  document.getElementById("B1").addEventListener("click", () => {
    handleClick(B1, dieRoll, "B1");
  });
  document.getElementById("B2").addEventListener("click", () => {
    handleClick(B2, dieRoll, "B2");
  });

  document.getElementById("roll").disabled = false;
  document.getElementById("test-roll").disabled = false;
  document.getElementById("roll").classList.remove("disabled-button");
  document.getElementById("test-roll").classList.remove("disabled-button");
  document.getElementById("game-status").textContent = "'s turn";
  document.getElementById("player-name").textContent = "Player-A";
  document.querySelector(".player-name").classList.remove("emphasis-winner");
}

function createCell(type) {
  const cell = document.createElement("div");
  cell.className = "cell";
  const block = document.createElement("div");
  block.className = "block";
  type && (block.className += " " + type);
  cell.appendChild(block);
  return cell;
}

function createBoard() {
  //top row
  const topRow = document.createElement("div");
  for (let i = 0; i < nCells; i++) {
    if (i === 0) topRow.appendChild(createCell("A-start"));
    else topRow.appendChild(createCell());
  }
  document.getElementById("main").appendChild(topRow);
  //middle rows
  for (let i = 1; i < nCells - 1; i++) {
    const row = document.createElement("div");
    if (i === 1) row.appendChild(createCell("A-end"));
    else row.appendChild(createCell());
    for (let j = 1; j < nCells - 1; j++) row.appendChild(createCell("empty"));
    if (i === nCells - 2) row.appendChild(createCell("B-end"));
    else row.appendChild(createCell());
    document.getElementById("main").appendChild(row);
  }
  //last row
  const lastRow = document.createElement("div");
  for (let i = 0; i < nCells; i++) {
    if (i === nCells - 1) lastRow.appendChild(createCell("B-start"));
    else lastRow.appendChild(createCell());
  }
  document.getElementById("main").appendChild(lastRow);
}

function createToken(player, id) {
  const token = document.createElement("div");
  token.className = "token";
  token.id = id;
  token.innerHTML = `<div class="token">
    <div class="token-outside token-${player}">
      <div class="token-inside token-${player}">
      </div>
    </div> 
  </div>`;
  return token;
}

function randomDie() {
  return Math.ceil(Math.random() * 6);
}

function rollDie(type, value) {
  if (!isMoveOver) return;
  if (type === "manual" && dieRollTimes === 10) dieRoll = value;
  else dieRoll = randomDie();
  document.getElementById("die").textContent = dieRoll;
  if (dieRollTimes === 10) {
    isMoveOver = false;
    dieRollTimes = 0;
    turn();
    return;
  }
  dieRollTimes++;
  setTimeout(() => {
    rollDie(type, value);
  }, 50);
}

function turn() {
  if (turnWho === 1) {
    if (dieRoll === 6) {
      if (lockedA === 2) {
        start(A1, "A1");
      } else if (lockedA === 1 && wonA === 1) {
        if (locked.A1) {
          start(A1, "A1");
        } else {
          start(A2, "A2");
        }
      }
    } else {
      if ((lockedA === 1 && wonA === 0) || (lockedA === 0 && wonA === 1)) {
        if (!locked.A1 && !won.A1) {
          move(A1, dieRoll, "A1");
        } else {
          move(A2, dieRoll, "A2");
        }
      } else if (lockedA === 2 || (lockedA === 1 && wonA === 1)) {
        turnWho = 2;
        document.getElementById("player-name").textContent = "Player-B";
        isMoveOver = true;
        noMoveSound.play();
      } else if (lockedA === 0 && A1.x === A2.x && A1.y === A2.y) {
        move(A1, dieRoll, "A1");
        scaleFix(A2, "A2");
      }
    }
  } else if (turnWho === 2) {
    if (dieRoll === 6) {
      if (lockedB === 2) {
        start(B1, "B1");
      } else if (lockedB === 1 && wonB === 1) {
        if (locked.B1) {
          start(B1, "B1");
        } else {
          start(B2, "B2");
        }
      }
    } else {
      if ((lockedB === 1 && wonB === 0) || (lockedB === 0 && wonB === 1)) {
        if (!locked.B1 && !won.B1) {
          move(B1, dieRoll, "B1");
        } else {
          move(B2, dieRoll, "B2");
        }
      } else if (lockedB === 2 || (lockedB === 1 && wonB === 1)) {
        turnWho = 1;
        document.getElementById("player-name").textContent = "Player-A";
        isMoveOver = true;
        noMoveSound.play();
      } else if (lockedB === 0 && B1.x === B2.x && B1.y === B2.y) {
        move(B1, dieRoll, "B1");
        scaleFix(B2, "B2");
      }
    }
  }
}

function start(token, id) {
  if (id === "A1" || id === "A2") {
    const playerATokens = document.getElementById("player-A");
    playerATokens.removeChild(document.getElementById(id));
    if (id === "A1") {
      playerA = createToken("player-A", "A1");
      locked.A1 = false;
    } else if (id === "A2") {
      playerA = createToken("player-A", "A2");
      locked.A2 = false;
    }
    playerA.setAttribute("style", "position: absolute; top: 0; left: 0;");
    document.getElementById("main").appendChild(playerA);
    token.x = 0;
    token.y = 0;
    document.getElementById("A1").addEventListener("click", () => {
      handleClick(A1, dieRoll, "A1");
    });
    document.getElementById("A2").addEventListener("click", () => {
      handleClick(A2, dieRoll, "A2");
    });
    lockedA--;
  } else if (id === "B1" || id === "B2") {
    const playerBTokens = document.getElementById("player-B");
    playerBTokens.removeChild(document.getElementById(id));
    if (id === "B1") {
      playerB = createToken("player-B", "B1");
      locked.B1 = false;
    } else if (id === "B2") {
      playerB = createToken("player-B", "B2");
      locked.B2 = false;
    }
    playerB.setAttribute(
      "style",
      `position: absolute; top: 0; left: 0; transform: translate(${
        (nCells - 1) * 100
      }%, ${(nCells - 1) * 100}%);`
    );
    document.getElementById("main").appendChild(playerB);
    token.x = nCells - 1;
    token.y = nCells - 1;
    document.getElementById("B1").addEventListener("click", () => {
      handleClick(B1, dieRoll, "B1");
    });
    document.getElementById("B2").addEventListener("click", () => {
      handleClick(B2, dieRoll, "B2");
    });
    lockedB--;
  }
  isMoveOver = true;
  moveSound.play();
  turnChange();
}

function move(token, num, id) {
  if (!((id[0] === "A" && turnWho === 1) || (id[0] === "B" && turnWho === 2))) {
    return;
  }
  if (token.x === undefined) {
    start(token, id);
    return;
  }
  old = { ...token };
  for (let i = 0; i < num; i++) {
    if (token.x === 0 && token.y !== 0) token.y--;
    else if (token.x === nCells - 1 && token.y !== nCells - 1) token.y++;
    else if (token.x !== 0 && token.y === nCells - 1) token.x--;
    else if (token.x !== nCells - 1 && token.y === 0) token.x++;
    moveInBoard(token, id, i);
    if (
      (id[0] === "A" && token.x === 0 && token.y === 1) ||
      (id[0] === "B" && token.x === nCells - 1 && token.y === nCells - 2)
    ) {
      tokenWin(token, id);
      isMoveOver = true;
      turnChange();
      return;
    }
  }
  if (id[0] === "A") {
    if (
      (id === "A1" && token.x === A2.x && token.y === A2.y) ||
      (id === "A2" && token.x === A1.x && token.y === A1.y)
    )
      separateDisplay(token, "A");
    if (token.x === B1.x && token.y === B1.y) lock(B1, "B1");
    if (token.x === B2.x && token.y === B2.y) lock(B2, "B2");
  } else if (id[0] === "B") {
    if (
      (id === "B1" && token.x === B2.x && token.y === B2.y) ||
      (id === "B2" && token.x === B1.x && token.y === B1.y)
    )
      separateDisplay(token, "B");
    if (token.x === A1.x && token.y === A1.y) lock(A1, "A1");
    if (token.x === A2.x && token.y === A2.y) lock(A2, "A2");
  }
  isMoveOver = true;
  moveSound.play();
  turnChange();
}

function separateDisplay(token, id) {
  if (id === "A") {
    document.getElementById("A1").style.transform = `translateX(${
      100 * token.x - 10
    }%) translateY(${100 * token.y - 10}%) scale(0.8)`;
    document.getElementById("A2").style.transform = `translateX(${
      100 * token.x + 10
    }%) translateY(${100 * token.y + 10}%) scale(0.8)`;
  } else if (id === "B") {
    document.getElementById("B1").style.transform = `translateX(${
      100 * token.x - 10
    }%) translateY(${100 * token.y - 10}%) scale(0.8)`;
    document.getElementById("B2").style.transform = `translateX(${
      100 * token.x + 10
    }%) translateY(${100 * token.y + 10}%) scale(0.8)`;
  }
}

function turnChange() {
  if (dieRoll === 6) return;
  if (turnWho === 1) {
    turnWho = 2;
    document.getElementById("player-name").textContent = "Player-B";
  } else if (turnWho === 2) {
    turnWho = 1;
    document.getElementById("player-name").textContent = "Player-A";
  }
}

function moveInBoard(token, id, i) {
  const copy = {...token}
  setTimeout(() => {
    document.getElementById(id).style.transform = `translateX(${
      100 * copy.x
    }%) translateY(${100 * copy.y}%)`;
  }, 200*i);
}

function lock(token, id) {
  let element = document.getElementById(id);
  element.parentNode.removeChild(element);
  token.x = undefined;
  token.y = undefined;
  locked[id] = true;
  const player = createToken("player-" + id[0], id);
  document.getElementById("player-" + id[0]).appendChild(player);
  if (id[0] === "A") lockedA++;
  else if (id[0] === "B") lockedB++;
  lockSound.play();
}

function tokenWin(token, id) {
  let element = document.getElementById(id);
  element.parentNode.removeChild(element);
  token.x = undefined;
  token.y = undefined;
  won[id] = true;
  const player = createToken("player-" + id[0], id);
  document.getElementById("winner").appendChild(player);
  if (id[0] === "A") {
    wonA++;
    if (wonA === 2) gameWin("A");
  } else if (id[0] === "B") {
    wonB++;
    if (wonB === 2) gameWin("B");
  }
  winSound.play();
}

function gameWin(id) {
  document.getElementById("roll").disabled = true;
  document.getElementById("test-roll").disabled = true;
  document.getElementById("roll").className += " disabled-button";
  document.getElementById("test-roll").className += " disabled-button";
  document.getElementById("game-status").textContent = " wins!!!";
  if (id === "A") {
    document.getElementById("player-name").textContent = "Player-A";
  } else if (id === "B") {
    document.getElementById("player-name").textContent = "Player-B";
  }
  document.querySelector(".player-name").className += " emphasis-winner";
  winnerSound.play();
}

function scaleFix(token, id) {
  document.getElementById(id).style.transform = `translateX(${
    100 * token.x
  }%) translateY(${100 * token.y}%)`;
}
