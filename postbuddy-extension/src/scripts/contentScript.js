/* global chrome */
import BotIcon, { toggleBotContainer } from "../functions/BotIcon";
import sendPostRequest from "../api/sendPostRequest";
import {
  addContainer,
  extractLinkedInChats,
  // handleLinkedInChats,
} from "./LinkedinScripts/linkedinChat";
import { addRecreateButtonToFeed } from "./LinkedinScripts/recreatePost";
import { BASEURL } from "../api/BASEURL";

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

function linkedinEnabled(callback) {
  chrome.storage.sync.get(["enabledPlatforms"], function (result) {
    let enabledPlatforms = result.enabledPlatforms || [];
    if (enabledPlatforms.includes("linkedin")) {
      callback(true);
    } else {
      callback(false);
    }
  });
}
async function fetchPostLink() {
  try {
    // Click share button
    document
      .querySelector('button[aria-label="Send in a private message"]')
      ?.click();
    await new Promise((r) => setTimeout(r, 500));

    // Click copy link (second tertiary button)
    const btns = [
      ...document.querySelectorAll(".artdeco-button--tertiary.ember-view"),
    ];
    btns[1]?.click();
    await new Promise((r) => setTimeout(r, 300));

    // Get link from toast
    const link = document.querySelector(".artdeco-toast-item__cta")?.href;
    if (!link) throw new Error("Link not found");

    // Close modal (first tertiary button)
    btns[0]?.click();
    return link;
  } catch (e) {
    console.error("Failed to get link:", e);
    return null;
  }
}

setInterval(() => {
  linkedinEnabled((check) => {
    if (!check) {
      return;
    }
    (function () {
      document.querySelector(
        ".msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate"
      ).style.minHeight = "0px";  
      addContainer();
      extractLinkedInChats();
    })();
  });
}, 500);

setInterval(() => {
  addRecreateButtonToFeed();
}, 1000);

let nestedCommentText = "";
function nestedCommentTextfn(a) {
  // User name
  const userName = a.parentElement.children[0].innerText.split("\n")[0];
  //Comment data
  const commentText = a.parentElement.children[1].innerText;
  nestedCommentText = userName + "$$" + commentText;
}

function nestedComment() {
  let arr = document.querySelectorAll(".comment-social-activity");
  arr.forEach((element) => {
    element.addEventListener("click", () => nestedCommentTextfn(element));
  });
}

