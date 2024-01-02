let query = (el) => document.querySelector(el);
let all = (el) => document.querySelectorAll(el);

let player = "",
  playerComputer,
  jogando = false,
  jogador = "";
aviso = "";
jogador_P = 0;
jogador_computer = 0;
empate = 0;
fraseAtual = 1;

let caixa = {
  a1: "",
  a2: "",
  a3: "",
  b1: "",
  b2: "",
  b3: "",
  c1: "",
  c2: "",
  c3: "",
};

let frasesJogo = [
  "Seja bem vindo ao nosso jogo da velha",
  "Jogo criado por JrCriações",
  "Siga as proximas instruções",

  "Para iniciar o Jogo",
  " Aperte o botão jogar",
  "Em seguida escolha o jogador",
  "Para resetar aperte o botão resetar ",
  " Escolha o jogador para continuar jogando ",
  "Para finalizar o jogo aperte o botão finalizar",
  "Divirta-se !!!",
];

document.addEventListener("DOMContentLoaded", () => {
  modal();
  playAudio("./src/assets/audio/soloGuitarra.mp3");

  setInterval(() => {
    if (fraseAtual < frasesJogo.length) {
      query(".texto-digitalizado").innerHTML = frasesJogo[fraseAtual];
    }
    fraseAtual++;
  }, 3000);

  setTimeout(() => {
    noModal();
  }, 30000);
});

all(".item").forEach((item) => {
  item.addEventListener("click", (e) => {
    let cx = e.target.getAttribute("data-item");
    if (jogando && caixa[cx] === "") {
      caixa[cx] = player;
      computerMove();
      renderCaixa();
    }
  });
});

query(".p-v").innerHTML = jogador_P;
query(".c-v").innerHTML = jogador_computer;
query(".escolha-jogador").disabled = true;
query(".resetar").disabled = true;
query(".finalizar").disabled = true;

const playGame = () => {
  query(".escolha-jogador").disabled = false;
  query(".finalizar").disabled = false;

  query(".escolha-jogador").addEventListener("change", (e) => {
    let escolha = e.target.value;
    jogando = true;

    if (escolha === "O") {
      player = "O";
      playerComputer = "X";
      query(".escolha-jogador").disabled = true;
    } else if (escolha === "X") {
      player = "X";
      playerComputer = "O";
      query(".escolha-jogador").disabled = true;
    }
  });
};

const resetGame = () => {
  jogando = false;

  for (let i in caixa) {
    caixa[i] = "";
    let item = query(`div[data-item=${i}]`);
    item.innerHTML = "";
    item.classList.remove("computer-color", "player-color", "winner");
    query(".escolha-jogador").value = "";
    query(".escolha-jogador").disabled = false;
    query(".vencedor").innerHTML = "";
    query(".vencedor").style.display = "none";
  }

  query(".jogador_p").innerHTML = player = "";
  query(".jogador_c").innerHTML = playerComputer = "";

  renderInfo();
};
const fimGame = () => {
  location.reload();
};

const renderCaixa = () => {
  for (let i in caixa) {
    let item = query(`div[data-item=${i}]`);
    if (caixa[i] !== "") {
      item.innerHTML = caixa[i];
      if (caixa[i] === player) {
        item.classList.add("player-color");
      } else if (caixa[i] === playerComputer) {
        item.classList.add("computer-color");
      }
    } else {
      item.innerHTML = "";
    }
  }
  winner();
  renderInfo();
};

const renderInfo = () => {
  query(".p-v").innerHTML = jogador_P;
  query(".c-v").innerHTML = jogador_computer;
  query(".empate").innerHTML = empate;
  query(".jogador_p").innerHTML = player;
  query(".jogador_c").innerHTML = playerComputer;
};

const computerMove = () => {
  let computerIndex = Object.keys(caixa).filter((item) => caixa[item] === "");

  if (computerIndex.length > 0) {
    let randomComputer = Math.floor(Math.random() * computerIndex.length);
    let computer = computerIndex[randomComputer];

    caixa[computer] = playerComputer;

    return computer;
  } else {
    return null;
  }
};

const playAudio = (source) => {
  let som = query(".som");
  let somSrc = query(".somItem");

  somSrc.src = source;

  som.load();

  som.play();
};

const winner = () => {
  if (winnerFor(player)) {
    query(".p-v").innerHTML = jogador_P++;
    jogando = false;
    playAudio("./src/assets/audio/som de acerto.mp3");
    query(".vencedor").innerHTML = `Venceu player-${player}`;
    query(".vencedor").style.display = "block";
    query(".resetar").disabled = false;
  } else if (winnerFor(playerComputer)) {
    query(".c-v").innerHTML = jogador_computer++;
    query(".vencedor").innerHTML = `Venceu Computer-${playerComputer}`;
    playAudio("./src/assets/audio/som de acerto.mp3");
    query(".vencedor").style.display = "block";
    query(".resetar").disabled = false;

    jogando = false;
  } else if (isFull()) {
    query(".empate").innerHTML = empate++;
    query(".vencedor").innerHTML = "Empatou";
    playAudio("./src/assets/audio/som de erro.mp3");
    query(".vencedor").style.display = "block";
    jogando = false;
    query(".resetar").disabled = false;
  }
};

const winnerFor = (w) => {
  let pos = [
    "a1,a2,a3",
    "b1,b2,b3",
    "c1,c2,c3",

    "a1,b1,c1",
    "a2,b2,c2",
    "a3,b3,c3",

    "a1,b2,c3",
    "c1,b2,a3",
  ];

  for (let i in pos) {
    let pArray = pos[i].split(",");
    let venceu = pArray.every((option) => caixa[option] === w);
    if (venceu) {
      pArray.forEach((item) => {
        query(`div[data-item=${item}]`).classList.add("winner");
      });
      return true;
    }
  }
  return false;
};

const isFull = () => {
  for (let i in caixa) {
    if (caixa[i] === "") {
      return false;
    }
  }
  return true;
};

const modal = () => {
  query(".modal").style.display = "flex";
  setTimeout(() => {
    query(".conteudo-modal").style.opacity = 1;
  }, 400);
};
const noModal = () => {
  query(".conteudo-modal").style.opacity = 1;

  setTimeout(() => {
    query(".modal").style.display = "none";
  }, 400);
};

query(".modal").addEventListener("click", modal);
query(".jogar").addEventListener("click", playGame);
query(".resetar").addEventListener("click", resetGame);
query(".finalizar").addEventListener("click", fimGame);
