/* global chrome */
import { recreatePostRequest } from "../../api/sendPostRequest";
import { BASEURL } from "../../api/BASEURL";

const endPoint = `${BASEURL}/comment/recreate`;

let token = "";
chrome.storage.sync.get(["token"], function (result) {
  if (result.token) {
    token = result.token;
  }
});

function showErrorMessage(errorMessage) {
  const errorMessageContainer = document.createElement("div");
  errorMessageContainer.style.cssText = `
    color: red;
    font-size: 12px;
    margin-top: 5px;
  `;
  errorMessageContainer.innerText = errorMessage;
  const button = document.querySelector("#recreate-with-ai-button");
  button.parentElement.appendChild(errorMessageContainer);
}

function addTextToPost(text) {
  const PostButton = document.querySelector(".share-box-feed-entry__top-bar")
    .childNodes[5];
  PostButton.click();
  setTimeout(() => {
    document.querySelector(
      "div[data-test-ql-editor-contenteditable=true]"
    ).innerText = text;
    const postbuddySignature = ` <p class="postbuddy-signature" style="user-select: none;">post created using <a class="ql-mention" href="#" data-entity-urn="urn:li:fsd_company:106418852" data-guid="1" data-object-urn="urn:li:organization:106418852" data-original-text="Postbuddy.ai" spellcheck="false" data-test-ql-mention="true">Postbuddy.ai</a></p>`
    document.querySelector(
      "div[data-test-ql-editor-contenteditable=true]"
    ).innerHTML += postbuddySignature;
  }, 1000);
}

function createRecreateButton(actionBar) {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "recreate-with-ai-button";
  buttonContainer.style.cssText = `
    display: inline-block;
    margin-left: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    position: relative;
  `;

  const textarea = document.createElement("textarea");
  textarea.placeholder = "Add any instructions to enhance this post (optional)";
  textarea.cols = 78
  textarea.style.cssText = `
    display: none;
    margin-bottom: 10px;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
  `;

  const button = document.createElement("button");
  button.innerText = "Recreate with AI";
  button.id = "recreate-with-ai-button";
  button.style.cssText = `
    background-color: #7b3ffd;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 100%;
    position: relative;
    overflow: visible;
  `;

  // Create a disabled button state for when processing
  const setButtonDisabled = (isDisabled) => {
    if (isDisabled) {
      button.disabled = true;
      button.style.backgroundColor = "#b096fd"; // Lighter color
      button.style.cursor = "not-allowed";
    } else {
      button.disabled = false;
      button.style.backgroundColor = "#7b3ffd";
      button.style.cursor = "pointer";
    }
  };

  button.addEventListener("mouseover", () => {
    if (!button.disabled) {
      button.style.backgroundColor = "#6935d5";
    }
  });

  button.addEventListener("mouseout", () => {
    if (!button.disabled) {
      button.style.backgroundColor = "#7b3ffd";
    } else {
      button.style.backgroundColor = "#b096fd";
    }
  });

  let isProcessing = false;
  
  button.addEventListener("click", async () => {
    if (isProcessing) return; // Prevent multiple clicks while processing
    if (textarea.style.display === "none") {
      textarea.style.display = "block";
    } else {
      const customPrompt = textarea.value.trim();
      processRecreateRequest(customPrompt);
    }

    // Function to process the recreate request
    async function processRecreateRequest(customPrompt) {
      if (isProcessing) return;
      isProcessing = true;
      
      // Disable the button while processing
      setButtonDisabled(true);
      
      
      const text = actionBar.children[1].innerText;
      const data = {
        text: text,
        platform: "linkedin",
        request: customPrompt,
      };

      // Create progress bar container
      const progressContainer = document.createElement("div");
      progressContainer.style.cssText = `
        width: 100%;
        height: 4px;
        background-color: #e0e0e0;
        border-radius: 2px;
        margin-top: 5px;
        overflow: hidden;
      `;
      
      // Create progress bar
      const progressBar = document.createElement("div");
      progressBar.style.cssText = `
        height: 100%;
        width: 0%;
        background-color: #7b3ffd;
        transition: width 0.3s ease;
      `;
      
      progressContainer.appendChild(progressBar);
      buttonContainer.appendChild(progressContainer);
      
      button.innerText = "Recreating...";

      let progress = 0;
      const targetProgress = 95; // Only go to 80% until we get the response
      const animationDuration = 6000;
      const steps = 100;
      const increment = targetProgress / steps;
      const intervalTime = animationDuration / steps;

      const interval = setInterval(() => {
        progress += increment;
        if (progress >= targetProgress) {
          progress = targetProgress;
          clearInterval(interval);
        }
        progressBar.style.width = `${progress}%`;
      }, intervalTime);

      try {
        const response = await recreatePostRequest(
          data,
          endPoint,
          token
        );

        if(response?.message === "Daily limit reached, Please Upgrade Plan") {
          console.log("Daily limit reached, Please Upgrade Plan");
          clearInterval(interval);
          button.style.backgroundColor = "#ff4d4f";
          button.innerText = "Limit Reached";
          buttonContainer.removeChild(progressContainer);
          showErrorMessage(response?.message);
          isProcessing = false;
          setButtonDisabled(false);
          return;
        }

        // Complete the progress bar
        clearInterval(interval);
        progressBar.style.width = '100%';

        button.innerText = "🎉 Success!";

        setTimeout(() => {
          addTextToPost(response?.data?.rewrittenPost);
          button.innerText = "Recreate with AI";
          textarea.style.display = "none";
          textarea.value = "";
          buttonContainer.removeChild(progressContainer);
          isProcessing = false;
          setButtonDisabled(false);
        }, 1500);
      } catch (error) {
        clearInterval(interval);
        button.style.backgroundColor = "#ff4d4f";
        button.innerText = "Error! Try Again";
        buttonContainer.removeChild(progressContainer);
        setTimeout(() => {
          button.style.backgroundColor = "#7b3ffd";
          button.innerText = "Recreate with AI";
          isProcessing = false;
          setButtonDisabled(false);
        }, 1500);
      }
    }
  });

  buttonContainer.appendChild(textarea);
  buttonContainer.appendChild(button);
  return buttonContainer;
}

// Function to add the button to LinkedIn feed posts
export function addRecreateButtonToFeed() {
  const socialActionBars = document.querySelectorAll(
    ".fie-impression-container"
  )

  socialActionBars.forEach((actionBar) => {
    if (!actionBar.querySelector(".recreate-with-ai-button")) {
      const buttonContainer = createRecreateButton(actionBar);
      actionBar.appendChild(buttonContainer);
    }
  });
}