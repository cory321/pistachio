import apiFetch from '@wordpress/api-fetch';

export const ADD = 'CANDIDATES_ADD';
export const ADD_MANY = 'CANDIDATES_ADD_MANY';
export const UPDATE = 'CANDIDATES_UPDATE';
export const UPDATE_PRONOUNS = 'CANDIDATES_UPDATE_PRONOUNS';
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

export function addMany( candidates ) {
	return {
		type: ADD_MANY,
		payload: candidates,
	};
}

export function update( id, updatedCandidate ) {
	return {
		type: UPDATE,
		payload: {
			id,
			updatedCandidate,
		},
	};
}

export function remove( candidateId ) {
	return {
		type: REMOVE,
		payload: candidateId,
	};
}

export function fetch() {
	return { type: FETCH };
}

export function test() {
	return { type: 'TEST' };
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

export function fetchFromAPI( path ) {
	return {
		type: 'FETCH_FROM_API',
		path,
	};
}
export function updatePronouns( candidate, pronouns ) {
	return {
		type: UPDATE_PRONOUNS,
		candidate,
		pronouns,
	};
}

export function* addPronouns( candidate, pronouns ) {
	try {
		const result = yield updatePronouns( candidate, pronouns );
		debugger;
		if ( result ) {
			return result;
		}
	} catch ( err ) {
		console.error( err );
		yield error( err );
	}
	return;
}

// create a thunk to fetch candidates
export function fetchCandidatesAsync() {
	return async dispatch => {
		dispatch( fetch() );

		try {
			const candidates = await apiFetch( { path: '/wp/v2/candidates/?per_page=300' } );
			dispatch( addMany( candidates ) );
			dispatch( success( candidates ) );
		} catch ( err ) {
			dispatch( error( err ) );
		}
	};
}
