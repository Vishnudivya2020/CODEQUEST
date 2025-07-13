import logo from "../src/assets/logo.png";
import { fetchallusers } from "./action/users.js";
import './App.css';
import { useEffect,useState } from 'react';
import Navbar from "./component/Navbar/navbar.jsx";
import { BrowserRouter as Router } from 'react-router-dom';
import Allroutes from "./pages/Allroutes.jsx";
import { useDispatch } from 'react-redux';

function App() {
  const [slidein,setSlidein]=useState(true);
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
  return (
    <div className="App">
      <Router>
 <Navbar  handleslidein={handleslidein}/> 
      <Allroutes slidein={slidein} handleslidein={handleslidein} /> 
      </Router>
    
    </div>
  ); 
}

export default App;
