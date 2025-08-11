import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import "./Homemainbar.css";
import { useEffect } from 'react';
import Questionlist from "./Questionlist.jsx";
import VideoQuestionlist from './Videoquestionlist.jsx';
import { fetchallquestion } from '../../action/question.js';
import {fetchallvideoquestion} from '../../action/Videoquestion.js';


function Homemainbar() {
  const user = useSelector((state) => state.currentuserreducer)
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const questionlist = useSelector((state) => state.questionreducer);
  const videoquestionlist =useSelector((state) =>state.videoquestionreducer);
  

  useEffect(() => {
    dispatch(fetchallquestion()); 
    dispatch(fetchallvideoquestion())
  }, [dispatch]);

  const checkauth = () => {
    if (user === null) {
      alert("Login or signup to ask a question")
      navigate("/Auth")
    } else {
      navigate("/Askquestion")
    }
  };

  return (
    <div className='main-bar'>
      <div className="main-bar-header">
        {location.pathname === "/" ? (
          <h1>Top Question</h1>
        ) : (
          <h1>All Question</h1>

        )}
        <button className="ask-btn" onClick={checkauth}>Ask Question</button>
      </div>
      <div>
        {questionlist.data === null && videoquestionlist.data === null? (
          <h1>Loading......</h1>
        ) : (
          <>
            
            <p>
              {questionlist.data.length} questions —{videoquestionlist.data.length} videoquestions
             
            </p>
           

            <Questionlist questionlist={questionlist.data} />
            <div>
              <h2> Video Q&A Platform</h2>
              <VideoQuestionlist  videoquestionlist={videoquestionlist.data}/>
            </div>
          </>
        )
        }</div>

    </div>
  )
}

export default Homemainbar






