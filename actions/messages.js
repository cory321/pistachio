export const ADD = 'MESSAGES_ADD';
export const ADD_MANY = 'MESSAGES_ADD_MANY';
export const SET_MANY = 'MESSAGES_SET_MANY';
export const SET_NAME = 'MESSAGES_SET_NAME';
export const SET_META = 'MESSAGES_SET_META';
export const FETCH = 'MESSAGES_FETCH';
export const SUCCESS = 'MESSAGES_SUCCESS';
export const ERROR = 'MESSAGES_ERROR';

export function add( message ) {
	return {
		type: ADD,
		payload: message,
	};
}

export function addMany( messages ) {
	return {
		type: ADD_MANY,
		payload: messages,
	};
}

export function setMany( messages ) {
	return {
		type: SET_MANY,
		payload: messages,
	};
}

export function setName( id, name ) {
	return {
		type: SET_NAME,
		payload: { id, name },
	};
}

export function setMeta( id, meta ) {
	return {
		type: SET_META,
		payload: { id, meta },
	};
}

export function success( fetchStart ) {
	return {
		type: SUCCESS,
		payload: fetchStart,
	};
}

export function error( err ) {
	return {
		type: ERROR,
		payload: err.toString(),
	};
}

export function fetch( query ) {
	throw 'Not Implemented';
}

export function getAttachment( messageId, attachment ) {
	throw 'Not Implemented';
}

export function addLabel( ids, labelId ) {
	throw 'Not Implemented';
}
