import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiLogOut } from 'react-icons/fi';
import { FaDatabase } from 'react-icons/fa';
import { MdEdit, MdDelete, MdCancel } from 'react-icons/md';
import { logout } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';
import usePlanQuery from '../hooks/usePlan';
import useGetUser from '../hooks/useUser';
import useGetBrandVoice from '../hooks/useBrandVoice';
import '../styles/Home.css';
import { Player } from '@lottiefiles/react-lottie-player';
import './Auth/Success.css';
import { IoOptionsSharp } from "react-icons/io5";
import HomeLoader from '../components/HomeLoader/HomeLoader';
import { FRONTEND_URL } from '../api/BASEURL';

interface CustomButton {
  name: string;
  prompt: string;
}

// Accordion type enum for better management
enum AccordionType {
  NONE = 'NONE',
  CONFIG = 'CONFIG',
  CUSTOM_BUTTONS = 'CUSTOM_BUTTONS'
}

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getUser, isLoading: userLoading } = useGetUser();
  const { getBrandVoice, isLoading: brandVoiceLoading } = useGetBrandVoice()
  const { credsCount, isLoading: credsLoading } = usePlanQuery();
  const [userData, setUserData] = useState<any>(null);
  const [brandVoiceData, setBrandVoiceData] = useState<any>(null);
  const location = useLocation();
  const lottiePlayerRef = useRef<any>(null);

  // Add state for OTP verification animation
  const [showOtpAnimation, setShowOtpAnimation] = useState(false);

  // States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [credits, setCredits] = useState(0);
  const [isEnabled, setIsEnabled] = useState(true);

  // Single accordion state to manage which one is open
  const [openAccordion, setOpenAccordion] = useState<AccordionType>(AccordionType.NONE);

  // Form states
  const [wordLimit, setWordLimit] = useState(50);
  const [replyTone, setReplyTone] = useState('');
  const [brandVoice, setBrandVoice] = useState('');
  const [toneIntent, setToneIntent] = useState('');
  const [customButtons, setCustomButtons] = useState<CustomButton[]>([]);

  // Custom button form states
  const [buttonName, setButtonName] = useState('');
  const [buttonPrompt, setButtonPrompt] = useState('');

  // Edit mode state
  const [editingButtonIndex, setEditingButtonIndex] = useState<number | null>(null);

  useEffect(() => {
    // Check for OTP verification success from location state
    if (location.state?.otpVerified) {
      setShowOtpAnimation(true);
    }

    // Check for token in Chrome storage
    chrome.storage.sync.get(['token'], (result) => {
      if (!result.token) {
        // If no token found, redirect to login
        navigate('/login');
      }
    });

    // Load user data
    getUser().then((data) => {
      setUserData(data);
      setUsername(data.fullName || data.email);
      setEmail(data.email);
    });

    getBrandVoice().then((data) => {
      console.log("Brand Voice ==> ", data);
      setBrandVoiceData(data);
    }).catch((error) => {
      console.log("Error ==> ", error);
    });

    // Load credits
    credsCount().then(count => setCredits(count));

    // Load configuration from chrome storage
    chrome.storage.sync.get(
      ['wordLimit', 'replyTone', 'toneIntent', 'brandVoice', 'isEnabled', 'customActions'],
      (result) => {
        setWordLimit(result.wordLimit || 50);
        setReplyTone(result.replyTone || '');
        setToneIntent(result.toneIntent || '');
        setBrandVoice(result.brandVoice || '');
        setIsEnabled(result.isEnabled !== undefined ? result.isEnabled : true);
        setCustomButtons(result.customActions || []);
      }
    );
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    chrome.storage.sync.set({ isEnabled: newState });
    toast.success(`Extension ${newState ? 'enabled' : 'disabled'}`);
  };

  const saveConfiguration = (e: React.MouseEvent) => {
    e.stopPropagation();
    chrome.storage.sync.set({
      wordLimit,
      replyTone,
      toneIntent,
      brandVoice,
    }, () => {
      toast.success('Configuration saved!');
    });
  };

  const handleCustomButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!buttonName || !buttonPrompt) {
      toast.error('Please provide both name and prompt');
      return;
    }

    const newButton = { name: buttonName, prompt: buttonPrompt };
    chrome.storage.sync.get(['customActions'], (result) => {
      const existingButtons = result.customActions || [];
      
      if (editingButtonIndex !== null) {
        // Update existing button
        const updatedButtons = [...existingButtons];
        updatedButtons[editingButtonIndex] = newButton;
        chrome.storage.sync.set({ customActions: updatedButtons }, () => {
          setCustomButtons(updatedButtons);
          toast.success('Button updated successfully!');
          // Reset form and edit mode
          setButtonName('');
          setButtonPrompt('');
          setEditingButtonIndex(null);
        });
      } else {
        // Add new button
        const updatedButtons = [...existingButtons, newButton];
        chrome.storage.sync.set({ customActions: updatedButtons }, () => {
          setCustomButtons(updatedButtons);
          toast.success('Button saved successfully!');
          // Reset form
          setButtonName('');
          setButtonPrompt('');
        });
      }
    });
  };

  const deleteCustomButton = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent accordion toggle
    const updatedButtons = customButtons.filter((_, i) => i !== index);
    chrome.storage.sync.set({ customActions: updatedButtons }, () => {
      setCustomButtons(updatedButtons);
      
      // If the button being deleted was in edit mode, reset the form
      if (editingButtonIndex === index) {
        setButtonName('');
        setButtonPrompt('');
        setEditingButtonIndex(null);
      }
      
      toast.success('Custom Button removed successfully!');
    });
  };

  const handleEditButton = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent accordion toggle

    // Get the button to edit
    const buttonToEdit = customButtons[index];

    // Set input fields with the button's data
    setButtonName(buttonToEdit.name);
    setButtonPrompt(buttonToEdit.prompt);
    
    // Set edit mode
    setEditingButtonIndex(index);
  };
  
  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Reset form and edit mode
    setButtonName('');
    setButtonPrompt('');
    setEditingButtonIndex(null);
    toast.success('Editing canceled');
  };

  // Toggle accordion function that ensures only one is open at a time
  const toggleAccordion = (accordionType: AccordionType, e: React.MouseEvent) => {
    // Toggle the accordion state regardless of exactly where in the header was clicked
    setOpenAccordion(openAccordion === accordionType ? AccordionType.NONE : accordionType);
  };

  // Handle animation complete
  const handleAnimationComplete = () => {
    // Remove the OTP verification flag from location state
    if (location.state?.otpVerified) {
      navigate('/', { replace: true });
    }
    setShowOtpAnimation(false);
  };

  if (showOtpAnimation) {
    return (
      <div className="success-container">
        <div className='success-header'>
          <h1>Congratulations!</h1>
          <h2>Welcome to the <span style={{ color: "#007bff" }}>Postbuddy</span></h2>
        </div>
        <Player
          ref={lottiePlayerRef}
          src="https://lottie.host/a36f9790-924f-48e8-a0ad-04bc31ea9c8b/31Zyq85VST.json"
          className="lottie-player"
          loop={false}
          autoplay={true}
          style={{ paddingLeft: "10px" }}
          onEvent={event => {
            if (event === 'complete') {
              handleAnimationComplete();
            }
          }}
        />
        <div className='success-footer'>
          <h2>Thank you</h2>
          <h3>Your OTP verification has been completed successfully!</h3>
        </div>
      </div>
    );
  }

  if (userLoading || credsLoading) {
    return (
      <div className='home-loader'>
        <HomeLoader />
      </div>
    )

  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-user-info">
          <div className="header-greeting">Hello</div>
          <div className="header-username">{username.split(" ")[0]}</div>
        </div>

        <div className="header-actions">
          <div>
            <IoOptionsSharp
              onClick={() => chrome.runtime.openOptionsPage()}
              style={{ cursor: 'pointer', fontSize: "30px", paddingTop: "5px" }}
            />
          </div>
          <div
            className={`toggle-container ${isEnabled ? 'active' : 'inactive'}`}
            onClick={handleToggle}
          >
            <div className={`toggle-handle ${isEnabled ? 'active' : 'inactive'}`}></div>
          </div>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            <FiLogOut /> Log out
          </button>
        </div>
      </header>
      <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(255, 255, 255, 0.2)" }}></div>
      <div className="credits-section">
        <div className="credits-left">
          <FaDatabase className="icon" />
          <span className="credits-label">Credit Left</span>
          <span className="credits-amount">{credits}</span>
        </div>

        {(credits <= 0 || true) && (
          <a
            href="https://postbuddy.ai/plans"
            target="_blank"
            rel="noreferrer"
            className="explore-plans"
            style={{
              color: '#E67CE3',
              fontSize: "16px"
            }}
          >
            Explore Plans
          </a>
        )}
      </div>
      <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(255, 255, 255, 0.2)", marginBottom: "20px" }}></div>
      <div className="content-container">
        <div className="card">
          <div className="card-header" onClick={(e) => toggleAccordion(AccordionType.CONFIG, e)}>
            <span className="card-title">Postbuddy Configuration</span>
            <span className={`card-toggle ${openAccordion === AccordionType.CONFIG ? 'open' : ''}`}>+</span>
          </div>

          {openAccordion === AccordionType.CONFIG && (
            <div className="card-content" onClick={(e) => e.stopPropagation()}>
              <div className="form-group-container">
                <div className="form-group form-group-container-item">
                  <label className="form-label">Word Limit</label>
                  <select
                    className="form-select"
                    value={wordLimit}
                    onChange={(e) => setWordLimit(Number(e.target.value))}
                  >
                    <option value={50}>less than 50</option>
                    <option value={150}>less than 150</option>
                    <option value={250}>less than 250</option>
                  </select>
                </div>

                <div className="form-group form-group-container-item">
                  <label className="form-label">Reply Tone</label>
                  <select
                    className="form-select"
                    value={replyTone}
                    onChange={(e) => setReplyTone(e.target.value)}
                  >
                    <option value="">Select tone</option>
                    <option value="Formal">Formal</option>
                    <option value="Casual">Casual</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
              </div>

              <div className="form-group-container">
                <div className="form-group form-group-container-item">
                  <label className="form-label">Tone Intent</label>
                  <select
                    className="form-select"
                    value={toneIntent}
                    onChange={(e) => setToneIntent(e.target.value)}
                  >
                    <option value="">Select tone intent</option>
                    <option value="Supportive">Supportive</option>
                    <option value="Informative">Informative</option>
                    <option value="Persuasive">Persuasive</option>
                  </select>
                </div>

                <div className="form-group form-group-container-item">
                  <div className="label-with-action">
                    <label className="form-label">Brand Voice</label>
                    <a href={`${FRONTEND_URL}/brand-voice/${userData?._id}`} target="_blank" rel="noreferrer" className="add-new-button">
                      <span>+ Add new</span>
                    </a>
                  </div>
                  <select
                    className="form-select"
                    value={brandVoice}
                    onChange={(e) => setBrandVoice(e.target.value)}
                  >
                    <option value="">Select brand voice</option>
                    {
                      brandVoiceData?.map((item: any) => (
                        <option key={item._id} value={item._id}>{item.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <button
                className="gradient-button"
                onClick={saveConfiguration}
              >
                Save Configuration <span className="button-arrow">→</span>
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header" onClick={(e) => toggleAccordion(AccordionType.CUSTOM_BUTTONS, e)}>
            <span className="card-title">Premium: Custom Buttons (Personalities)</span>
            <span className={`card-toggle ${openAccordion === AccordionType.CUSTOM_BUTTONS ? 'open' : ''}`}>+</span>
          </div>

          {openAccordion === AccordionType.CUSTOM_BUTTONS && (
            <div className="card-content" onClick={(e) => e.stopPropagation()}>
              {customButtons.length > 0 && (
                <div className="custom-buttons-list">
                  {customButtons.map((button, index) => (
                    <div key={index} className="custom-button-item">
                      <span>{button.name}</span>
                      <div className="button-actions">
                        <button
                          onClick={(e) => handleEditButton(index, e)}
                          className="edit-button"
                          disabled={editingButtonIndex !== null}
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={(e) => deleteCustomButton(index, e)}
                          className="delete-button"
                          disabled={editingButtonIndex !== null}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

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

              <div className="button-container" style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="gradient-button"
                  onClick={handleCustomButton}
                >
                  {editingButtonIndex !== null ? 'Update Button' : 'Save Button'} <span className="button-arrow">→</span>
                </button>
                
                {editingButtonIndex !== null && (
                  <button
                    className="cancel-button"
                    onClick={cancelEditing}
                    style={{ 
                      backgroundColor: '#6c757d', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '5px', 
                      padding: '10px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <MdCancel /> Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="dashboard-footer">
        <span style={{ color: "white", display: "flex", flexDirection: "row", gap: "2px" }}>
          Having issues?
          <a
            href="https://postbuddy.ai/report-bug"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >Report a bug</a>
        </span>
        <span className='footer-text'>All set! Start engaging</span>
        <span style={{ color: "white", display: "flex", flexDirection: "row", gap: "2px" }}>
          want a feature?
          <a
            href="https://postbuddy.ai/feature-request"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >Request a feature</a>
        </span>
      </footer>
    </div>
  );
}
