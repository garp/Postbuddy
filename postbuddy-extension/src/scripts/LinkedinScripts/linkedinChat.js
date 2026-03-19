/*global chrome*/
import { chatPostRequest } from "../../api/sendPostRequest";
// import { addRecreateButtonToFeed } from "./recreatePost";
import { BASEURL, FRONTEND_URL } from "../../api/BASEURL";

let activeInputField = null;
let activeContainer = null;
let token = "";

// Helper function to display error messages
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
  const inputField = document.querySelector(
    ".msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate"
  );
  
  if (inputField && inputField.parentElement) {
    // Remove any existing error message
    const existingError = document.querySelector(".postbuddy-error-message");
    if (existingError) {
      return;
    }
    // Add new error message below input field
    inputField.parentElement.parentElement.parentElement.insertBefore(errorMessageElement, inputField.parentElement.parentElement.parentElement.firstElementChild.nextSibling);
  }
}

// Safe trim function to prevent TypeError
function safeTrim(text) {
  if (typeof text === 'string') {
    return text.trim();
  }
  return text;
}

chrome.storage.sync.get(["token"], function (result) {
  if (result.token) {
    token = result.token;
  } else if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  } else {
    console.warn("No token found in Chrome storage or localStorage.");
  }
});

let endPoint = `${BASEURL}/comment/chat`;

function getMetaDetails() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      [
        "wordLimit",
        "nativeButton",
        "toneIntent",
        "replyTone",
        "nativeLanguage",
        "brandVoice",
      ],
      function (result) {
        const metaDetails = {
          wordLimit: result.wordLimit || 50,
          toneIntent: result.toneIntent || "Friendly",
          replyTone: result.replyTone || "No Intent",
          nativeLanguage: result.nativeLanguage || "English",
          brandVoice: result.brandVoice || "",
        };
        resolve(metaDetails);
      }
    );
  });
}

