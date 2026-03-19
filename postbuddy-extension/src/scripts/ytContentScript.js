/*global chrome */
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
  chrome.storage.sync.get(["isEnabled"], function (result) {
    const isEnabled = result.isEnabled !== undefined ? result.isEnabled : false;

    if (!isEnabled) {
      console.log("Posbuddy is disabled.");
      return;
    }
  });
  chrome.storage.sync.get(["enabledPlatforms"], function (result) {
    const enabledPlatforms = result.enabledPlatforms || [];
    if (!enabledPlatforms.includes("youtube")) {
      console.log("Postbuddy is disabled.");
      return;
    }
  });
  console.log("Postbuddy is enabled.");
  const endPoint = `${BASEURL}/comment`;
  const targetNode = document.body;

  const config = {
    childList: true,
    subtree: true,
  };

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const commentInputs = node.querySelectorAll(
              "#contenteditable-root"
            );
            if (commentInputs.length > 0) {
              console.log("YouTube comment input loaded.");
              commentInputs.forEach((commentInput) => {
                injectActionButtons(commentInput);
              });
            }
          }
        });
      }
    });
  });

  function getMetaDetails() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(
        [
          "wordLimit",
          "nativeButton",
          "toneIntent",
          "replyTone",
          "nativeLanguage",
          "brandVoice"
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

  observer.observe(targetNode, config);

  function injectActionButtons(commentInput) {
    const commentContainer = commentInput.closest(
      "ytd-comments-header-renderer"
    );

    if (
      commentContainer &&
      !commentContainer.querySelector(".yt-action-buttons-container")
    ) {
      console.log("Injecting action buttons");

      const actionContainer = document.createElement("div");
      actionContainer.className = "yt-action-buttons-container";

      // Language Dropdown
      const languageDropdown = document.createElement("select");
      languageDropdown.className = "language-dropdown";

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
      let selectedLanguage = "English";
      Object.entries(languages).forEach(([nativeName, englishName]) => {
        const option = document.createElement("option");
        option.value = englishName.toLowerCase();
        option.textContent = nativeName;
        languageDropdown.appendChild(option);
      });
      languageDropdown.addEventListener("change", (event) => {
        selectedLanguage = event.target.value;
        console.log(`Selected language: ${selectedLanguage}`);
      });

      const buttonContainer = document.createElement("div");
      buttonContainer.className = "button-container";

      const actions = [
        "Appreciate",
        "Question",
        "Insight",
        "Funny",
        "Summary",
        "Critique",
      ];

      actions.forEach((actionText) => {
        const actionDiv = document.createElement("div");
        actionDiv.className = "yt-action-div";
        actionDiv.innerText = actionText;
        buttonContainer.appendChild(actionDiv);

        actionDiv.addEventListener("click", async () => {
          const textWrapper = document.createElement("span");
          textWrapper.textContent = "Thinking...";
          textWrapper.style = `
          color:#fff;
          background:#222`;
          commentInput.appendChild(textWrapper);

          const metaDetails = await getMetaDetails();
          const transcriptData = await getTranscript();
          commentInput.focus();

          const link = window.location.href;
          console.log("Current YouTube URL:", link);

          const data = {
            metaDetails: metaDetails,
            request: actionText,
            platform: "youtube",
            transcriptData: transcriptData,
            languages: selectedLanguage,
            postLink: link,
          };
          
          // Log the payload to verify link is included
          console.log("Sending payload with link:", data);

          const res = await sendPostRequest(data, endPoint, token);
          if (res.message === "jwt malformed") {
            res.data = "Please login to use Postbuddy";
          } else if (res.message === "Daily limit reached") {
            res.data = "Daily limit reached. Upgrade your plan";
          }
          while (commentInput.firstChild) {
            commentInput.removeChild(commentInput.firstChild);
          }

          const responseWrapper = document.createElement("span");
          responseWrapper.textContent = res.data;
          responseWrapper.style = `
          color:#fff;
          background:#222`;
          commentInput.appendChild(responseWrapper);

          const inputEvent = new Event("input", { bubbles: true });
          commentInput.dispatchEvent(inputEvent);
        });
      });
      chrome.storage.sync.get(["customActions"], function (result) {
        const customActions = result.customActions || [];
        customActions.forEach((btn) => {
          const customActionDiv = document.createElement("div");
          customActionDiv.className = "yt-action-div custom-action";
          customActionDiv.innerText = btn.name;
          buttonContainer.appendChild(customActionDiv);

          customActionDiv.addEventListener("click", async () => {
            const textWrapper = document.createElement("span");
            textWrapper.textContent = "Thinking...";
            textWrapper.style.color = "#fff";
            commentInput.appendChild(textWrapper);

            const metaDetails = await getMetaDetails();
            const transcriptData = await getTranscript();
            commentInput.focus();

            const data = {
              metaDetails: metaDetails,
              request: btn.prompt,
              platform: "youtube",
              transcriptData: transcriptData,
              languages: selectedLanguage,
            };

            // Send the request
            const res = await sendPostRequest(data, endPoint, token);
            if (res.message === "jwt malformed") {
              res.data = "Please login to use Postbuddy";
            } else if (res.message === "Daily limit reached") {
              res.data = "Daily limit reached. Upgrade your plan";
            }

            // Clear the comment input and display the response
            while (commentInput.firstChild) {
              commentInput.removeChild(commentInput.firstChild);
            }
            const responseWrapper = document.createElement("span");
            responseWrapper.textContent = res.data;
            responseWrapper.style.color = "#fff";
            commentInput.appendChild(responseWrapper);

            // Dispatch an input event to notify any listeners of the change
            const inputEvent = new Event("input", { bubbles: true });
            commentInput.dispatchEvent(inputEvent);
          });
        });
      });

      const customInputContainer = document.createElement("div");
      customInputContainer.className = "custom-input-container";
      customInputContainer.style.cssText =
        "display: flex; flex-direction: column; gap: 10px; margin-top: 10px; width: 100%;";

      const customPromptInput = document.createElement("textarea");
      customPromptInput.setAttribute("rows", 3);
      customPromptInput.className = "custom-prompt-input";
      customPromptInput.placeholder = "Enter a custom prompt";
      customPromptInput.style.cssText =
        "background:transparent; width: 100%; border: 1px solid #fff; border-radius: 4px; color: #f6f6f6; ";

      const customGenerateButton = document.createElement("button");
      customGenerateButton.textContent = "Generate";
      customGenerateButton.type = "button";
      customGenerateButton.style.cssText =
        "padding: 8px 16px; border: none; border-radius: 4px; background-color: #d32f2f; color: #fff; cursor: pointer;";

      customGenerateButton.addEventListener("click", async () => {
        const promptText = customPromptInput.value.trim();
        if (!promptText) {
          console.warn("Custom prompt is empty");
          return;
        }
        const textWrapper = document.createElement("span");
        textWrapper.textContent = "Thinking...";
        textWrapper.style.color = "#fff";
        commentInput.appendChild(textWrapper);

        const metaDetails = await getMetaDetails();
        const transcriptData = await getTranscript();
        commentInput.focus();

        const data = {
          metaDetails: metaDetails,
          request: promptText,
          platform: "youtube",
          transcriptData: transcriptData,
          languages: selectedLanguage,
        };

        const res = await sendPostRequest(data, endPoint, token);
        if (res.message === "jwt malformed") {
          res.data = "Please login to use Postbuddy";
        } else if (res.message === "Daily limit reached") {
          res.data = "Daily limit reached. Upgrade your plan";
        }
        while (commentInput.firstChild) {
          commentInput.removeChild(commentInput.firstChild);
        }
        const responseWrapper = document.createElement("span");
        responseWrapper.textContent = res.data;
        responseWrapper.style.color = "#fff";
        commentInput.appendChild(responseWrapper);

        const inputEvent = new Event("input", { bubbles: true });
        commentInput.dispatchEvent(inputEvent);
      });

      // Append the textarea and button to the custom input container
      customInputContainer.appendChild(customPromptInput);
      // customInputContainer.appendChild(customGenerateButton);

      const bottomContainer = document.createElement("div");
      bottomContainer.className = "bottom-container";
      bottomContainer.style.cssText =
        "display: flex; width: 100%; align-items: center; justify-content: space-between";
      bottomContainer.appendChild(languageDropdown);
      bottomContainer.appendChild(customGenerateButton);

      // Powered by text
      const poweredBy = document.createElement("p");
      poweredBy.className = "powered-by";
      poweredBy.innerText = "Powered by PostBuddy.Ai";
      actionContainer.appendChild(poweredBy);
      actionContainer.appendChild(bottomContainer);
      actionContainer.appendChild(buttonContainer);
      actionContainer.appendChild(customInputContainer);
      commentContainer.appendChild(actionContainer);
      injectStyles();
    }
  }

  async function getTranscript() {
    const title =
      document
        .querySelector("h1.style-scope.ytd-watch-metadata")
        ?.textContent?.trim() || "";
    const transcriptbtn = Array.from(document.querySelectorAll("button")).find(
      (e) => e.textContent.includes("Show transcript")
    );
    if (transcriptbtn) {
      transcriptbtn.click();
      await new Promise((e) => setTimeout(e, 1000));
      const t = document.querySelectorAll("ytd-transcript-segment-renderer");
      let n = Array.from(t)
        .map((e) => e.textContent.trim())
        .join("\n");
      const o = document.querySelector(
        'ytd-engagement-panel-section-list-renderer button[aria-label="Close"]'
      );
      if (o) o.click();
      // console.log(`Transcript ==> ${title}\n${n}`);
      const cleanedTranscript = n
        .replace(/\s{2,}/g, " ")
        .replace(/\d{1}:\d{2}/g, "")
        .replace(/[\[\]_]+/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      const wordsArray = cleanedTranscript.split(/\s+/);
      const first200WordsArray = wordsArray.slice(0, 200);
      const first200Words = first200WordsArray.join(" ");
      return { transcript: first200Words, title };
    } else {
      console.warn("Transcript button not found.");
      return { transcript: "", title };
    }
  }

  function injectStyles() {
    if (!document.getElementById("yt-action-styles")) {
      const style = document.createElement("style");
      style.id = "yt-action-styles";
      style.innerHTML = `
        .yt-action-buttons-container {
          display: flex;
          flex-direction: column-reverse;
          align-items: start;
          gap: 15px;
          background-color: #333;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          justify-content: space-between;
        }
        .language-dropdown {
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #dbdbdb;
          font-size: 14px;
          cursor: pointer;
        }
        .button-container {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .yt-action-div {
          padding: 8px 16px;
          background-color: #d32f2f;
          color: white;
          border: 1px solid #d32f2f;
          border-radius: 25px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          transition: background-color 0.3s ease, color 0.3s ease;
          text-align: center;
        }
        .yt-action-div:hover {
          background-color: white;
          color: #d32f2f;
        }
        .powered-by {
          font-size: 12px;
          color: #999;
        }
      `;
      document.head.appendChild(style);
    }
  }
})();
