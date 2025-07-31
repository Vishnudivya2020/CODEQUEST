

import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = ({ toggle }) => {
  const [question, setQuestion] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question || !email) return alert("Please enter question and email!");

    try {
      const res = await axios.post("http://localhost:5000/api/chatbot/send-otp", {
        question,
        email
      });

      alert("OTP sent to your email");
      setShowOtp(true);
    }catch(err){
      //if backend send a specific error message(like java-related)
      if(err.response && err.response.data && err.response.data.message){
        setAnswer(err.response.data.message);
      }else{
        alert("Failed to send question")
      }
    }
  };


  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/chatbot/verify-otp", {
        email,
        otp,
        question
      });

      setAnswer(res.data.answer || res.data.message);
      setShowOtp(false);
      setQuestion("");
      setOtp("");
    } catch (err) {
      console.error(err);
      alert("OTP verification failed.");
    }
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
          </>
        )}

        {answer && <p className="answerBox" >{answer}</p>}

        {/* <span className="closeBtn" onClick={toggle}>&times;</span> */}
      </div>
    </div>
  );
};

export default Chatbot;


