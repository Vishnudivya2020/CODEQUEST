import React from 'react';
import { Routes , Route } from 'react-router-dom';
import Home from './Home.jsx';
import Askquestion from './Askquestion/Askquestion.jsx';
import Question from './Question/Question.jsx';
import Auth  from "./Auth/Auth.jsx";
import Tags from './Tags/Tags.jsx';
import Displayquestion from './Question/Displayquestion.jsx';
import Userprofile from './Userprofile/Userprofile.jsx';
import Users from './Users/Users.jsx';


function Allroutes({slidein ,handleslidein}) {
  return (
   <Routes>
    <Route path='/' element={<Home slidein={slidein} handleslidein={handleslidein}/>}/>
    <Route path='/Askquestion' element ={<Askquestion />}/>
  <Route path='/Auth' element ={<Auth />}/>
  <Route path='/Question' element={<Question slidein={slidein} handleslidein={handleslidein}/>}/>
  <Route path='/Question/:id' element={<Displayquestion slidein={slidein} handleslidein={handleslidein}/>}/>
  <Route path='/Tags' element={<Tags slidein={slidein} handleslidein={handleslidein}/>}/>
  <Route path='/Users' element={<Users slidein={slidein} handleslidein={handleslidein}/>}/>
   <Route path='/Users/:id' element={<Userprofile slidein={slidein} handleslidein={handleslidein}/>}/>
  </Routes>
  )
}

export default Allroutes