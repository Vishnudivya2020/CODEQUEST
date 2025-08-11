import * as api from "../api";


export const askvideoquestion = (videoquestiondata, navigate) => async (dispatch) => {
    try {
        const { data } = await api.postvideoquestion(videoquestiondata);
        dispatch({ type: "POST_VIDEOQUESTION", payload: data });
        dispatch(fetchallvideoquestion());
        navigate("/videofeed");
    } catch (error) {
        console.log(error);
    }
};


export const fetchallvideoquestion = () => async (dispatch) => {
    try {
        const { data } = await api.getallvideoquestions();
        dispatch({ type: "FETCH_ALL_VIDEOQUESTIONS", payload: data });
    } catch (error) {
        console.log(error);
    }
};


export const deletevideoquestion = (id, navigate) => async (dispatch) => {
    try {
        await api.deletevideoquestion(id);
        dispatch(fetchallvideoquestion());
        navigate("/");
    } catch (error) {
        console.log(error);
    }
};


export const votequestion = (id, value) => async (dispatch) => {
    try {
        await api.voteVideoQuestion(id, value); 
        dispatch(fetchallvideoquestion());
    } catch (error) {
        console.log(error);
    }
};


export const postvideoanswer = (answerdata) => async (dispatch) => {
    try {
        const { id, noofanswers, answerbody, useranswered, userid } = answerdata;
        const { data } = await api.postvideoanswer(id, noofanswers, answerbody, useranswered, userid);
        dispatch({ type: "POST_VIDEO_ANSWER", payload: data });
        dispatch(fetchallvideoquestion());
    } catch (error) {
        console.log(error);
    }
};


export const deletevideoanswer=(id,answerid,noofanswers)=>async(dispatch)=>{
    try {
        await api.deletevideoanswer(id,answerid,noofanswers);
        dispatch(fetchallvideoquestion())
    } catch (error) {
        console.log(error)
    }
};
