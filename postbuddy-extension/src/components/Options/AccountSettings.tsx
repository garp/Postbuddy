// src/components/Options/AccountSettings.tsx
import React from 'react';

interface AccountSettingsProps {
  isLoggedIn: boolean;
  onUpdateClick: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ 
  isLoggedIn, 
  onUpdateClick 
}) => {
  return (
    <div className="option-group">
      <h2>Account Settings</h2>
      <p>Manage your Postbuddy account and subscription settings.</p>
      {isLoggedIn && (
        <div className="button-container">
          <button 
            id="updateButton" 
            className="primary-button"
            onClick={onUpdateClick}
          >
            Update Subscription
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;