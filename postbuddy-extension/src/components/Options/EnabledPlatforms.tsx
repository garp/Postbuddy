// EnabledPlatforms.tsx
import React, { useState } from 'react';
import { PLATFORM_NAMES } from '../../constants/platforms';

interface EnabledPlatformsProps {
  enabledPlatforms: string[];
  onPlatformToggle: (platform: string, isEnabled: boolean) => void;
}

const EnabledPlatforms: React.FC<EnabledPlatformsProps> = ({
  enabledPlatforms,
  onPlatformToggle
}) => {
  return (
    <div className="option-card">
      <h2>Enabled Platforms</h2>
      <div className="platforms-list">
        {Object.keys(PLATFORM_NAMES).map(platform => (
          <div key={platform} className="platform-item">
            <span className="platform-name">
              {PLATFORM_NAMES[platform] || platform}
            </span>
            <label className="switch">
              <input
                type="checkbox"
                checked={enabledPlatforms.includes(platform)}
                onChange={(e) => onPlatformToggle(platform, e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnabledPlatforms;