import Cookies from 'js-cookie';
import { LOCAL_SESSION } from '@/.config';

export function getToken (sessionKey = LOCAL_SESSION) {
	return Cookies.get(sessionKey);
}

export function setToken (token, expireAt) {
	Cookies.set(LOCAL_SESSION, token, { expires: new Date(expireAt) });
	Cookies.set('expireAt', expireAt);
}

export function expireToken (expireAt) {
	if (Cookies.get(LOCAL_SESSION)) {
		Cookies.set(LOCAL_SESSION, Cookies.get(LOCAL_SESSION), { expires: new Date(expireAt) });
		Cookies.set('expireAt', expireAt);
	}
}

export function removeToken () {
	return Cookies.remove(LOCAL_SESSION);
}
