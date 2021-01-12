import {AuthActionTypes} from "./actions";

type AuthState = {}

const initialState: AuthState = {}

const authReducer = (state = initialState, action: AuthActionTypes): AuthState => {
    return state;
}

export default authReducer