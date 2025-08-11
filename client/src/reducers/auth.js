

const initialState = {
    data: null,
    loginHistory: [] 
};

const authreducer = (state = initialState, action) => {
    switch (action.type) {
        case "AUTH":
            localStorage.setItem("Profile", JSON.stringify({ ...action?.data }));
            return { ...state, data: action?.data };
        
        case "SET_LOGIN_HISTORY":
            return { ...state, loginHistory: action.payload }; // Set history data in state
        
        case "LOGOUT":
            localStorage.clear();
            return { ...state, data: null, loginHistory: [] };
        
        default:
            return state;
    }
};

export default authreducer;
