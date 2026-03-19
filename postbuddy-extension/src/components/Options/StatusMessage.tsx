// src/components/Options/StatusMessage.tsx
import React from 'react';

const StatusMessage = () => {
  const handleOpenExtension = () => {
    chrome.runtime.sendMessage(
      { action: "openPopup" },
      (response) => {
        if (!response?.success) {
          chrome.tabs.create({
            url: chrome.runtime.getURL("js/index.html"),
          });
        }
      }
    );
  };

  return (
    <div className="status-message">
      <div className="status-text">
        Please log in to access all features
      </div>
      <button 
        className="primary-button login-button"
        onClick={handleOpenExtension}
      >
        Open Postbuddy
      </button>
    </div>
  );
};

export default StatusMessage;