export async function addContainer() {
  document.querySelector(
    ".msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate"
  ).style.minHeight = "0px";
  // Check if container already exists
  if (document.querySelector(".postbuddy-chat-container")) {
    return;
  }

  const container = document.createElement("div");
  container.className = "postbuddy-chat-container";
  container.style.backgroundColor = "white";
  container.style.border = "1px solid #e0e0e0";
  container.style.padding = "16px";
  container.style.borderRadius = "8px";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.margin = "0 12px";
  container.style.maxWidth = "100%";

  // Action buttons container (Job, Marketing, Post buddy)
  const actionButtonsContainer = document.createElement("div");
  actionButtonsContainer.className = "postbuddy-action-buttons";
  actionButtonsContainer.style.display = "flex";
  actionButtonsContainer.style.flexWrap = "wrap";
  actionButtonsContainer.style.gap = "8px";
  actionButtonsContainer.style.marginBottom = "16px";
  container.appendChild(actionButtonsContainer);

  // Create action buttons from chrome.storage.sync
  chrome.storage.sync.get(["customActions"], function (result) {
    const savedButtons = result.customActions || [];
    savedButtons.forEach(createAndAppendButton);
  });

  // Helper function to create and append button
  function createAndAppendButton(btn) {
    const button = document.createElement("button");
    button.textContent = btn.name;
    button.style.backgroundColor = btn.color || "#333";
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "20px";
    button.style.padding = "6px 12px";
    button.style.cursor = "pointer";
    button.style.fontSize = "14px";
    button.type = "button";

    button.addEventListener("click", async () => {
      const otherUser =
        document.querySelector(
          '[data-jump-link-target="thread-detail-jump-target"]'
        )?.innerText || "User";

      const generateBtn = document.getElementById(
        "postbuddy-chat-generate-btn"
      );
      if (generateBtn) {
        generateBtn.textContent = "Generating...";
        generateBtn.disabled = true;
      }

      await handleLinkedInChats(otherUser, btn.prompt || btn.name);

      if (generateBtn) {
        generateBtn.textContent = "Generate";
        generateBtn.disabled = false;
      }
    });

    actionButtonsContainer.appendChild(button);
  }

  // Bottom controls container
  const controlsContainer = document.createElement("div");
  controlsContainer.style.display = "flex";
  controlsContainer.style.alignItems = "center";
  controlsContainer.style.gap = "8px";
  container.appendChild(controlsContainer);

  // Create language + translate combo container
  const langTranslateContainer = document.createElement("div");
  langTranslateContainer.style.display = "flex";
  langTranslateContainer.style.border = "1px solid #e0e0e0";
  langTranslateContainer.style.borderRadius = "4px";
  langTranslateContainer.style.overflow = "hidden";

  // Language selector part
  const languageContainer = document.createElement("div");
  languageContainer.style.display = "flex";
  languageContainer.style.alignItems = "center";
  languageContainer.style.padding = "4px 4px";
  languageContainer.style.position = "relative";
  languageContainer.style.backgroundColor = "#fff";
  languageContainer.style.borderRight = "1px solid #e0e0e0";

  const languageLabel = document.createElement("span");
  languageLabel.textContent = "EN";
  languageLabel.style.marginRight = "8px";
  languageLabel.style.fontWeight = "500";

  const languageArrow = document.createElement("span");
  languageArrow.innerHTML = "&#9662;"; // Down arrow symbol

  languageContainer.appendChild(languageLabel);
  languageContainer.appendChild(languageArrow);

  // Hidden language selector
  const languageSelector = document.createElement("select");
  languageSelector.id = "postbuddy-language-selector";
  languageSelector.style.position = "absolute";
  languageSelector.style.opacity = "0";
  languageSelector.style.width = "100%";
  languageSelector.style.height = "100%";
  languageSelector.style.left = "0";
  languageSelector.style.top = "0";
  languageSelector.style.cursor = "pointer";
  languageSelector.style.zIndex = "1";

  // Add languages from the languages object
  const languages = {
    English: "English",
    "हिन्दी-अंग्रे़ी": "Hinglish",
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

  // Add a default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "English";
  defaultOption.text = "EN";
  defaultOption.selected = true;
  languageSelector.appendChild(defaultOption);

  // Add language options
  Object.entries(languages).forEach(([key, value]) => {
    if (key !== "English") {
      // Skip English as it's already the default
      const option = document.createElement("option");
      option.value = value;
      option.text = key;
      languageSelector.appendChild(option);
    }
  });

  languageContainer.appendChild(languageSelector);

  // Update the label when language changes
  languageSelector.addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];
    languageLabel.textContent = selectedOption.text
      .substring(0, 2)
      .toUpperCase();
  });

  // Translate button part of the combo
  const translateBtn = document.createElement("button");
  translateBtn.id = "postbuddy-chat-translate-btn";
  translateBtn.textContent = "Translate";
  translateBtn.style.backgroundColor = "#f1f0f5";
  translateBtn.style.color = "#333";
  translateBtn.style.border = "none";
  translateBtn.style.padding = "4px 4px";
  translateBtn.style.cursor = "pointer";
  translateBtn.style.fontSize = "14px";
  translateBtn.style.fontWeight = "500";
  translateBtn.style.position = "relative";
  translateBtn.style.zIndex = "2";

  // Add them to the combo container
  langTranslateContainer.appendChild(languageContainer);
  langTranslateContainer.appendChild(translateBtn);

  // Check Grammar button with modern style
  const checkGrammarBtn = document.createElement("button");
  checkGrammarBtn.id = "postbuddy-chat-check-grammar-btn";
  checkGrammarBtn.textContent = "Check Grammar";
  checkGrammarBtn.style.backgroundColor = "#f7f7f7";
  checkGrammarBtn.style.color = "#333";
  checkGrammarBtn.style.border = "1px solid #e0e0e0";
  checkGrammarBtn.style.borderRadius = "4px";
  checkGrammarBtn.style.padding = "6px 4px";
  checkGrammarBtn.style.cursor = "pointer";
  checkGrammarBtn.style.fontSize = "14px";
  checkGrammarBtn.style.flex = "1";
  checkGrammarBtn.style.position = "relative";
  checkGrammarBtn.style.zIndex = "2";

  // Generate button with modern style
  const generateBtn = document.createElement("button");
  generateBtn.id = "postbuddy-chat-generate-btn";
  generateBtn.innerHTML = "<span style='margin-right:4px;'>✨</span>Generate";
  generateBtn.style.backgroundColor = "#7b2ff7";
  generateBtn.style.color = "#fff";
  generateBtn.style.border = "none";
  generateBtn.style.borderRadius = "4px";
  generateBtn.style.padding = "6px 4px";
  generateBtn.style.cursor = "pointer";
  generateBtn.style.fontSize = "14px";
  generateBtn.style.flex = "1";
  generateBtn.style.position = "relative";
  generateBtn.style.zIndex = "2";

  // Add event listeners
  const textAction = document.querySelector('[contenteditable="true"]');

  translateBtn.addEventListener("click", async () => {
    if (!languageSelector.value) {
      alert("Please select a language first");
      return;
    }

    translateBtn.textContent = "Translating...";
    translateBtn.disabled = true;

    const text = textAction.innerText;

    const metaDetails = await getMetaDetails();

    const data = {
      text: text,
      type: "translate",
      language: languageSelector.value,
      metaDetails: metaDetails,
      platform: "linkedin",
    };

    try {
      const response = await chatPostRequest(data, endPoint, token);

      let responseText = "";
      if (response?.error  &&
        response?.error?.message === "Daily limit reached"
      ) {
        displayErrorMessage("Your Daily Limit of Postbuddy has been reached.");
        responseText = "";
      } else if (response?.error?.message === "jwt malformed") {
        displayErrorMessage("Please login to use Postbuddy");
        responseText = "";
      } else if (response?.error?.message === "No token found") {
        displayErrorMessage("Please login to use Postbuddy");
        responseText = "";
      } else {
        responseText = response?.data?.data;
      }
      
      const activeInputField = document.querySelector('[contenteditable="true"]');

      if (activeInputField && responseText) {
        document.querySelector(
          ".msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate"
        ).textContent = "";
        activeInputField.innerHTML = "";

        // Create p element with black text
        const pElement = document.createElement("p");
        pElement.style.color = "#000000";
        pElement.textContent = safeTrim(responseText).replace(/Write a message...\.u/g, "");

        // Add to input field
        activeInputField.appendChild(pElement);

        // Dispatch input event to trigger LinkedIn's message field update
        const event = new Event("input", { bubbles: true });
        activeInputField.dispatchEvent(event);
      }
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      translateBtn.textContent = "Translate";
      translateBtn.disabled = false;
    }
  });

  checkGrammarBtn.addEventListener("click", async () => {
    checkGrammarBtn.textContent = "Checking...";
    checkGrammarBtn.disabled = true;

    const metaDetails = await getMetaDetails();

    const data = {
      text: textAction.innerText,
      type: "grammar",
      metaDetails: metaDetails,
      platform: "linkedin",
    };

    try {
      const response = await chatPostRequest(data, endPoint, token);

      let responseText = "";
      if (response?.error  &&
        response?.error?.message === "Daily limit reached"
      ) {
        displayErrorMessage("Your Daily Limit of Postbuddy has been reached.");
        responseText = "";
      } else if (response?.error?.message === "jwt malformed") {
        displayErrorMessage("Please login to use Postbuddy");
        responseText = "";
      } else if (response?.error?.message === "No token found") {
        displayErrorMessage("Please login to use Postbuddy");
        responseText = "";
      } else {
        responseText = response?.data?.data;
      }
      activeInputField = document.querySelector('[contenteditable="true"]')
      if (activeInputField) {
        document.querySelector(
          ".msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate"
        ).textContent = "";
        activeInputField.innerHTML = "";

        // Create p element with black text
        const pElement = document.createElement("p");
        pElement.style.color = "#000000";
        pElement.textContent = responseText
          .trim()
          .replace(/Write a message...\.u/g, "");

        // Add to input field
        activeInputField.appendChild(pElement);

        // Dispatch input event to trigger LinkedIn's message field update
        const event = new Event("input", { bubbles: true });
        activeInputField.dispatchEvent(event);
      }
    } catch (error) {
      console.error("Grammar check error:", error);
    } finally {
      checkGrammarBtn.textContent = "Check Grammar";
      checkGrammarBtn.disabled = false;
    }
  });

  generateBtn.onclick = async () => {
    generateBtn.innerHTML = "<span>Generating...</span>";
    generateBtn.disabled = true;

    const otherUser =
      document.querySelector(
        '[data-jump-link-target="thread-detail-jump-target"]'
      )?.innerText || "User";

    await handleLinkedInChats(otherUser, textAction.innerText);

    generateBtn.innerHTML = "<span style='margin-right:4px;'>✨</span>Generate";
    generateBtn.disabled = false;
  };

  // Add everything to the controls container
  controlsContainer.appendChild(langTranslateContainer);
  controlsContainer.appendChild(checkGrammarBtn);
  controlsContainer.appendChild(generateBtn);

  // Footer
  const footer = document.createElement("div");
  footer.textContent = "Powered-by PostBuddy.ai";
  footer.style.fontSize = "12px";
  footer.style.color = "#888";
  footer.style.textAlign = "start";
  footer.style.marginTop = "8px";
  container.appendChild(footer);

  // Add everything to page
  try {
    // Try multiple selector strategies
    let parent;

    // First attempt - original selector
    const formElement = document.querySelectorAll(
      ".msg-form.msg-form--thread-footer-feature"
    )[0];
    if (
      formElement &&
      formElement.children &&
      formElement.children.length > 2
    ) {
      parent = formElement.children[2];
    }

    // Second attempt - find the messaging footer area
    if (!parent) {
      parent = document.querySelector(".msg-form__footer");
    }

    // Third attempt - broader selector
    if (!parent) {
      parent = document.querySelector(".msg-form");
    }

    // Final fallback
    if (!parent) {
      parent = document
        .querySelector("[data-control-name='compose_message']")
        ?.closest(".msg-form");
    }

    if (parent) {
      parent.appendChild(container);
      activeContainer = container;
    } else {
      console.error(
        "Failed to find a suitable parent element for the PostBuddy container"
      );
    }
  } catch (error) {
    console.error("Error appending PostBuddy container:", error);
  }
}

