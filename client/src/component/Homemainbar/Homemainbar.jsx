import React from 'react';
import { useLocation , useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import "./Homemainbar.css";
import { useEffect } from 'react';
import Questionlist from "./Questionlist.jsx";
 import { fetchallquestion } from '../../action/question.js';

function Homemainbar  ()  {
  const user = useSelector((state)=>state.currentuserreducer)
  const location = useLocation();
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const questionlist = useSelector((state)=>state.questionreducer);
 
   useEffect(() => {
    dispatch(fetchallquestion()); //  Fetch questions 
  }, [dispatch]);

  const checkauth = () =>{
    if(user === null){
      alert ("Login or signup to ask a question")
      navigate("/Auth")
    }else{
      navigate("/Askquestion")
    }
  };

 

  // console.log("questionList",questionlist)
  return (
    <div className='main-bar'>
     <div className="main-bar-header">
    {location.pathname === "/" ? (
      <h1>Top Question</h1>
    ):(
      <h1>All Question</h1>
    
    )}
    <button className="ask-btn" onClick={checkauth}>Ask Question</button>
     </div>
     <div>
      {questionlist.data === null ? (
        <h1>Loading......</h1>
      ):(
        <>
        <p>{questionlist.data.length} questions</p>
        <Questionlist questionlist={questionlist.data}/>
        </>
      )
     }</div>
    
     </div>
  )
}

export default Homemainbar


