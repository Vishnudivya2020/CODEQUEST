import {combineReducers} from "redux"
import authreducer from "./auth";
import currentuserreducer from "./currentuser.js";
import usersreducer from "./users";
import questionreducer from "./question";
import videoquestionreducer from './videoquestion.js';

export default combineReducers({
     auth:authreducer,
    currentuserreducer,
    usersreducer,
    questionreducer,
    videoquestionreducer,
});