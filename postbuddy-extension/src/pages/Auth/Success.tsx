import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import './Success.css';

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/', { state: { otpVerified: true } });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="success-container">
      <div className='success-header'>
        <h1>Congratulations!</h1>
        <h2>Welcome to the <span style={{ color: "#007bff" }}>Postbuddy</span></h2>
      </div>
      <Player
        src="../../assets/ZGH1DUadTl.lottie"
        autoplay
        loop={false}
      />
      <div className='success-footer'>
        <h2>Thank you</h2>
        <h3>Your OTP verification has been completed successfully!</h3>
      </div>
    </div>
  );
}