export const extractLinkedInChats = () => {
  // document.querySelector(
  //   ".msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate"
  // ).style.minHeight = "0px";
  // Get all message containers in the exact order they appear
  const messageItems = document.querySelectorAll(".msg-s-event-listitem");
  const chatSequence = [];

  // Variable to track the previous sender
  let previousSender = null;

  // Loop through each message item in order
  messageItems.forEach((item, index) => {
    // Get the message body element
    const msgElement = item.querySelector(
      ".msg-s-event-listitem__body.t-14.t-black--light.t-normal"
    );
    if (!msgElement) return;

    // Get the message content
    const message = msgElement.innerText;

    // Get sender name (ignore timestamp completely)
    const senderElement = item.querySelector(".msg-s-message-group__name");
    let userName = senderElement
      ? senderElement.innerText.trim()
      : "Unknown User";

    // If user is Unknown, use the previous sender's name for continuity
    if (userName === "Unknown User" && previousSender) {
      userName = previousSender;
    } else if (userName !== "Unknown User") {
      // Update the previous sender when we find a known sender
      previousSender = userName;
    }

    // Add to sequence with index to preserve exact order
    chatSequence.push({
      index,
      userName,
      message,
    });
  });

  // Create the expected output format preserving the exact conversation sequence
  // This format matches the structure in your demo
  const flatChatFormat = {};

  // Process messages in their exact order
  chatSequence.forEach((item) => {
    // Create a unique key that includes the index to preserve order
    // This ensures messages from the same person stay in sequence
    const key = `${item.userName} ${item.index}`;
    flatChatFormat[key] = [item.message];
  });

  return {
    chronological: chatSequence,
    byUser: flatChatFormat,
  };
};

