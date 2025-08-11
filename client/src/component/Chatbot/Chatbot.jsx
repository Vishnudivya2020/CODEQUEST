import React, { useState, useEffect } from 'react';
import './Chatbot.css';
import { sendOtpToUser, verifyOtpAnswer } from '../../api/index.js';

const Chatbot = ({ toggle }) => {
  const [question, setQuestion] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(0); // seconds
  const [canResend, setCanResend] = useState(false);

  // Countdown effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && showOtp) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, showOtp]);

  const startTimer = () => {
    setTimer(2 * 60);
    setCanResend(false);
  };

  const handleSend = async () => {
    if (!question || !email) return alert("Please enter question and email!");

    try {
      await sendOtpToUser(email, question);
      alert("OTP sent to your email");
      setShowOtp(true);
      startTimer();
    } catch (err) {
      if (err.response?.data?.message) {
        setAnswer(err.response.data.message);
      } else {
        alert("Failed to send question");
      }
    }
  };

  const handleResend = async () => {
    if (!email) return alert("Enter email first!");
    try {
      await sendOtpToUser(email, question);
      alert("OTP resent to your email");
      startTimer();
    } catch (err) {
      alert("Failed to resend OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOtpAnswer(email, otp, question);
      setAnswer(res.answer || res.message);
      setShowOtp(false);
      setQuestion("");
      setOtp("");
    } catch (err) {
      console.error(err);
      alert("OTP verification failed.");
    }
  };

  // Convert seconds to mm:ss format
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="chatboxContainer">
      <div className="chatbox">
        <h3>Ask Your Programming Question</h3>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question..."
        />
        <button onClick={handleSend}>Send</button>

        {showOtp && (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button onClick={handleVerifyOtp}>Enter</button>

            <div style={{ marginTop: "10px" }}>
              {timer > 0 ? (
                <span>Time left: {formatTime(timer)}</span>
              ) : (
                <span>OTP expired</span>
              )}
            </div>

            <button
              onClick={handleResend}
              disabled={!canResend}
              style={{ marginTop: "5px" }}
            >
              Resend OTP
            </button>
          </>
        )}

        {answer && <p className="answerBox">{answer}</p>}
      </div>
    </div>
  );
};

export default Chatbot;

