/* global chrome */
import { botPostRequest } from "../api/sendPostRequest";

let selectedText = "";

let token = "";
chrome.storage.sync.get(["token"], function (result) {
  if (result.token) {
    token = result.token;
  } else if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  } else {
    console.warn("No token found in Chrome storage or localStorage.");
  }
});

document.addEventListener('mouseup', function () {
  const text = window.getSelection().toString();
  selectedText = text
  if (text) {
    console.log("Selected Text: ", selectedText);
  }
});

export default function BotIcon() {
  const floatingButton = document.createElement("div");
  floatingButton.id = "floating-bot";
  floatingButton.innerHTML = `
  <img src="https://postbuddy.ai/favicon.ico" width="50" />`;
  floatingButton.title = "Click to Open Bot";
  floatingButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: none;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  `;

  floatingButton.addEventListener("click", () => {
    toggleBotContainer();
  });

  document.body.appendChild(floatingButton);
}

export function toggleBotContainer() {
  let container = document.querySelector(".bot-container-premium-features");

  if (container) {
    container.style.display =
      container.style.display === "none" ? "block" : "none";
  } else {
    createBotContainer();
  }
}

function createBotContainer() {
  const actions = [
    { icon: "🔥", work: "Check the virality score of this comment", request: "predict virality score" },
    { icon: "🧾", work: "Summarize this comment", request: "summarize the text" },
    { icon: "🖊️", work: "Rephrase this comment", request: "rephrase this text" },
  ];

  const lastAction = {
    type: "",
    text: ""
  }

  const container = document.createElement("div");
  container.className = "bot-container-premium-features";
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 0px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 315px;
    padding: 10px;
    z-index: 1000;
    transform: translateX(-100px);
  `;

  const resultDiv = document.createElement("textarea");
  resultDiv.cols = "5"
  resultDiv.id = "bot-result-div";
  resultDiv.placeholder = "Generated text";
  resultDiv.style.cssText = `
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    margin-top: 8px;
    font-size: 14px;
    color: #333;
    height: 150px !important;
    display: none;
    width: 90%;
    resize: vertical;
    max-width: 90%;
  `;

  const copyBtn = document.createElement('button');
  copyBtn.id = "copy-premium-button";
  copyBtn.textContent = "Copy";
  copyBtn.style.cssText = `
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-color: #be7ef2;
    color:#fff;
    margin-right: 5px;
  `
  copyBtn.addEventListener('click', () => {
    if (resultDiv.style.display !== 'none' && resultDiv.value.trim()) {
      navigator.clipboard.writeText(resultDiv.value)
        .then(() => {
          copyBtn.textContent = "Copied!";
          setTimeout(() => copyBtn.textContent = "Copy", 1500);
        })
        .catch(err => {
          console.error("Failed to copy: ", err);
        });
    }
  });

  const retryBtn = document.createElement('button');
  retryBtn.id = "retry-premium-button";
  retryBtn.textContent = "Retry";
  retryBtn.style.cssText = `
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-color: #be7ef2;
    color:#fff;
  `
  retryBtn.addEventListener('click', async () => {
    if (resultDiv.style.display !== 'none') {
      if (selectedText === "") {
        resultDiv.value = "Please select some text first.";
        return;
      }
      resultDiv.value = "Loading...";
      if (lastAction.type) {
        const res = await performFunction(selectedText, lastAction.type);
        resultDiv.value = res.data || "No response";
      } else {
        resultDiv.value = "Please select an action first.";
      }
    }
  });

  const buttonBox = document.createElement('div');
  buttonBox.className = "extra-button-actions";
  buttonBox.style.cssText = `
    margin-top: 10px;
    display: none;
    justify-content: flex-start;
    width: 100%;
  `;

  buttonBox.appendChild(copyBtn);
  buttonBox.appendChild(retryBtn);

  actions.forEach((element) => {
    const button = document.createElement("button");
    button.className = "premium-button";
    button.style.cssText = `
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  font-size: 14px;
  transition: background 0.2s;
  `;
    button.innerHTML = `${element.icon} ${element.work} `;

    button.addEventListener("mouseover", () => {
      button.style.backgroundColor = "#f0f0f0";
    });

    button.addEventListener("mouseout", () => {
      button.style.backgroundColor = "white";
    });

    button.addEventListener("click", async () => {
      selectedText = selectedText;
      resultDiv.style.display = "block";
      buttonBox.style.display = "flex";
      resultDiv.value = "Generating...";

      if (selectedText.trim() === "") {
        resultDiv.value = "Please select some text first.";
        return;
      }

      const res = await performFunction(selectedText, element.request);
      lastAction.type = element.request;
      lastAction.text = selectedText;
      resultDiv.value = res.data || "No response";
    });

    container.appendChild(button);
  });

  container.appendChild(resultDiv);
  container.appendChild(buttonBox)
  document.body.appendChild(container);
}

export async function performFunction(text, request) {
  const data = {
    text,
    request,
  };
  // const endPoint = "http://localhost:4001/api/v1/comment/bot";
  const endPoint = "https://api.postbuddy.ai/api/v1/comment/bot"
  let res = await botPostRequest(data, endPoint, token);
  if (res.message === "jwt malformed" || res.message === "User not found") {
    res.data = "Please login to use Postbuddy";
  } else if (res.message === "Daily limit reached") {
    res.data = "Daily limit reached. Upgrade your plan";
  }
  return res;
}
