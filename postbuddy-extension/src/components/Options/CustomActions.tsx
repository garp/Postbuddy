// src/components/Options/CustomActions.tsx
import React, { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdClose } from 'react-icons/md';
import '../../styles/CustomActions.css';

interface CustomButton {
  name: string;
  prompt: string;
}

const CustomActions = () => {
  const [showModal, setShowModal] = useState(false);
  const [customButtons, setCustomButtons] = useState<CustomButton[]>([]);
  const [buttonName, setButtonName] = useState('');
  const [buttonPrompt, setButtonPrompt] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    // Load custom buttons from chrome storage
    chrome.storage.sync.get(['customActions'], (result) => {
      setCustomButtons(result.customActions || []);
    });
  }, []);

  const handleSaveButton = () => {
    if (!buttonName || !buttonPrompt) {
      // Display error notification (would use toast in a real implementation)
      console.error('Please provide both name and prompt');
      return;
    }

    const newButton = { name: buttonName, prompt: buttonPrompt };
    
    if (editIndex !== null) {
      // Update existing button
      const updatedButtons = [...customButtons];
      updatedButtons[editIndex] = newButton;
      
      chrome.storage.sync.set({ customActions: updatedButtons }, () => {
        setCustomButtons(updatedButtons);
        setButtonName('');
        setButtonPrompt('');
        setEditIndex(null);
        setShowModal(false);
      });
    } else {
      // Add new button
      chrome.storage.sync.get(['customActions'], (result) => {
        const existingButtons = result.customActions || [];
        const updatedButtons = [...existingButtons, newButton];
        
        chrome.storage.sync.set({ customActions: updatedButtons }, () => {
          setCustomButtons(updatedButtons);
          setButtonName('');
          setButtonPrompt('');
          setShowModal(false);
        });
      });
    }
  };

  const handleEditButton = (index: number) => {
    const buttonToEdit = customButtons[index];
    setButtonName(buttonToEdit.name);
    setButtonPrompt(buttonToEdit.prompt);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDeleteButton = (index: number) => {
    const updatedButtons = customButtons.filter((_, i) => i !== index);
    
    chrome.storage.sync.set({ customActions: updatedButtons }, () => {
      setCustomButtons(updatedButtons);
    });
  };

  const handleAddNewButton = () => {
    setButtonName('');
    setButtonPrompt('');
    setEditIndex(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setButtonName('');
    setButtonPrompt('');
    setEditIndex(null);
  };

  return (
    <div className="custom-actions">
      <div className="option-card">
        <h2>Default Actions</h2>
        <div className="actions-list">
          <div className="action-item">
            <div className="action-info">
              <h3>Quick Reply</h3>
              <p>Predefined responses for common comments</p>
            </div>
            <button className="button button-outline">Configure</button>
          </div>

          <div className="action-item">
            <div className="action-info">
              <h3>Auto-Like</h3>
              <p>Automatically like comments on your posts</p>
            </div>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="action-item">
            <div className="action-info">
              <h3>Post Scheduling</h3>
              <p>Default times for automatic posting</p>
            </div>
            <button className="button button-outline">Set Schedule</button>
          </div>
        </div>
      </div>

      <div className="option-card">
        <div className="card-header">
          <h2>Custom Buttons</h2>
          <button className="add-button" onClick={handleAddNewButton}>Add Button</button>
        </div>
        
        {customButtons.length > 0 && (
          <div className="custom-buttons-list">
            {customButtons.map((button, index) => (
              <div key={index} className="custom-button-item">
                <span>{button.name}</span>
                <div className="button-actions">
                  <button
                    onClick={() => handleEditButton(index)}
                    className="edit-button"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteButton(index)}
                    className="delete-button"
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="custom-button-modal">
            <div className="modal-header">
              <h2>Premium: Custom Buttons (Personalities)</h2>
              <button className="close-button" onClick={closeModal}>
                <MdClose />
              </button>
            </div>

            <div className="modal-content">
              <div className="form-group">
                <label className="form-label">Button Name</label>
                <input
                  type="text"
                  value={buttonName}
                  onChange={(e) => setButtonName(e.target.value)}
                  className="form-input"
                  placeholder="Customize your button"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prompt for your button</label>
                <textarea
                  value={buttonPrompt}
                  onChange={(e) => setButtonPrompt(e.target.value)}
                  className="form-textarea"
                  placeholder="Customize your prompt"
                  rows={4}
                />
              </div>

              <button
                className="gradient-button"
                onClick={handleSaveButton}
              >
                Save Button <span className="button-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomActions;