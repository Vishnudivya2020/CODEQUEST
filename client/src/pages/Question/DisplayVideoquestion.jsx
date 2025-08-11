import React from 'react'
import Leftsidebar from '../../component/Leftsidebar/Leftsidebar';
import Rightsidebar from '../../component/Rightsidebar/Rightsidebar'
import VideoQustiondetails from './VideoquestionDetails';

const DisplayVideoquestion = ({slidein}) => {
  return (
    <div className="home-container-1">
      <Leftsidebar slidein={slidein}/>
      <div className="home-container-2">
        <VideoQustiondetails/>
        <Rightsidebar/>
      </div>
    </div>
  )
}

export default DisplayVideoquestion;