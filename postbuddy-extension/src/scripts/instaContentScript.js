/* global chrome */
import sendPostRequest from "../api/sendPostRequest";
import { BASEURL } from "../api/BASEURL";
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
(async function () {
  if (window.location.pathname.includes("/direct/")) {
    return;
  }
  chrome.storage.sync.get(["isEnabled"], function (result) {
    const isEnabled = result.isEnabled !== undefined ? result.isEnabled : false;

    if (!isEnabled) {
      console.log("Postbuddy is disabled.");
      return;
    }
  });
  chrome.storage.sync.get(["enabledPlatforms"], function (result) {
    const enabledPlatforms = result.enabledPlatforms || [];
    if (!enabledPlatforms.includes("instagram")) {
      console.log("Postbuddy is disabled.");
      return;
    }
  });
  const endPoint = `${BASEURL}/comment`;
  let selectedLanguage = "English";

  // Define the languages object with native names as keys and English names as values
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

  // Observe for changes in the DOM to handle dynamic loading
  const observer = new MutationObserver(() => {
    const commentSection = findCommentSection();
    if (commentSection && !document.querySelector(".custom-action-container")) {
      createActionButtons(commentSection);
    }
  });

  // Start observing the body for changes
  observer.observe(document.body, { childList: true, subtree: true });

  // Function to create the action buttons container
  function createActionButtons(commentSection) {
    const container = document.createElement("div");
    container.className = "custom-action-container";
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

    // Textarea for custom prompt
    const textarea = document.createElement("textarea");
    textarea.placeholder = "Enter a custom prompt";
    textarea.style.cssText = `
      width: 80%;
      padding: 10px;
      border: 1px solid #dbdbdb;
      border-radius: 6px;
      resize: none;
      font-size: 14px;
      min-height: 30px;
      color:#222;
    `;

    container.appendChild(textarea);

    // Action Buttons
    const actions = [
      { label: "Congratulate", text: "Congratulate" },
      { label: "Agree", text: "Agree" },
      { label: "Thought", text: "Thought" },
      { label: "Recommend", text: "Recommend" },
    ];

    chrome.storage.sync.get(["customActions"], function (result) {
      const savedButtons = result.customActions || [];

      savedButtons.forEach((btn) => {
        if (btn.name && btn.prompt) {
          actions.push({ label: btn.name, text: btn.prompt });
        } else {
          console.warn(
            "Skipping custom button due to missing properties:",
            btn
          );
        }
      });
    });
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = `
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    `;
    chrome.storage.sync.get(["customActions"], function (result) {
      const savedButtons = result.customActions || [];

      savedButtons.forEach((btn) => {
        if (btn.name && btn.prompt) {
          actions.push({ label: btn.name, text: btn.prompt });
        } else {
          console.warn(
            "Skipping custom button due to missing properties:",
            btn
          );
        }
      });

      console.log("All actions (including custom buttons):", actions);
    });

    actions.forEach((action) => {
      const button = document.createElement("button");
      button.textContent = action.label;
      button.style.cssText = `
        padding: 8px 12px;
        border: 1px solid #000;
        border-radius: 6px;
        background-color: transparent;
        cursor: pointer;
        transition: all 0.2s ease;
        color:#222;
      `;

      button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "#f0f0f0";
      });
      button.addEventListener("mouseout", () => {
        button.style.backgroundColor = "transparent";
      });

      button.addEventListener("click", () =>
        handleButtonClick(action.label, commentSection)
      );
      buttonContainer.appendChild(button);
    });

    container.appendChild(buttonContainer);

    // Language Selector and Generate Button
    const footerContainer = document.createElement("div");
    footerContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      color:#222;
    `;

    const select = document.createElement("select");
    select.style.cssText = `
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #dbdbdb;
      font-size: 14px;
      cursor: pointer;
      color:'#222';
    `;

    Object.entries(languages).forEach(([nativeName, englishName]) => {
      const option = document.createElement("option");
      option.value = englishName.toLowerCase();
      option.textContent = nativeName;
      select.appendChild(option);
    });

    select.addEventListener("change", (event) => {
      selectedLanguage = event.target.value;
    });

    const generateButton = document.createElement("button");
    generateButton.textContent = "Generate";
    generateButton.style.cssText = `
      padding: 10px 20px;
      background-color: #7b3ffd;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.2s ease;
    `;

    generateButton.addEventListener("mouseover", () => {
      generateButton.style.backgroundColor = "#5a2dcb";
    });
    generateButton.addEventListener("mouseout", () => {
      generateButton.style.backgroundColor = "#7b3ffd";
    });

    generateButton.addEventListener("click", () => {
      handleButtonClick(textarea.value.trim(), commentSection);
    });

    footerContainer.appendChild(select);
    footerContainer.appendChild(generateButton);

    container.appendChild(footerContainer);

    // Powered-by Text
    const poweredBy = document.createElement("p");
    poweredBy.textContent = "Powered-by PostBuddy.ai";
    poweredBy.style.cssText = `
      font-size: 12px;
      color: #999;
      text-align: left;
      margin-top: 5px;
    `;
    container.appendChild(poweredBy);

    commentSection.parentElement.insertBefore(container, commentSection);
  }

  // Function to find the comment section across different types of posts
  function findCommentSection() {
    const selectors = [
      'textarea[aria-label="Add a comment…"]', // Regular post comments
      'textarea[placeholder="Add a comment…"]', // Reels comments
      'div[contenteditable="true"]', // Dynamic contenteditable comments
    ];

    for (const selector of selectors) {
      const commentBox = document.querySelector(selector);
      if (commentBox)
        return commentBox.closest("form") || commentBox.closest("div");
    }

    // return null; // No comment section found
  }

  // Function to get the Instagram post container
  function getPostContainer() {
    const postSelectors = [
      "article", // General article
      "div._aatl", // Post modal in feed
      "div._ab8w", // Reels modal
      "div._aato", // Post modal
      "section._aamu", // Reels full view
    ];

    for (const selector of postSelectors) {
      const postContainer = document.querySelector(selector);
      if (postContainer) return postContainer;
    }
    // return null;
  }

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

  // Enhanced function to extract post data
  async function extractPostData(action) {
    getPostContainer();
    const posterInfo =
      document.querySelector("h2._a9zc a")?.textContent?.trim() || "Unknown";
    const postCaption =
      document
        .querySelector("h1._ap3a._aaco._aacu._aacx._aad7._aade")
        ?.textContent?.trim() || "No caption";

    const metaDetails = await getMetaDetails();
    const request = action || "Write a meaningful comment";

    const link = window.location.href;

    const commentList = topCommentFunction();
    return {
      postBy: posterInfo,
      description: postCaption,
      request,
      metaDetails,
      platform: "instagram",
      comments: commentList,
      languages: selectedLanguage,
      postLink: link,
    };
  }

  function topCommentFunction() {
    const commentList = [];
    const comments = document.querySelectorAll("._a9zs");

    if (comments.length > 0) {
      comments.forEach((commentElement, index) => {
        if (index === 0 || index >= 10) return;
        const commentText = commentElement.textContent.trim();
        if (!commentText || commentText.toLowerCase().includes("paid")) return;
        commentList.push(commentText);
      });
      return commentList.length > 0 ? commentList : null;
    } else {
      const topCommentsElement = document.querySelector(
        ".x9f619.x78zum5.xdt5ytf.x5yr21d.xexx8yu.x1pi30zi.x1l90r2v.x1swvt13.x10l6tqk.xh8yej3"
      );
      if (!topCommentsElement) return null;
      const topComments = topCommentsElement.textContent;
      commentList.push(topComments);
      return commentList;
    }
  }

  async function handleButtonClick(action, commentSection) {
    const commentBox = document.querySelector(
      'textarea[aria-label="Add a comment…"], textarea[placeholder="Add a comment…"], div[contenteditable="true"]'
    );
    if (!commentBox) {
      console.error("Comment box not found");
      return;
    }

    // Set initial text to 'Thinking...'
    if (commentBox.tagName.toLowerCase() === "div") {
      commentBox.textContent = "Thinking...";
    } else {
      commentBox.value = "Thinking...";
    }

    const data = await extractPostData(action);
    if (!data) {
      if (commentBox.tagName.toLowerCase() === "div") {
        commentBox.textContent = action;
      } else {
        commentBox.value = action;
      }
    }
    try {
      const res = await sendPostRequest(data, endPoint, token);
      // console.log("API Response:", res);
      if (res.message === "jwt malformed") {
        res.data = "Please login to use Postbuddy";
      } else if (res.message === "Daily limit reached") {
        res.data = "Daily limit reached. Upgrade your plan";
      }
      if (commentBox && res) {
        if (commentBox.tagName.toLowerCase() === "div") {
          commentBox.textContent = res.data;
        } else {
          commentBox.value = res.data;
        }
        commentBox.dispatchEvent(new Event("input", { bubbles: true }));
        commentBox.focus();
      } else {
        if (commentBox.tagName.toLowerCase() === "div") {
          commentBox.textContent = action;
        } else {
          commentBox.value = action;
        }
        console.error("Failed to set comment or response is empty");
      }
    } catch (error) {
      if (commentBox.tagName.toLowerCase() === "div") {
        commentBox.textContent = action;
      } else {
        commentBox.value = action;
      }
      console.error("Error during API request:", error);
    }
  }
})();
