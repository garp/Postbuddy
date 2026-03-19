/* global chrome */
import { chatPostRequest } from "../api/sendPostRequest";
import { BASEURL, FRONTEND_URL } from "../api/BASEURL";
console.log("whatsappScript loaded");

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

function displayErrorMessage(message) {
  // Create error message element
  const errorMessageElement = document.createElement("p");
  errorMessageElement.textContent = message;
  errorMessageElement.style.color = "red";
  errorMessageElement.style.margin = "8px 0";
  errorMessageElement.style.fontSize = "14px";
  errorMessageElement.style.fontWeight = "500";
  errorMessageElement.style.paddingLeft = "10px";
  errorMessageElement.className = "postbuddy-error-message";

  // Add a link to plans page
  if (message === "Your Daily Limit of Postbuddy has been reached.") {
    const planLink = document.createElement("a");
    planLink.href = `${FRONTEND_URL}/plans`;
    planLink.textContent = "Upgrade Now!";
    planLink.target = "_blank";
    planLink.style.color = "#7b2ff7";
    planLink.style.marginLeft = "8px";
    planLink.style.textDecoration = "underline";
    planLink.style.fontWeight = "600";
    errorMessageElement.appendChild(document.createTextNode(" "));
    errorMessageElement.appendChild(planLink);
  }

  // Find parent of input field
  const footer = document.querySelector("footer");

  if (footer) {
    // Remove any existing error message
    const existingError = document.querySelector(".postbuddy-error-message");
    if (existingError) {
      return;
    }
    // Add new error message below input field
    footer.insertBefore(errorMessageElement, footer.lastChild);
  }
}

let endPoint = `${BASEURL}/comment/chat`;

function checkFooter() {
  const footer = document.querySelector("footer");
  footer.style.background = "rgb(32, 44, 51)";
  footer.style.paddingBottom = "0px";
  return footer;
}

function getMetaDetials() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      ["wordLimit", "toneIntent", "replyTone", "brandVoice"],
      function (result) {
        const metaDetails = {
          wordLimit: result.wordLimit || 50,
          toneIntent: result.toneIntent || "Friendly",
          replyTone: result.replyTone || "No Intent",
          brandVoice: result.brandVoice || "",
        };
        resolve(metaDetails);
      }
    );
  });
}

function createChatsArray() {
  const otherUser = document.querySelector('[title="Profile details"]')
    .parentNode.innerText;
  const chats = [];
  const arr = document.querySelector("[role=application]").childNodes;
  arr.forEach((a) => {
    if (a.children[0].childNodes[0].className.split(" ")[0] !== undefined) {
      chats.push({
        user:
          a.children[0].childNodes[0].className.split(" ")[0] === "message-in"
            ? `By ${otherUser}`
            : "By me",
        text: a.textContent,
      });
    }
  });
  return chats;
}

// Function to set text in WhatsApp input
function setWhatsAppText(text) {
  const textMessageDiv = document.querySelector("div[aria-activedescendant]");

  if (textMessageDiv) {
    try {
      textMessageDiv.focus();

      // First select all existing content
      document.execCommand("selectAll", false, null);

      // Then delete the selected content
      // document.execCommand('delete', false, null);

      // Now paste new content
      const pasteEvent = new ClipboardEvent("paste", {
        bubbles: true,
        cancelable: true,
        clipboardData: new DataTransfer(),
      });
      pasteEvent.clipboardData.setData("text/plain", text);
      textMessageDiv.dispatchEvent(pasteEvent);

      return;
    } catch (e) {
      // Fallback method
      textMessageDiv.focus();
      textMessageDiv.innerHTML = text;
      textMessageDiv.dispatchEvent(new InputEvent("input", { bubbles: true }));
    }
  } else {
    console.error("Could not find WhatsApp message input element");
  }
}

