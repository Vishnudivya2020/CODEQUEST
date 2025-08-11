import React from "react";

const VideoQuestionForm = ({ title, setTitle, body, setBody, tags, setTags, onVideoChange }) => {
  return (
    <div className="video-form-fields">
      <label htmlFor="Upload Video">
        <h4>Choose File</h4>
      <input type="file" accept="video/*" onChange={onVideoChange} /></label>

      <label htmlFor="Title">
        <h4>Title</h4>
      <input
        type="text"
        placeholder="Enter video title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      /></label>
    
    <label htmlFor="Body">
      <h4>Body</h4>
      <textarea
        placeholder="Enter video description"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      ></textarea></label>

     <label htmlFor="tags">
      <h4>Tags</h4>
      <input
        type="text"
        placeholder="Enter comma-separated tags"
        onChange={(e) => {
          const parsedTags = e.target.value.split(",").map(tag => tag.trim());
          setTags(parsedTags);
        }}
      /></label>
    </div>
  );
};

export default VideoQuestionForm;
