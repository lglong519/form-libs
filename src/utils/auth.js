import Cookies from 'js-cookie';
import { LOCAL_SESSION } from '@/.config';

export function getToken () {
	return Cookies.get(LOCAL_SESSION);
}

export function setToken (token) {
	return Cookies.set(LOCAL_SESSION, token);
}

export function removeToken () {
	return Cookies.remove(LOCAL_SESSION);
}
