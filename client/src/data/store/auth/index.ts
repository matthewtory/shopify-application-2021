import produce from 'immer';
import firebase from 'firebase';
import { AUTH_ACTION_SET_USER, setUser } from './actions';
import { Store } from 'redux';
import { firebaseApp } from 'data';
import { AppAction, AppState } from 'data/store';

export type AuthState = {
    user?: firebase.User | null
}

const initialState: AuthState = {};

const authReducer = (state = initialState, action: AppAction): AuthState => {
    switch (action.type) {
        case AUTH_ACTION_SET_USER:
            return produce(state, draft => {
                draft.user = action.user;
            });
        default:
            return state;
    }
};

export const initializeAuth = (store: Store<AppState, AppAction>) => {
    const auth = firebaseApp.auth();

    if (!auth.currentUser) {
        auth.signInAnonymously()
            .then((user) => console.log('Signed in as anonymous user', user.user?.uid))
            .catch((e) => console.log('error signing in', e));
    }
    firebaseApp.auth().onAuthStateChanged((user) => store.dispatch(setUser(user)));
};

export default authReducer;