async function postbuddyContainer(footer) {
  // Check if PostBuddy container already exists
  const existingContainer = footer.querySelector(
    'input[placeholder="Enter a custom message"]'
  );
  if (existingContainer) {
    return;
  }

  // Create PostBuddy container
  const postBuddyContainer = document.createElement("div");
  postBuddyContainer.className = "postbuddy-container";
  postBuddyContainer.style.cssText = `background-color: rgb(32, 44, 51); 
      border-radius: 8px; 
      padding: 10px; 
      margin: 10px; 
      box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
      border: 1px solid #111b21;
      `;

  // Create input field
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.placeholder = "Enter a custom message";
  inputField.style.cssText = `width: 100%; 
      padding: 8px; 
      margin-bottom: 10px; 
      border: 0px solid rgb(204, 204, 204); 
      border-radius: 7px; 
      box-sizing: border-box;
      outline: none;
      background-color: #2a3942;
      color: white;
      `;

  // Create language dropdown
  const languageSelect = document.createElement("select");
  languageSelect.style.cssText = `width: 100%; 
      padding: 8px; 
      margin-bottom: 10px; 
      border: 0px solid #111b21; 
      border-radius: 7px;
      background-color: #2a3942;
      color: white;
      outline: none;
      `;
  const defaultOption = document.createElement("option");
  defaultOption.text = "Select Language";
  languageSelect.appendChild(defaultOption);

  // Add some common languages
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Hindi",
  ];
  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang.toLowerCase();
    option.text = lang;
    languageSelect.appendChild(option);
  });

  const selectError = document.createElement("p");
  selectError.style.cssText =
    "color: #ff4444; font-size: 12px; margin-top: -8px; margin-bottom: 10px; display: none;";

  const actionContainer = document.createElement("div");
  actionContainer.style.cssText = "display: flex; gap: 5px;";

  const translateButton = document.createElement("button");
  translateButton.innerText = "Translate";
  translateButton.style.cssText =
    "background-color: #00a075; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;";

  translateButton.addEventListener("click", async () => {
    if (!languageSelect.value || languageSelect.value === "Select Language") {
      selectError.textContent = "Please select a language first";
      selectError.style.display = "block";
      return;
    } else {
      selectError.style.display = "none";
    }

    // Show loading state
    translateButton.innerText = "Translating...";
    translateButton.disabled = true;

    try {
      const textMessageDiv = document.querySelectorAll(
        'div[contenteditable="true"]'
      )[1];

      const metaDetails = await getMetaDetials();
      const data = {
        text: textMessageDiv?.textContent || "",
        type: "translate",
        language: languageSelect.value,
        metaDetails: metaDetails,
      };

      const response = await chatPostRequest(data, endPoint, token);

      if (response?.data?.data) {
        setWhatsAppText(response.data.data);
      }
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      // Reset button state
      translateButton.innerText = "Translate";
      translateButton.disabled = false;
    }
  });

  const grammarButton = document.createElement("button");
  grammarButton.innerText = "Check Grammar";
  grammarButton.style.cssText =
    "background-color: #00a075; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;";

  grammarButton.addEventListener("click", async () => {
    // Show loading state
    grammarButton.innerText = "Checking...";
    grammarButton.disabled = true;

    try {
      const textMessageDiv = document.querySelectorAll(
        'div[contenteditable="true"]'
      )[1];

      const metaDetails = await getMetaDetials();

      const data = {
        text: textMessageDiv?.textContent || "",
        type: "grammar",
        metaDetails: metaDetails,
      };

      const response = await chatPostRequest(data, endPoint, token);

      if (response?.data?.data) {
        setWhatsAppText(response.data.data);
      }
    } catch (error) {
      console.error("Grammar check error:", error);
    } finally {
      // Reset button state
      grammarButton.innerText = "Check Grammar";
      grammarButton.disabled = false;
    }
  });

  const generateButton = document.createElement("button");
  generateButton.innerText = "Generate";
  generateButton.style.cssText =
    "background-color: #00a075; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;";

  generateButton.addEventListener("click", async () => {
    const chats = createChatsArray();
    // Show loading state
    generateButton.innerText = "Generating...";
    generateButton.disabled = true;

    try {
      const metaDetails = await getMetaDetials();
      const data = {
        chats: chats,
        message: inputField.value,
        type: "generate",
        platform: "whatsapp",
        metaDetails: metaDetails,
      };
      const response = await chatPostRequest(data, endPoint, token);
      console.log(response);
      if (
        response?.error &&
        response?.error?.message === "Daily limit reached"
      ) {
        displayErrorMessage("Your Daily Limit of Postbuddy has been reached.");
        return;
      } else if (
        response?.error &&
        response?.error?.message === "jwt malformed"
      ) {
        displayErrorMessage("Please login to use Postbuddy");
        return;
      }

      if (response?.data?.data) {
        setWhatsAppText(response?.data?.data);
        inputField.value = "";
      }
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      // Reset button state
      generateButton.innerText = "Generate";
      generateButton.disabled = false;
    }
  });

  // Add buttons to action container
  actionContainer.appendChild(translateButton);
  actionContainer.appendChild(grammarButton);
  actionContainer.appendChild(generateButton);

  // Create powered by text
  const poweredBy = document.createElement("div");
  poweredBy.innerText = "Powered-by PostBuddy.ai";
  poweredBy.style.cssText =
    "color: #777; font-size: 11px; margin-top: 10px; text-align: left;";

  // Add all elements to container
  postBuddyContainer.appendChild(inputField);
  postBuddyContainer.appendChild(languageSelect);
  postBuddyContainer.appendChild(selectError);
  postBuddyContainer.appendChild(actionContainer);
  postBuddyContainer.appendChild(poweredBy);

  // Insert container into footer's first child
  if (footer.children.length > 0) {
    footer.appendChild(postBuddyContainer);
  }
}
const getStorage = (keys) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, resolve);
  });
};

async function whatsAppEnabled(callback) {
  
  chrome.storage.sync.get(["enabledPlatforms"], function (result) {
    let enabledPlatforms = result.enabledPlatforms || [];
    if (enabledPlatforms.includes("whatsapp")) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

setInterval(() => {
  whatsAppEnabled(async (check) => {
    const result = await getStorage(["isEnabled"]);
    const isEnabled = result.isEnabled !== undefined ? result.isEnabled : true;
    if (!check || !isEnabled) {
      console.log("WhatsApp is not enabled");
      return;
    }
    const footer = checkFooter();
    if (footer) {
      postbuddyContainer(footer);
    }
  });
}, 1000);