(async () => {
  const getStorage = (keys) => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(keys, resolve);
    });
  };
  const linkedinEnabled = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["enabledPlatforms"], function (result) {
        let enabledPlatforms = result.enabledPlatforms || [];
        resolve(enabledPlatforms.includes("linkedin"));
      });
    });
  };

  nestedComment();

  const result = await getStorage(["isEnabled"]);
  const isEnabled = result.isEnabled !== undefined ? result.isEnabled : true;
  const enabledCheck = await linkedinEnabled();

  if (!isEnabled || !enabledCheck) {
    console.log("Extension is disabled. Content script won't run.");
    return;
  }
  let fieldText = "";
  // const manifest = chrome.runtime.getManifest();
  const endPoint = `${BASEURL}/comment`;

  let selectedLanguage = "English";
  let activeContainer = null;
  let activeInputField = null;
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

  function createButton(btn, isSavedPrompt = false) {
    const button = document.createElement("button");
    button.textContent = btn.name;
    button.type = "button";
    button.style.cssText = `
        margin: 2px;
        padding: 4px 8px;
        border-radius: 4px;
        border: 2px solid #333;
        background-color: transparent;
        color: #333;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 12px;
      `;
    if (isSavedPrompt) {
      button.classList.add("saved-prompt");
    }

    button.addEventListener("mouseover", () => {
      button.style.backgroundColor = "#f3f6f8";
      button.style.color = "#0a66c2";
    });

    button.addEventListener("mouseout", () => {
      button.style.backgroundColor = "#ffffff";
      button.style.color = "#333";
    });

    button.addEventListener("click", async (event) => {
      toggleBotContainer();
      event.stopPropagation();

      if (activeInputField) {
        const postLink = await fetchPostLink();
        // activeInputField.textContent = btn.prompt;

        // if (!button.classList.contains('saved-prompt')) {
        logPostData(btn.prompt, activeInputField, postLink);
        // }

        activeInputField.focus();

        const range = document.createRange();
        range.selectNodeContents(activeInputField);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        console.error("No active input field found");
      }
    });

    return button;
  }

  function createMainContainer() {
    const mainContainer = document.createElement("div");
    mainContainer.className = "linkedin-button-container";
    mainContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 10px;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-top: 10px;
        width: 100%;
      `;

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-actions";
    buttonContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: flex-start;
      `;

    const buttonTexts = ["Congratulate", "Agree", "Thought", "Recommend"];
    buttonTexts.forEach((text) => {
      const button = createButton({ name: text, prompt: text });
      buttonContainer.appendChild(button);
    });

    const select = document.createElement("select");
    select.className = "language-dropdown";
    select.style.cssText = `
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #dbdbdb;
        font-size: 14px;
        cursor: pointer;
        width: 120px;
        height: 40px;
        margin-top: 5px;
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
    chrome.storage.sync.get(["customActions"], function (result) {
      const savedButtons = result.customActions || [];
      savedButtons.forEach((btn) => {
        const button = createButton(btn, true);
        buttonContainer.appendChild(button);
      });
    });

    const inputContainer = document.createElement("div");
    inputContainer.className = "input-action";
    inputContainer.style.cssText = `
        display: flex;
        gap: 5px;
        align-items: center;
      `;

    const promptInput = document.createElement("textarea");
    promptInput.setAttribute("rows", 3);
    promptInput.className = "prompt-input";
    promptInput.placeholder = "Enter a custom prompt";
    promptInput.style.cssText = `
        flex-grow: 1;
        padding: 8px;
        border: 1px solid #0a66c2;
        border-radius: 4px;
        transition: border-color 0.3s;
      `;

    promptInput.addEventListener("focus", () => {
      promptInput.style.borderColor = "#7AB2D3";
    });

    promptInput.addEventListener("blur", () => {
      promptInput.style.borderColor = "#0a66c2";
    });

    const generateButton = document.createElement("button");
    generateButton.textContent = "Generate";
    generateButton.type = "button";
    generateButton.style.cssText = `
        padding: 12px 20px;
        border-radius: 4px;
        border: none;
        background-color: #7b3ffd;
        color: #fff;
        cursor: pointer;
        font-weight: 600;
        font-size: 16px;
        transition: all 0.3s ease;
      `;

    generateButton.addEventListener("click", () => {
      const inputText = promptInput.value.trim();
      if (inputText && activeInputField) {
        logPostData(inputText, activeInputField);
      } else {
        console.warn("Input field is empty or not focused");
      }
    });

    const postBuddyContainer = document.createElement("p");
    postBuddyContainer.className = "postBuddy-container";
    postBuddyContainer.textContent = "Powered-by PostBuddy.ai";
    postBuddyContainer.style.cssText = `
        font-size: 12px;
        color: #999;
        align-items: end;
        justify-content: flex-end;
      `;

    const filterContainer = document.createElement("div");
    filterContainer.className = "filter-container";
    filterContainer.style.cssText = `
    display: flex;
    items-align: center;
    justify-content: space-between;
    `;
    filterContainer.appendChild(select);
    filterContainer.appendChild(generateButton);

    inputContainer.appendChild(promptInput);
    // buttonContainer.appendChild(generateButton);

    mainContainer.appendChild(inputContainer);
    mainContainer.appendChild(buttonContainer);
    mainContainer.appendChild(filterContainer);
    mainContainer.appendChild(postBuddyContainer);

    return mainContainer;
  }

  function appendButtonContainer(commentBoxForm) {
    if (activeContainer) {
      activeContainer.remove();
    }

    const mainContainer = createMainContainer();
    commentBoxForm.insertBefore(mainContainer, commentBoxForm.secondChild);
    activeContainer = mainContainer;

    mainContainer.addEventListener("mousedown", (event) => {
      event.stopPropagation();
    });
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

  async function logPostData(text, inputField, postLink) {
    const postContainer = inputField.closest(".feed-shared-update-v2");

    // Get the content and separate the mention from the previous response
    let existingContent = inputField.innerHTML;
    // Remove any previous response (everything after the first mention)
    const mentionMatch = existingContent.match(/<a[^>]*>.*?<\/a>/);
    if (mentionMatch) {
      existingContent = mentionMatch[0];
    }

    // Add Thinking... after the mention
    inputField.innerHTML = existingContent
      ? `${existingContent} Thinking..`
      : "Thinking..";

    const myName =
      document.querySelectorAll("h3.profile-card-name.text-heading-large")[0]
        ?.innerText || "Unknown";

    if (postContainer) {
      const postByElement =
        postContainer.querySelector("span[dir] span[aria-hidden='true']")
          ?.innerText || "Unknown";
      const descriptionElement =
        postContainer.querySelector(".update-components-text")?.innerText ||
        "No description available";

      const metaDetails = await getMetaDetials();
      const postData = {
        myName: myName,
        postBy: postByElement.trim(),
        description: descriptionElement.trim(),
        request: text,
        metaDetails: metaDetails,
        platform: "linkedin",
        languages: selectedLanguage,
        nestedData: nestedCommentText,
        postLink: postLink,
      };

      let res = await sendPostRequest(postData, endPoint, token);
      if (res.message === "jwt malformed" || res.message === "User not found") {
        res.data = "Please login to use Postbuddy";
        fieldText = res.data.trim();
        inputField.innerHTML = `${res.data}`.trim();
        return;
      } else if (res.message === "Daily limit reached") {
        res.data = "Daily limit reached. Upgrade your plan";
        fieldText = res.data.trim();
        inputField.innerHTML = `${res.data}`.trim();
        return;
      }

      // Remove existing PostBuddy signature if present
      const signatureSelector = ".postbuddy-signature";
      const existingSignature = inputField.querySelector(signatureSelector);
      if (existingSignature) {
        existingSignature.remove();
      }

      let cleanedContent = "";
      cleanedContent = res.data;
      if (
        existingContent.includes(
          `<a class="ql-mention" href="#" data-entity-urn="urn:li:fsd_company:106418852" data-guid="1" data-object-urn="urn:li:organization:106418852" data-original-text="Postbuddy.ai" spellcheck="false" data-test-ql-mention="true">Postbuddy.ai</a>`
        )
      ) {
        existingContent = "";
      }
      inputField.innerHTML = existingContent
        ? `${existingContent} ${cleanedContent.trim()} 
        <p class="postbuddy-signature" style="user-select: none;">comment created using <a class="ql-mention" href="#" data-entity-urn="urn:li:fsd_company:106418852" data-guid="1" data-object-urn="urn:li:organization:106418852" data-original-text="Postbuddy.ai" spellcheck="false" data-test-ql-mention="true">Postbuddy.ai</a></p>`
        : `${cleanedContent.trim()} 
        <p class="postbuddy-signature" style="user-select: none;">comment created using <a class="ql-mention" href="#" data-entity-urn="urn:li:fsd_company:106418852" data-guid="1" data-object-urn="urn:li:organization:106418852" data-original-text="Postbuddy.ai" spellcheck="false" data-test-ql-mention="true">Postbuddy.ai</a></p>`;

      fieldText = cleanedContent.trim();
      nestedCommentText = null;
    } else {
      console.error("Post container not found");
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    try {
      nestedComment();
    } catch (error) {
      console.error("Error in nestedComment:", error);
    }
    const replyButtons = document.querySelectorAll(
      ".comments-comment-meta__container button"
    );

    replyButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const commentContainer = event.target.closest(
          ".comments-comment-meta__container"
        );
        if (commentContainer) {
          // Extract the comment text (or the content that you want to log)
          const commentText = commentContainer
            .querySelector(".comments-comment-text")
            ?.textContent.trim();
          const commentUserName = commentContainer
            .querySelector(".comments-comment-meta__container--user")
            ?.textContent.trim();

          console.log("Replying to comment:");
          console.log("User: ", commentUserName);
          console.log("Comment: ", commentText);
        } else {
          console.error("Comment container not found.");
        }
      });
    });
  });

  document.addEventListener("focusin", (event) => {
    console.log("focusin");
    const target = event.target;
    if (target.nodeName === "DIV" && target.hasAttribute("contenteditable")) {
      activeInputField = target;
      const commentBoxForm = target.closest(".comments-comment-box__form");
      if (commentBoxForm) {
        nestedComment();
        appendButtonContainer(commentBoxForm);
      }
    }
  });
})();

(() => {
  BotIcon();
})();
