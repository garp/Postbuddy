import React, { useEffect, useState } from 'react';
// import { BASEURL } from '../api/BASEURL';
import SettingsHeader from '../components/Options/SettingsHeader';
// import AccountSettings from '../components/Options/AccountSettings';
import EnabledPlatforms from '../components/Options/EnabledPlatforms';
import StatusMessage from '../components/Options/StatusMessage';
import { PLATFORM_NAMES } from '../constants/platforms';
import { showToast } from '../utils/toast';
import './Options.css';
import User from '../components/Options/User';
import CustomActions from '../components/Options/CustomActions';

type TabType = 'user' | 'platforms' | 'custom-actions';

const Options = () => {
  const [enabledPlatforms, setEnabledPlatforms] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('user');

  useEffect(() => {
    // Load enabled platforms
    chrome.storage.sync.get(['enabledPlatforms'], (result) => {
      setEnabledPlatforms(result.enabledPlatforms || []);
    });
    chrome.storage.sync.get(['token'], (result) => {
      setIsLoggedIn(!!result.token);
    });
  }, []);

  const handlePlatformToggle = (platform: string, isEnabled: boolean) => {
    let updatedPlatforms;
    if (isEnabled) {
      updatedPlatforms = [...enabledPlatforms, platform];
    } else {
      updatedPlatforms = enabledPlatforms.filter(p => p !== platform);
    }
    
    setEnabledPlatforms(updatedPlatforms);
    chrome.storage.sync.set({ enabledPlatforms: updatedPlatforms });
    
    const platformName = PLATFORM_NAMES[platform] || platform;
    showToast(
      `Extension ${isEnabled ? 'Enabled' : 'Disabled'} for ${platformName}`,
      platform
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'user':
        return <User />;
      case 'platforms':
        return (
          <EnabledPlatforms 
            enabledPlatforms={enabledPlatforms}
            onPlatformToggle={handlePlatformToggle}
          />
        );
      case 'custom-actions':
        return <CustomActions />;
      default:
        return <User />;
    }
  };

  return (
    <div className="container">
      <SettingsHeader />
      
      {/* Tab Navigation */}
      <div className="tabs-container">
        <nav className="tabs-nav">
          <button
            className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => setActiveTab('user')}
          >
            User
          </button>
          <button
            className={`tab-button ${activeTab === 'platforms' ? 'active' : ''}`}
            onClick={() => setActiveTab('platforms')}
          >
            Enabled Platforms
          </button>
          <button
            className={`tab-button ${activeTab === 'custom-actions' ? 'active' : ''}`}
            onClick={() => setActiveTab('custom-actions')}
          >
            Custom Actions
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="tab-content">
        {renderActiveTab()}
      </div>
      
      {!isLoggedIn && activeTab === 'user' && <StatusMessage />}
    </div>
  );
};

export default Options;