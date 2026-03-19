import { useState, useEffect } from "react";

export default function Switch() {
  const [isActive, setIsActive] = useState(false); // Start with false by default

  // Load the activation state from Chrome storage when the component mounts
  useEffect(() => {
    chrome.storage.sync.get(['isActive'], (result) => {
      if (result.isActive !== undefined) {
        setIsActive(result.isActive);
      }
    });
  }, []);

  const toggleActivation = () => {
    const newState = !isActive; // Toggle the state
    setIsActive(newState);
    
    // Save the new state to Chrome storage
    chrome.storage.sync.set({ isActive: newState }, () => {
      console.log(newState ? 'Extension activated' : 'Extension deactivated');
    });

    // Send a message to update the extension state if needed
    chrome.runtime.sendMessage({ action: "toggleActivation", isActive: newState });
  };

  return (
    <div className="switch-container" style={{ display: 'flex', gap: '20px' }}>
      {/* Enable Button */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label>{"Enable"}</label>
        <div
          className={`switch ${isActive ? "switch-enabled" : ""}`}
          onClick={toggleActivation}
        >
          <div
            className={`switch-circle ${isActive ? "switch-circle-enabled" : ""}`}
          ></div>
        </div>
      </div>
    </div>
  );
}
