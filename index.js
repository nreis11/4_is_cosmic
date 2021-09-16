import * as helpers from "./helpers.js";

// Get num input
// Convert to word
// Get length
// Provide length of number until num reaches 4

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
const startBtn = document.getElementById("start-btn");
const answer = document.getElementById("answer");
const status = document.getElementById("status");
const response = document.getElementById("response");

function handleInput(input) {
  // e.preventDefault();
  // let input = document.getElementById("num-input").value;
  let word = "";
  let msg = "";
  let len;
  response.innerHTML = "";

  if (isNaN(input) || input < 0) {
    msg = "That is not a valid number. Please provide a non-negative integer.";
    response.innerHTML = msg;
  } else {
    while (input !== "4") {
      word = helpers.num2word(input);
      console.log(word);
      len = helpers.calculateLength(word);
      msg = `${input} is ${len}`;
      response.innerHTML += `${msg}<br />`;
      speakUtterance(msg);
      input = len.toString();
    }
    msg = `${input} is cosmic!`;
    response.innerHTML += msg;
  }
  speakUtterance(msg, true);
}

function speakUtterance(msg, final = false) {
  let utterance = new SpeechSynthesisUtterance(msg);
  speechSynthesis.speak(utterance);
  if (final) {
    utterance.addEventListener("end", recognition.start.bind(recognition));
  }
}

function parseSpeechResponse(e) {
  recognition.abort();
  const transcript = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("")
    .toLowerCase();

  handleInput(transcript);
}

function toggleAnswer() {
  answer.style.display = "block";
}

function showStatus(start = true) {
  start
    ? (status.style.visibility = "visible")
    : (status.style.visibility = "hidden");
}

function main() {
  startBtn.disabled = true;
  recognition.start();
  recognition.addEventListener("result", parseSpeechResponse);
  // recognition.addEventListener("end", recognition.start);
}

// const form = document.getElementById("input-form");
// form.addEventListener("submit", submitForm);
startBtn.addEventListener("click", main);
answer.addEventListener("click", toggleAnswer);
recognition.addEventListener("start", () => showStatus());
recognition.addEventListener("end", () => showStatus(false));
