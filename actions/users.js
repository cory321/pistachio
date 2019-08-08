export const ADD = 'USERS_ADD';
export const ADD_MANY = 'USERS_ADD_MANY';
export const FETCH = 'USERS_FETCH';
export const SUCCESS = 'USERS_SUCCESS';
export const ERROR = 'USERS_ERROR';

export function add( user ) {
	return {
		type: ADD,
		payload: user,
	};
}

export function addMany( users ) {
	return {
		type: ADD_MANY,
		payload: users,
	};
}
