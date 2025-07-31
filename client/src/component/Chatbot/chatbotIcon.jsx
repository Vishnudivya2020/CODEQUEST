import React from 'react';
import './Chatbot.css';
import { FaRobot } from 'react-icons/fa';

const ChatbotIcon = ({ toggle }) => {
  return (
    <div className="chatbotIcon" onClick={toggle}>
      <FaRobot size={30} />
    </div>
  );
};

export default ChatbotIcon;
