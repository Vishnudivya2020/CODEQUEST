import logo from "../src/assets/logo.png";
import { fetchallusers } from "./action/users.js";
import './App.css';
import { useEffect,useState } from 'react';
import Navbar from "./component/Navbar/navbar.jsx";
import { BrowserRouter as Router } from 'react-router-dom';
import Allroutes from "./pages/Allroutes.jsx";
import { useDispatch } from 'react-redux';
import Chatbot from "./component/Chatbot/Chatbot.jsx";
import ChatbotIcon from "./component/Chatbot/chatbotIcon.jsx";

function App() {
  const [slidein,setSlidein]=useState(true);
  const [showChat, setShowChat]=useState(false);

  const dispatch =useDispatch()
 useEffect(()=>{
  dispatch(fetchallusers());
 },[dispatch])
 
 
  useEffect(()=>{
    if(window.innerWidth <= 768){
      setSlidein(false)
    }
  },[])
  const handleslidein=()=>{
    if(window.innerWidth<=768){
      setSlidein((state)=>!state);
    }
  };

  //chatbot
  const toggleChat = () =>setShowChat(!showChat);
  return (
    <div className="App">
      <Router>
 <Navbar  handleslidein={handleslidein}/> 
      <Allroutes slidein={slidein} handleslidein={handleslidein} /> 
     {showChat && <Chatbot toggle={toggleChat}/>}
     <ChatbotIcon toggle={toggleChat}/>
      </Router>
    
    </div>
  ); 
}

export default App;
