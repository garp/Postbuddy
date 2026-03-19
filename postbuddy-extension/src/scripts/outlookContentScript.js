import { fixGrammar } from "../api/sendPostRequest";
console.log("Outlook Content Script is running...");


let buttonAppended = false;  

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

function createGrammarButton() {
    if (buttonAppended) {
        return;
    }

    const contentEditableElement = document.querySelectorAll('[contenteditable="true"]')[2];
        if (!contentEditableElement) {
        console.error("Content editable not found!");
        return;
    }

    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      height: 40px;
      width: 100%;
      background: #f6f6f6;
      justify-content: start;
      align-items: center;
      margin-bottom: 10px;
    `;

    // Create the Fix Grammar button
    const fixButton = document.createElement('button');
    fixButton.textContent = "Fix Grammar";
    fixButton.style.cssText = `
      padding: 8px 20px;
      background-color: #251752;
      border: none;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `;

    fixButton.addEventListener("click", async function () {
      if(!token) {
        return console.log("No token found");
      }
      // comment/fixGrammar
      const response = await fixGrammar({ text: contentEditableElement.textContent, token });
      console.log("Response ==> ", response?.data?.data)
      contentEditableElement.textContent = response?.data?.data ?? contentEditableElement.textContent;
    });

    container.appendChild(fixButton);
    contentEditableElement.parentElement.appendChild(container);
    buttonAppended = true;
}
function checkPlatformAndAppend() {
    if (window.location.href.includes("outlook")) {
        createGrammarButton();
    } else if (window.location.href.includes("mail.google.com")) {
        createGrammarButton();
    } else {
        console.log("Unsupported platform detected.");
    }
}

setInterval(() => {
  checkPlatformAndAppend();
}, 1000);
