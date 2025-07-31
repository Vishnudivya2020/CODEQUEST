// import React, { useState } from 'react'
// import './Askquestion.css'
// import { useNavigate } from 'react-router-dom'
// import { useEffect } from 'react'
// import { useSelector, useDispatch } from "react-redux"
// import { askquestion } from '../../action/question';
// import VideoUpload from '../VideoUpload/Video.jsx';

// const Askquestion = () => {
//     const navigate = useNavigate();
//     const dispatch=useDispatch();
//     const user = useSelector((state)=>state.currentuserreducer)
    
//     const [questiontitle, setquestiontitle] = useState("");
//     const [questionbody, setquestionbody] = useState("");
//     const [questiontag, setquestiontags] = useState("");
//     const [VideoFilename , setVideoFilename] = useState("");

//     const handlesubmit = (e) => {
//         e.preventDefault();
//         if (user) {
//             if (questionbody && questiontitle && questiontag) {
//                 dispatch(askquestion({
//                     questiontitle,
//                     questionbody,
//                     questiontag,
//                     userposted:user.result.name, 
//                     videopath:VideoFilename
//                 },navigate))
//                 alert("you have successfuly posted a question")

//             } else {
//                 alert("Please enter all the fields")
//             }
//         } else {
//             alert("Login to ask question")
//         }
//     }
//     const handleenter = (e) => {
//         if (e.code === 'Enter') {
//             setquestionbody(questionbody + "\n");
//         }
//     }

//     return (
//         <div className="ask-question">
//             <div className="ask-ques-container">
//                 <h1>Ask a public Question</h1>
//                 <form onSubmit={handlesubmit}>
//                     <div className="ask-form-container">
//                         <label htmlFor="ask-ques-title">
//                             <h4>Title</h4>
//                             <p>Be specific and imagine you're asking a question to another person</p>
//                             <input type="text" id="ask-ques-title"
//                                 onChange={(e) => {
//                                     setquestiontitle(e.target.value);
//                                 }} placeholder='e.g. Is there an R function for finding the index of an element in a vector?' />
//                         </label>
//                         <label htmlFor="ask-ques-body">
//                             <h4>Body</h4>
//                             <p>Include all the information someone would need to answer your question</p>
//                             <textarea name="" id="ask-ques-body" onChange={(e) => {
//                                 setquestionbody(e.target.value);

//                             }}
//                                 cols="30"
//                                 rows="10"
//                                 onKeyDown={handleenter}
//                             ></textarea>
//                         </label>
//                         <label htmlFor="ask-ques-tags">
//                             <h4>Tags</h4>
//                             <p>Add up to 5 tags to descibe what your question is about</p>
//                             <input type="text" id='ask-ques-tags' onChange={(e) => {
//                                 setquestiontags(e.target.value.split(" "));
//                             }}
//                                 placeholder='e.g. (xml typescript wordpress'
//                             />
//                         </label>
//                     </div>
//                     <input type="submit"
//                         value="Review your question"
//                         className='review-btn' />
                        
//                 </form>

//                 <VideoUpload  onVideoUploadSuccess={(filename) => setVideoFilename(filename)}/>
//             </div>
//         </div>
//     )
// }

// export default Askquestion;

// src/pages/Askquestion/Askquestion.jsx
import React, { useState } from 'react';
import './Askquestion.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { askquestion } from '../../action/question';
import VideoUpload from '../VideoUpload/Video.jsx';

const Askquestion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.currentuserreducer);

  const [questiontitle, setQuestionTitle] = useState("");
  const [questionbody, setQuestionBody] = useState("");
  const [questiontag, setQuestionTags] = useState([]);
  const [videoFilename, setVideoFilename] = useState(""); // ✅ filename from VideoUpload

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      return alert("Login to ask a question");
    }

    if (questionbody && questiontitle && questiontag.length > 0) {
      dispatch(askquestion({
        questiontitle,
        questionbody,
        questiontags: questiontag,
        userposted: user.result.name,
        videopath: videoFilename
      }, navigate));
      alert("Your question has been posted!");
    } else {
      alert("Please fill all required fields");
    }
  };

  const handleEnter = (e) => {
    if (e.code === 'Enter') {
      setQuestionBody(questionbody + "\n");
    }
  };

  return (
    <div className="ask-question">
      <div className="ask-ques-container">
        <h1>Ask a Public Question</h1>
        <form onSubmit={handleSubmit}>
          <div className="ask-form-container">
            <label htmlFor="ask-ques-title">
              <h4>Title</h4>
              <p>Be specific and imagine you're asking a question to another person</p>
              <input
                type="text"
                id="ask-ques-title"
                onChange={(e) => setQuestionTitle(e.target.value)}
                placeholder="e.g. How do I center a div in CSS?"
              />
            </label>

            <label htmlFor="ask-ques-body">
              <h4>Body</h4>
              <p>Include all the information someone would need to answer your question</p>
              <textarea
                id="ask-ques-body"
                onChange={(e) => setQuestionBody(e.target.value)}
                onKeyDown={handleEnter}
                cols="30"
                rows="10"
              />
            </label>

            <label htmlFor="ask-ques-tags">
              <h4>Tags</h4>
              <p>Add up to 5 tags to describe what your question is about</p>
              <input
                type="text"
                id="ask-ques-tags"
                onChange={(e) => setQuestionTags(e.target.value.split(" "))}
                placeholder="e.g. react javascript css"
              />
            </label>
          </div>

          <input
            type="submit"
            value="Review your question"
            className="review-btn"
          />
        </form>

        {/* ✅ Video Upload Component */}
        <VideoUpload onVideoUploadSuccess={(filename) => setVideoFilename(filename)} />
      </div>
    </div>
  );
};

export default Askquestion;

