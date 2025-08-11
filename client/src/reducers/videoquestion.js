

const videoquestionreducer = (state = { data: [] }, action) => {
  switch (action.type) {
    case "POST_VIDEOQUESTION":
      return { ...state };
    case "FETCH_ALL_VIDEOQUESTIONS":
      return { ...state, data: action.payload };
    case "POST_VIDEO_ANSWER":
      return { ...state };
    default:
      return state;
  }
};

export default videoquestionreducer;
