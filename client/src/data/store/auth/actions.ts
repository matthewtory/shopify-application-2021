import firebase from 'firebase';

export const AUTH_ACTION_SET_USER = 'setUser';

export type AuthActionSetUser = {
    type: typeof AUTH_ACTION_SET_USER,
    user: firebase.User | null
}

export type AuthActionTypes = AuthActionSetUser

export const setUser = (user: firebase.User | null): AuthActionSetUser => ({
    type: AUTH_ACTION_SET_USER,
    user
});