// Main function to handle LinkedIn chat extraction
export const handleLinkedInChats = async (otherUser, message) => {
  // Store the active input field at the start of the function
  let activeInputField = document.querySelector('[contenteditable="true"]');

  // Still keep the event listener for future focus changes
  document.addEventListener("focusin", (event) => {
    const target = event.target;
    if (target.hasAttribute("contenteditable")) {
      activeInputField = target;
      addContainer();
      extractLinkedInChats();
    }
  });

  try {
    const { chronological, byUser } = extractLinkedInChats();

    let myName = "";
    for (const key in byUser) {
      if (!key.includes(otherUser)) {
        const userName = key.split(" ").slice(0, -1).join(" ");
        myName = userName;
      }
    }

    const metaDetails = await getMetaDetails();

    const data = {
      chats: byUser,
      myName: myName,
      message: message,
      metaDetails: metaDetails,
      platform: "linkedin",
    };

    const response = await chatPostRequest(data, endPoint, token);

    let responseText = "";
    if (
      response?.error  &&
      response?.error?.message === "Daily limit reached"
    ) {
      displayErrorMessage("Your Daily Limit of Postbuddy has been reached.");
      responseText = "";
    } else if (response?.error && response?.error?.message === "jwt malformed") {
      displayErrorMessage("Please login to use Postbuddy");
      responseText = "";
    } else if (response?.error && response?.error?.message === "No token found") {
      displayErrorMessage("Please login to use Postbuddy");
      responseText = "";
    } else {
      responseText = response?.data?.data;
    }

    if (activeInputField) {
      document.querySelector(
        ".msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate"
      ).textContent = "";
      activeInputField.innerHTML = "";

      // Create p element with black text
      const pElement = document.createElement("p");
      pElement.style.color = "#000000";
      pElement.textContent = responseText
        .trim()
        .replace(/Write a message...\.u/g, "");

      // Add to input field
      activeInputField.appendChild(pElement);

      // Dispatch input event to trigger LinkedIn's message field update
      const event = new Event("input", { bubbles: true });
      activeInputField.dispatchEvent(event);
    }

    return {
      success: true,
      myName,
      chronological: chronological.map((item) => ({
        userName: item.userName,
        message: item.message,
        index: item.index,
      })),
      byUser,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error extracting LinkedIn chats:", error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

// Export default function for direct usage
export default handleLinkedInChats;
