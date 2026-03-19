// User.tsx
import React, { useEffect } from 'react';
import useGetUser from '../../hooks/useUser';
import '../../styles/User.css';

const User = () => {
  const { getUser, isLoading: userLoading } = useGetUser();
  const [userData, setUserData] = React.useState<any>(null);

  useEffect(() => {
    getUser().then((data: any) => {
      setUserData(data);
    });
  }, []);

  const handleLogout = () => {
    window.close();
  };

  return (
    <div className="user-settings">
      <div className="option-card">
        <h2>Account Settings</h2>
        <div className="account-settings">
          {userLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="user-profile">
                {userData?.profileUrl && (
                  <img 
                    src={userData.profileUrl} 
                    alt={userData?.fullName || 'User'} 
                    className="profile-image" 
                  />
                )}
                <div className="user-info">
                  <h3 className="greeting">Hello, {userData?.fullName || 'User'}!</h3>
                  <p className="welcome-message">Welcome to your Postbuddy dashboard</p>
                </div>
              </div>
              
              <div className="account-details">
                <p>Manage your Postbuddy account and subscription settings.</p>
                <div className="user-detail"><strong>Email:</strong> {userData?.email}</div>
              </div>
              
              <div className="action-buttons">
                <button className="button primary-button" onClick={() => window.open('https://postbuddy.ai/plans', '_blank')}>Update Subscription</button>
                <button className="button logout-button" onClick={handleLogout}>Logout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;