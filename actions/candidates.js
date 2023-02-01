import apiFetch from '@wordpress/api-fetch';

export const ADD = 'CANDIDATES_ADD';
export const ADD_MANY = 'CANDIDATES_ADD_MANY';
export const REMOVE = 'CANDIDATES_REMOVE';
export const FETCH = 'CANDIDATES_FETCH';
export const SUCCESS = 'CANDIDATES_SUCCESS';
export const ERROR = 'CANDIDATES_ERROR';

export function add( candidate ) {
	return {
		type: ADD,
		payload: candidate,
	};
}

export function remove( candidateId ) {
	return {
		type: REMOVE,
		payload: candidateId,
	};
}

export function addMany( candidates ) {
	return {
		type: ADD_MANY,
		payload: candidates,
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

export function uploadCoverLetter() {
	throw 'Not implemented';
}

// create a thunk to fetch candidates
export function fetchCandidatesAsync() {
	return async dispatch => {
		dispatch( { type: FETCH } );

		try {
			const candidates = await apiFetch( { path: '/wp/v2/candidates/?per_page=300' } );
			dispatch( addMany( candidates ) );
			dispatch( success( candidates ) );
		} catch ( error ) {
			dispatch( error( error ) );
		}
	};
}
