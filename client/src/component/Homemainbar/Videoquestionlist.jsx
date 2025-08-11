import React from 'react'
import VideoQuestion from '../videoList/videoQuestion';

function VideoQuestionlist({videoquestionlist}) {
  
  return (
    <>
    {videoquestionlist.map((videoquestion)=>(
      <VideoQuestion videoquestion={videoquestion} key ={videoquestion._id}/>
    ))}
    </>
  )
}

export default VideoQuestionlist