import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import { toast } from "react-hot-toast";
import useLoginMutation from "../../hooks/useLogin";
import Loader from "../../components/Loader";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/authSlice";
import { MdEdit } from 'react-icons/md';
// import { IoOptionsSharp } from "react-icons/io5";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");

  // Flow control states
  const [showEmailScreen, setShowEmailScreen] = useState<boolean>(true);
  const [showOtpScreen, setShowOtpScreen] = useState<boolean>(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);

  // UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);

  // References
  const otpRef = useRef<HTMLInputElement>(null);
  const [digitValues, setDigitValues] = useState<string[]>(['', '', '', '', '', '']);

  // API hooks
  const { sendOtp, verifyOtp, resentOtp } = useLoginMutation();

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setUser({ token }));
      navigate("/");
      return;
    }

    // Check for pending OTP verification
    const savedEmail = localStorage.getItem("email");
    const otpSent = localStorage.getItem("otpSent") === "true";

    if (savedEmail) {
      setEmail(savedEmail);

      // If OTP was already sent, go to OTP screen
      if (otpSent) {
        setShowEmailScreen(false);
        setShowOtpScreen(true);

        // Check Chrome storage for additional state
        chrome.storage.sync.get(['otpState'], (result) => {
          if (result.otpState) {
            setIsVerified(result.otpState.isVerified || false);
          }
        });
      }
    }
  }, [dispatch, navigate]);

  // Handle screen transitions with animations
  const handleScreenTransition = (toOtp: boolean, toSuccess: boolean = false) => {
    if (toOtp) {
      // First set state to ensure elements are rendered
      setShowOtpScreen(true);

      // Use requestAnimationFrame to ensure DOM is updated before animations
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const loginModal = document.querySelector('.login-modal');
          const otpContainer = document.querySelector('.otp-container');

          if (loginModal && otpContainer) {
            loginModal.classList.add('slide-out');
            otpContainer.classList.add('slide-in');

            // Set final state after animation completes
            setTimeout(() => {
              setShowEmailScreen(false);
            }, 600);
          } else {
            // Fallback if animation fails - just switch screens
            setShowEmailScreen(false);
            setShowOtpScreen(true);
          }
        });
      });
    } else if (toSuccess) {
      // First set state to ensure elements are rendered
      setShowSuccessScreen(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const otpContainer = document.querySelector('.otp-container');
          const successContainer = document.querySelector('.success-container');

          if (otpContainer && successContainer) {
            otpContainer.classList.add('slide-out');
            successContainer.classList.add('slide-in');

            // Set final state after animation completes
            setTimeout(() => {
              setShowOtpScreen(false);
            }, 600);
          } else {
            // Fallback if animation fails
            setShowOtpScreen(false);
            setShowSuccessScreen(true);
          }
        });
      });
    }
  };

  // Timer for OTP resend
  const startResendTimer = () => {
    setResendDisabled(true);
    setTimer(30);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const emailFound = localStorage.getItem("email");
    if (emailFound) {
      setEmail(emailFound);
    }
  }, [])

  // Handle sending OTP
  const handleSendOtp = async (e: any) => {
    e.preventDefault();
    // Validate email
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.toLowerCase().trim();
      console.log("🚀 Sending OTP to email:", cleanEmail);

      const res = await sendOtp({ email: cleanEmail });
      toast.success("OTP sent successfully!");

      // Store session info in both localStorage and Chrome storage
      localStorage.setItem("email", cleanEmail);
      localStorage.setItem("otpSent", "true");

      // Store additional state in Chrome storage for persistence
      chrome.storage.sync.set({
        otpState: {
          email: cleanEmail,
          isVerified: res?.isVerified || false,
          otpSent: true,
          timestamp: Date.now()
        }
      });

      setIsVerified(res?.isVerified || false);
      startResendTimer();

      // Transition to OTP screen
      handleScreenTransition(true);
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (value: string) => {
    // Only accept digits
    if (!/^\d*$/.test(value)) return;

    // Fill the digit values array
    const digits = value.split('').slice(0, 6);
    const newDigitValues = Array(6).fill('');

    digits.forEach((digit, index) => {
      newDigitValues[index] = digit;
    });

    setDigitValues(newDigitValues);
    setOtp(value);

    // Force re-render to update active position indicator
    setTimeout(() => {
      // This is a hack to force a re-render after state update
      setDigitValues([...newDigitValues]);
    }, 0);

    // Automatically verify when 6 digits are entered
    if (value.length === 6) {
      verifyOtpCode(value);
    }
  };

  // Focus the hidden OTP input when clicking on digits
  const focusOtpInput = () => {
    if (otpRef.current && !otpVerified) {
      otpRef.current.focus();
    }
  };

  useEffect(() => {
    if (showOtpScreen && otpRef.current && !otpVerified) {
      setTimeout(() => {
        otpRef.current?.focus();
      }, 800);
    }
  }, [showOtpScreen, otpVerified]);

  // Verify OTP code
  const verifyOtpCode = async (otpValue: string) => {
    if (otpValue.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP!");
      return;
    }

    setLoading(true);
    try {
      const storedEmail = localStorage.getItem("email") || email;
      console.log("🔍 Verifying OTP for email:", storedEmail);

      const res = await verifyOtp({
        email: storedEmail,
        otp: otpValue,
        fullName: isVerified ? '' : fullName,
      });

      if (res?.token) {
        console.log("✅ OTP verified successfully!");

        // Store token in both localStorage and Chrome storage
        localStorage.setItem("token", res.token);
        chrome.storage.sync.set({
          token: res.token,
          websiteToken: res.token,
          email: storedEmail
        });

        dispatch(setUser({ token: res.token, email: storedEmail }));

        // Show verified state with green digits
        setOtpVerified(true);

        // Store token and enable extension
        localStorage.removeItem("otpSent");
        chrome.storage.sync.remove('otpState');
        chrome.storage.sync.set({ isEnabled: true });

        chrome.runtime.sendMessage({ action: "openPostBuddy" });
        
        // Navigate directly to home with otpVerified flag to trigger animation
        navigate("/", { state: { otpVerified: true } });

      } else {
        toast.error("Invalid response from server.");
      }
    } catch (error: any) {
      console.error("❌ Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "Invalid OTP. Try again.");

      // Clear OTP on failure
      setOtp("");
      setDigitValues(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendDisabled) return;

    setLoading(true);
    try {
      const storedEmail = localStorage.getItem("email") || email;
      await resentOtp({ email: storedEmail });
      toast.success("OTP resent successfully!");
      startResendTimer();

      // Update Chrome storage
      chrome.storage.sync.set({
        otpState: {
          email: storedEmail,
          isVerified: isVerified,
          otpSent: true,
          timestamp: Date.now()
        }
      });

      // Clear previous OTP
      setOtp("");
      setDigitValues(['', '', '', '', '', '']);
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // Back to email screen
  const handleBackToEmail = () => {
    setShowOtpScreen(false);
    setShowEmailScreen(true);
    setOtp("");
    setDigitValues(['', '', '', '', '', '']);
    localStorage.removeItem("otpSent");
    chrome.storage.sync.remove('otpState');
  };
  const handleBack = () => {
    setShowOtpScreen(false);
    setShowEmailScreen(true);
    setOtp('');
    localStorage.removeItem("otpSent");
    chrome.storage.sync.remove('otpState');
  };
  const handleChangeEmail = () => {
    setShowOtpScreen(false);
    setShowEmailScreen(true);
    localStorage.setItem("email", email);
    // setEmail('');
    // setOtp('');
    // Clear stored email
    localStorage.removeItem('email');
    chrome.storage.sync.remove(['savedEmail', 'otpState']);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-main-container">
        {/* Email Screen */}
        {showEmailScreen && (
          <div className="login-modal">
            {/* <div>
              <IoOptionsSharp 
                onClick={() => chrome.runtime.openOptionsPage()}
                style={{ cursor: 'pointer' }}
              />
            </div> */}
            <div className="auth-logo-container">
              <img
                src="https://res.cloudinary.com/ddbzdperq/image/upload/v1738439551/16_ctkp0v.png"
                alt="Post Buddy Logo"
                className="auth-logo"
              />
            </div>

            <div className="auth-title">
              <h2>Supercharge Your Social</h2>
              <h2>Engagement in Seconds with</h2>
              <h2 className="brand-highlight">Post Buddy Ai</h2>
            </div>

            <div className="auth-form">
              <p className="auth-form-label">Enter your email to continue</p>
              <p className="auth-form-sublabel">
                You will receive an email with a one-time password
              </p>
              <form onSubmit={handleSendOtp}>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <button
                  className="auth-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <Loader /> : (
                    <>
                      Next <span className="auth-button-arrow">→</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* OTP Verification Screen */}
        {showOtpScreen && (
          <div className="otp-container">
            <div className="otp-title">OTP Verification</div>
            <div className="otp-subtitle">Enter one-time password</div>

            <div className="otp-email">
              A one-time password has been sent to<br />
              <span className="email-display">
                {email}
                <MdEdit
                  className="edit-icon"
                  onClick={handleChangeEmail}
                  style={{
                    marginLeft: '8px',
                    cursor: 'text !important',
                    fontSize: '20px',
                    color: '#7B6EF6',
                    verticalAlign: 'middle'
                  }}
                />
              </span>
            </div>

            <div className="otp-instruction">
              Enter the 6 digit code we sent you via email to continue.
            </div>

            <div className="otp-input-container" onClick={focusOtpInput}>
              {digitValues.map((digit, index) => (
                <div
                  key={index}
                  className={`otp-digit ${otpVerified ? 'success' :
                    otp.length === 6 && !otpVerified && !loading ? 'error' : ''
                    }`}
                  style={{
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: `2px solid ${index === otp.length ? '#7B6EF6' : '#555'}`,
                    cursor: "text"
                  }}
                >
                  {digit}
                </div>
              ))}
            </div>

            {/* Hidden input for actual OTP handling */}
            <input
              type="text"
              ref={otpRef}
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              onFocus={() => setDigitValues([...digitValues])}
              onKeyDown={(e) => {
                // Force re-render on keypress to update active position indicator
                if (/^\d$/.test(e.key) || e.key === 'Backspace' || e.key === 'Delete') {
                  setDigitValues([...digitValues]);
                }
              }}
              maxLength={6}
              style={{
                position: 'absolute',
                opacity: 0,
                pointerEvents: otpVerified ? 'none' : 'auto',
                cursor: "text",
                outline: 'none'
              }}
              autoFocus
            />

            <div className="resend-text">
              <span className="back-link" onClick={handleBack}>Back</span>
              {resendDisabled ? (
                <span className="timer-text">{` | Try again in ${timer}s`}</span>
              ) : (
                <span
                  className="resend-link"
                  onClick={handleResendOtp}
                > | Resend code</span>
              )}
            </div>

            <button
              className="auth-button"
              onClick={() => verifyOtpCode(otp)}
              disabled={loading || otp.length !== 6 || otpVerified}
            >
              {loading ? <Loader /> : (
                <>
                  Verify <span className="auth-button-arrow">→</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Success Screen */}
        {showSuccessScreen && (
          <div className="success-container">
            <div className="success-title">Congratulation</div>
            <div className="success-subtitle">
              Welcome to <span className="success-name">PostBuddy</span>
            </div>

            <img
              src="https://res.cloudinary.com/ddbzdperq/image/upload/v1738439551/check-success_x2jc7f.png"
              alt="Success"
              className="success-icon"
            />

            <div className="success-message">Thank you</div>
            <div className="success-message-detail">
              Your OTP verification has been completed successfully!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
