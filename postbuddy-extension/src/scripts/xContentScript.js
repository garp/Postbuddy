import sendPostRequest from "../api/sendPostRequest";
import { BASEURL } from "../api/BASEURL";
/*global chrome */

let token = "";
chrome.storage.sync.get(["token"], function (result) {
  if (result.token) {
    token = result.token;
    // console.log("Retrieved token from Chrome storage:", token);
  } else if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
    // console.log("Retrieved token from localStorage:", token);
  } else {
    console.warn("No token found in Chrome storage or localStorage.");
  }
});

(() => {
  const endPoint = `${BASEURL}/comment`;
  console.log("X script loaded");

  let selectedLanguage = "English";
  const languages = {
    English: "English",
    "हिन्दी-अंग्रेज़ी": "Hinglish",
    हिन्दी: "Hindi",
    español: "Spanish",
    français: "French",
    Deutsch: "German",
    עברית: "Hebrew",
    Italiano: "Italian",
    普通话: "Mandarin",
    العربية: "Arabic",
    Português: "Portuguese",
    اردو: "Urdu",
    தமிழ்: "Tamil",
    తెలుగు: "Telugu",
    മലയാളം: "Malayalam",
    ಕನ್ನಡ: "Kannada",
    বাংলা: "Bengali",
    ਪੰਜਾਬੀ: "Punjabi",
    मराठी: "Marathi",
    ગુજરાતી: "Gujarati",
    भोजपुरी: "Bhojpuri",
  };

  // Function to create action buttons
  const createActionButtons = () => {
    // Main container styled similar to LinkedIn/Instagram
    const container = document.createElement("div");
    container.className = "twitter-action-container";
    container.style.cssText = `
      margin-top: 10px;
      padding: 15px;
      background-color: #fff;
      border: 1px solid #dbdbdb;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    `;

    // Create a button container with flexible layout
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = `
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    `;

    // Define action buttons
    const actions = [
      { label: "Like", type: "like" },
      { label: "Dislike", type: "dislike" },
      { label: "Support", type: "support" },
      { label: "Funny", type: "funny" },
      { label: "Thought", type: "thought" },
      { label: "Question", type: "question" },
    ];

    // Create and style each action button
    actions.forEach((action) => {
      const button = document.createElement("button");
      button.innerText = action.label;
      button.style.cssText = `
        padding: 8px 12px;
        border: 1px solid #dbdbdb;
        border-radius: 6px;
        background-color: transparent;
        cursor: pointer;
        transition: background-color 0.2s ease;
        color: #333;
      `;
      button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "#f0f0f0";
      });
      button.addEventListener("mouseout", () => {
        button.style.backgroundColor = "transparent";
      });
      button.addEventListener("click", () => handleActionClick(action.label));
      buttonContainer.appendChild(button);
    });

    // Create language select dropdown styled similarly
    const select = document.createElement("select");
    select.className = "language-dropdown";
    select.style.cssText = `
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #dbdbdb;
      font-size: 14px;
      cursor: pointer;
    `;
    Object.entries(languages).forEach(([nativeName, englishName]) => {
      const option = document.createElement("option");
      option.value = englishName.toLowerCase();
      option.textContent = nativeName;
      select.appendChild(option);
    });
    select.addEventListener("change", (event) => {
      selectedLanguage = event.target.value;
      console.log(`Selected language: ${selectedLanguage}`);
    });

    // Create powered-by text styled to match the updated UI
    const poweredText = document.createElement("p");
    poweredText.textContent = "Powered by PostBuddy";
    poweredText.style.cssText = `
      font-size: 12px;
      color: #999;
      text-align: left;
      margin-top: 5px;
    `;

    // Append the elements in order
    container.appendChild(buttonContainer);
    container.appendChild(select);
    container.appendChild(poweredText);

    return container;
  };

  // Insert action buttons near the reply input field
  const attachActionButtons = () => {
    const toolBars = document.querySelectorAll("[data-testid='toolBar']");
    toolBars.forEach((toolBar) => {
      if (!toolBar.parentNode.querySelector(".twitter-action-container")) {
        const actionContainer = createActionButtons();
        toolBar.parentNode.appendChild(actionContainer);
      }
    });
  };

  const handleActionClick = async (newText) => {
    const replyInputContainer = document.querySelector("div[contenteditable]");
    const tweetText =
      document.querySelector('div[data-testid="tweetText"]')?.textContent ||
      "not available";
    const postBy =
      document.querySelector('[data-testid="User-Name"]')?.textContent ||
      "not available";

    const metaDetails = await getMetaDetials();

    if (replyInputContainer) {
      const data = {
        platform: "x",
        request: newText,
        postBy: postBy,
        postDescription: tweetText,
        languages: selectedLanguage,
        metaDetails: metaDetails,
      };
      console.log("data ==> ", data);

      const res = await sendPostRequest(data, endPoint, token);
      if (res.message === "jwt malformed") {
        res.data = "Please login to use Postbuddy";
      } else if (res.message === "Daily limit reached") {
        res.data = "Daily limit reached. Upgrade your plan";
      }

      // Focus the container to make it ready for input
      replyInputContainer.focus();

      // Try to target the inner text node while preserving structure
      const editableElement = replyInputContainer.querySelector(
        "span[data-text='true']"
      );
      if (editableElement) {
        // Clear existing content
        editableElement.textContent = "";
        // Set the new response text
        editableElement.textContent = res.data;
        // Dispatch events to simulate user input
        const keyboardEvent = new KeyboardEvent("keydown", {
          bubbles: true,
          cancelable: true,
          key: "a",
        });
        replyInputContainer.dispatchEvent(keyboardEvent);
        const inputEvent = new Event("input", {
          bubbles: true,
          cancelable: true,
        });
        replyInputContainer.dispatchEvent(inputEvent);
      } else {
        // Fallback to using paste for the entire container
        const dataTransfer = new DataTransfer();
        dataTransfer.setData("text/plain", res.data);
        const pasteEvent = new ClipboardEvent("paste", {
          clipboardData: dataTransfer,
          bubbles: true,
          cancelable: true,
        });
        replyInputContainer.dispatchEvent(pasteEvent);
      }
    }
  };

  function getMetaDetials() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(
        [
          "wordLimit",
          "nativeButton",
          "toneIntent",
          "replyTone",
          "nativeLanguage",
        ],
        function (result) {
          const metaDetails = {
            wordLimit: result.wordLimit || 50,
            toneIntent: result.toneIntent || "Friendly",
            replyTone: result.replyTone || "No Intent",
            nativeLanguage: result.nativeLanguage || "English",
          };
          resolve(metaDetails);
        }
      );
    });
  }

  // Observe the DOM to detect when the reply input is available
  const observeReplyInput = () => {
    const observer = new MutationObserver(() => {
      attachActionButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  // Initialize the observer
  observeReplyInput();
})();
