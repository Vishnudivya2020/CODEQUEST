
import React from 'react';
import { Link } from 'react-router-dom';
import moment from "moment";

const VideoInfo = ({ videoquestion }) => {
  return (
    <div className="display-question-container">
      <div className="display-votes-ans">
        <p>{videoquestion.upvote.length - videoquestion.downvote.length}</p>
        <p>votes</p>
      </div>
      <div className="display-votes-ans">
        <p>{videoquestion.noofanswers}</p>
        <p>answers</p>
      </div>
      <div className="display-question-details">
        <Link to={`/videoquestion/${videoquestion._id}`} className='question-title-link'>
          {videoquestion.Videoquestiontitle.length > (window.innerWidth <= 400 ? 70 : 90)
            ? videoquestion.Videoquestiontitle.substring(
                0,
                window.innerWidth <= 400 ? 70 : 90
              ) + "..."
            : videoquestion.Videoquestiontitle
          }
        </Link>
       
        <div className="display-tags-time">
          <div className="display-tags">
            {videoquestion.Videoquestiontags.map((tag) => (
              <p key={tag}> {tag}</p>
            ))}
          </div>
          <p className="display-time">
            asked {moment(videoquestion.askedon).fromNow()} {videoquestion.userposted}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
