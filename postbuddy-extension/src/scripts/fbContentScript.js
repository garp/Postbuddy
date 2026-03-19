import sendPostRequest from "../api/sendPostRequest";
import { BASEURL } from "../api/BASEURL";
/*global chrome */

let token = "";
chrome.storage.sync.get(["token"], function (result) {
  if (result.token) {
    token = result.token;
    console.log("Retrieved token from Chrome storage:", token);
  } else if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  } else {
    console.warn("No token found in Chrome storage or localStorage.");
  }
});

let selectedLanguage = "English";
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

(async () => {
  chrome.storage.sync.get(["isEnabled"], function (result) {
    const isEnabled = result.isEnabled !== undefined ? result.isEnabled : false;

    if (!isEnabled) {
      console.log("Postbuddy is disabled.");
      return;
    }
  });
  chrome.storage.sync.get(["enabledPlatforms"], function (result) {
    const enabledPlatforms = result.enabledPlatforms || [];
    if (!enabledPlatforms.includes("facebook")) {
      console.log("Postbuddy is disabled.");
      return;
    }
  });
  const endPoint = `${BASEURL}/comment`;
  console.log("fbContentScript loaded successfully");

  // Default action buttons
  const defaultActions = [
    { name: "Congratulate", prompt: "👍 This is awesome!" },
    { name: "Agree", prompt: "I agree with your perspective." },
    { name: "Thought", prompt: "💡 This gave me something to think about." },
    { name: "Recommend", prompt: "I would definitely recommend this." },
  ];

  // All actions will combine default and custom actions
  let actions = [...defaultActions];

  // Load custom actions from storage
  chrome.storage.sync.get(["customActions"], function (result) {
    const savedButtons = result.customActions || [];
    savedButtons.forEach((btn) => {
      console.log("btn : ", btn);
      actions.push({ name: btn.name, prompt: btn.prompt });
    });
    console.log("All buttons : ", actions);
    console.log("All actions (including custom buttons):", actions);
  });

  function createPostBuddyContainer(commentBox) {
    if (
      !commentBox ||
      commentBox.parentElement.querySelector(".postbuddy-container")
    ) {
      return;
    }

    // Main container
    const container = document.createElement("div");
    container.className = "postbuddy-container";
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 24px;
      padding: 12px;
      background-color: #ffffff;
      border-radius: 8px;
      border: 1px solid #dddfe2;
      overflow: visible;
      position: relative;
      width: 100%;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    `;

    // Create a toggle button for collapse/expand
    const toggleButton = document.createElement("button");
    toggleButton.innerHTML = "&#x25BC; Collapse";
    toggleButton.style.cssText = `
      position: absolute;
      top: 12px;
      right: 36px;
      padding: 4px 8px;
      font-size: 12px;
      color: #385898;
      background-color: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
    `;

    // Custom prompt dropdown instead of textarea
    const promptContainer = document.createElement("div");
    promptContainer.style.cssText = `
      width: 100%;
      margin-bottom: 8px;
    `;

    const promptSelect = document.createElement("select");
    promptSelect.style.cssText = `
      width: 100%;
      padding: 8px;
      font-size: 14px;
      border: 1px solid #dddfe2;
      border-radius: 4px;
      background-color: #fff;
      color: #385898;
    `;

    // Button container for preset actions
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "postbuddy-button-container";
    buttonContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: flex-start;
      align-items: center;
    `;

    // Create action buttons
    actions.forEach((action) => {
      const button = document.createElement("button");
      button.textContent = action.name;
      button.style.cssText = `
        padding: 8px 12px;
        font-size: 14px;
        color: #385898;
        background-color: #f0f2f5;
        border: 1px solid #dddfe2;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;
      `;

      button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "#385898";
        button.style.color = "#ffffff";
      });

      button.addEventListener("mouseout", () => {
        button.style.backgroundColor = "#f0f2f5";
        button.style.color = "#385898";
      });

      button.addEventListener("click", async () => {
        if (commentBox.getAttribute("contenteditable") === "true") {
          document.execCommand("selectAll", true, "true");
          document.execCommand("insertText", true, "Thinking...");
          commentBox.textContent = "Thinking...";
          const metaDetails = await getMetaDetails();
          document.execCommand("selectAll", true, "true");
          const topComments = getTopComments();
          const postDetails = {
            postBy: "Unknown",
            description: "No description available",
            request: action.prompt,
            metaDetails: metaDetails,
            platform: "facebook",
            languages: selectedLanguage,
            comments: topComments,
          };
          document.execCommand("selectAll", true, "true");

          let data = await response(postDetails, endPoint, token);
          let commentRes = "";
          if (data.message === "jwt malformed") {
            commentRes = "Please login to use Postbuddy";
          } else if (data.message === "Daily limit reached") {
            commentRes = "Daily limit reached. Upgrade your plan";
          }

          // Add signature to the comment
          commentRes = `${data.data} - created using Postbuddy`;
          document.execCommand("insertText", true, commentRes);
        } else {
          console.error("Comment box is not editable");
        }
      });

      buttonContainer.appendChild(button);
    });

    // Language selector
    const select = document.createElement("select");
    select.className = "language-dropdown";
    select.style.cssText = `
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #dddfe2;
      font-size: 14px;
      cursor: pointer;
      margin-left: 0;
      width: 120px;
      height: 38px;
      color: #385898;
    `;

    Object.entries(languages).forEach(([nativeName, englishName]) => {
      const option = document.createElement("option");
      option.value = englishName.toLowerCase();
      option.textContent = nativeName;
      select.appendChild(option);
    });

    select.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    select.addEventListener("focus", (event) => {
      event.stopPropagation();
    });
    select.addEventListener("blur", (event) => {
      event.stopPropagation();
    });

    select.addEventListener("change", (event) => {
      selectedLanguage = event.target.value;
    });

    // Generate button
    const generateButton = document.createElement("button");
    generateButton.textContent = "Generate";
    generateButton.style.cssText = `
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      background-color: #7b3ffd;
      color: #ffffff;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: background-color 0.3s;
    `;

    generateButton.addEventListener("mouseover", () => {
      generateButton.style.backgroundColor = "#6a35e0";
    });

    generateButton.addEventListener("mouseout", () => {
      generateButton.style.backgroundColor = "#7b3ffd";
    });

    generateButton.addEventListener("click", async () => {
      const customPrompt = promptSelect.value.trim();
      if (
        customPrompt &&
        commentBox.getAttribute("contenteditable") === "true"
      ) {
        commentBox.textContent = "Thinking...";
        const metaDetails = await getMetaDetails();
        const topComments = getTopComments();
        const postDetails = {
          postBy: "Unknown",
          description: "No description available",
          request: customPrompt,
          metaDetails: metaDetails,
          platform: "facebook",
          languages: selectedLanguage,
          comments: topComments,
        };

        let data = await response(postDetails, endPoint, token);
        if (data.message === "jwt malformed") {
          data.data = "Please login to use Postbuddy";
        } else if (data.message === "Daily limit reached") {
          data.data = "Daily limit reached. Upgrade your plan";
        }

        // Add signature to the comment
        const commentRes = `${data.data} - comment created using Postbuddy`;
        commentBox.textContent = commentRes;
      } else {
        console.error("Custom prompt is empty or comment box is not editable");
      }
    });

    // Bottom row with language selector and generate button
    const bottomRow = document.createElement("div");
    bottomRow.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 95%;
      margin-top: 8px;
    `;
    bottomRow.appendChild(select);
    bottomRow.appendChild(generateButton);

    // Powered by text
    const poweredBy = document.createElement("p");
    poweredBy.className = "powered-by-text";
    poweredBy.textContent = "Powered-by PostBuddy.ai";
    poweredBy.style.cssText = `
      font-size: 12px;
      color: #999;
      text-align: left;
      margin-top: 4px;
      margin-bottom: 0;
    `;

    // Add event listener for toggle button
    toggleButton.addEventListener("click", () => {
      if (promptContainer.style.display === "none") {
        promptContainer.style.display = "block";
        buttonContainer.style.display = "flex";
        bottomRow.style.display = "flex";
        toggleButton.innerHTML = "&#x25BC; Collapse";
      } else {
        promptContainer.style.display = "none";
        buttonContainer.style.display = "none";
        bottomRow.style.display = "none";
        toggleButton.innerHTML = "&#x25B2; Expand";
      }
    });

    // Assemble the container
    container.appendChild(toggleButton);
    container.appendChild(promptContainer);
    container.appendChild(buttonContainer);
    container.appendChild(bottomRow);
    container.appendChild(poweredBy);

    // Insert the container before the comment box
    commentBox.parentElement.insertBefore(container, commentBox);
  }

  // Listen for comment box focus
  document.addEventListener("focusin", (e) => {
    const target = e.target;
    if (
      target.nodeName === "DIV" &&
      target.getAttribute("contenteditable") === "true" &&
      target.getAttribute("role") === "textbox"
    ) {
      createPostBuddyContainer(target);
    }
  });
})();

async function response(postData, endPoint, token) {
  try {
    const res = await sendPostRequest(postData, endPoint, token);
    return res;
  } catch (error) {
    console.log("Error in response function:", error);
    return { data: "Error fetching data" };
  }
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

function getTopComments() {
  try {
    const comments = document.querySelectorAll('div[role="article"]');
    const commentsArray = [];
    for (let i = 2; i < 7; i++) {
      const commentText = comments[i].textContent;
      commentsArray.push(commentText);
    }
    return commentsArray;
  } catch (error) {
    console.log("Unable to get top comments");
    return [];
  }
}
