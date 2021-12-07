export const ADD = 'JOBS_ADD';
export const ADD_MANY = 'JOBS_ADD_MANY';
export const FETCH = 'JOBS_FETCH';
export const SUCCESS = 'JOBS_SUCCESS';
export const ERROR = 'JOBS_ERROR';

export function add( job ) {
	return {
		type: ADD,
		payload: job,
	};
}

export function addMany( jobs ) {
	return {
		type: ADD_MANY,
		payload: jobs,
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

export function fetch( addresses ) {
	throw 'Not Implemented';
}

export function fetchNew( addresses ) {
	throw 'Not Implemented';
}