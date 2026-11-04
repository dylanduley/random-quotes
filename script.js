const card = document.querySelector(".card");
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const diceButton = document.getElementById("dice");
const copyButton = document.getElementById("copy");
const pips = document.getElementById("pips");

const FACES = [
  [[50, 50]],
  [[30, 30], [70, 70]],
  [[30, 30], [50, 50], [70, 70]],
  [[30, 30], [70, 30], [30, 70], [70, 70]],
  [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
  [[30, 30], [70, 30], [30, 50], [70, 50], [30, 70], [70, 70]],
];

let face = 4;
let deck = [];
let current = null;
let rolling = false;

function drawFace(index) {
  pips.innerHTML = FACES[index]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8"/>`)
    .join("");
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function nextQuote() {
  if (deck.length === 0) {
    deck = shuffle([...QUOTES.keys()]);
    const last = deck.length - 1;
    if (last > 0 && deck[last] === current) {
      [deck[0], deck[last]] = [deck[last], deck[0]];
    }
  }
  current = deck.pop();
  return QUOTES[current];
}

function showQuote({ text, author }) {
  quoteText.textContent = text;
  quoteText.classList.toggle("is-long", text.length > 160);
  quoteAuthor.textContent = author || "";
  quoteAuthor.hidden = !author;
}

function roll() {
  if (rolling) return;
  rolling = true;

  let next;
  do {
    next = Math.floor(Math.random() * 6);
  } while (next === face);
  face = next;

  diceButton.classList.remove("is-rolling");
  void diceButton.offsetWidth;
  diceButton.classList.add("is-rolling");
  setTimeout(() => drawFace(face), 250);

  card.classList.add("is-hidden");
  setTimeout(() => {
    showQuote(nextQuote());
    card.classList.remove("is-hidden");
    rolling = false;
  }, 200);
}

async function copyQuote() {
  const { text, author } = QUOTES[current];
  try {
    await navigator.clipboard.writeText(author ? `"${text}" — ${author}` : text);
    copyButton.textContent = "Copied";
  } catch {
    copyButton.textContent = "Couldn't copy";
  }
  setTimeout(() => (copyButton.textContent = "Copy"), 1500);
}

diceButton.addEventListener("click", roll);
copyButton.addEventListener("click", copyQuote);

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && event.target === document.body) {
    event.preventDefault();
    roll();
  }
});

drawFace(face);
showQuote(nextQuote());
