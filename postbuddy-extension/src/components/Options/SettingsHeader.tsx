import React from 'react';

const SettingsHeader = () => {
  return (
    <div className="settings-header">
      <img 
        src="https://postbuddy.ai/favicon.ico" 
        alt="Postbuddy Logo" 
        className="logo" 
      />
      <h1 style={{paddingTop:"10px"}}>Postbuddy Settings</h1>
    </div>
  );
};

export default SettingsHeader;