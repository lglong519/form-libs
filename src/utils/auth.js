import Cookies from 'js-cookie';
import { LOCAL_SESSION } from '@/.config';

export function getToken () {
	return Cookies.get(LOCAL_SESSION);
}

export function setToken (token, expireAt) {
	return Cookies.set(LOCAL_SESSION, token, { expires: new Date(expireAt) });
}

export function expireToken (expireAt) {
	if (Cookies.get(LOCAL_SESSION)) {
		Cookies.set(LOCAL_SESSION, Cookies.get(LOCAL_SESSION), { expires: new Date(expireAt) });
	}
}

export function removeToken () {
	return Cookies.remove(LOCAL_SESSION);
}
