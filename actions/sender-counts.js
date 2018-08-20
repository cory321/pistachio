/** @format */

export const SET = 'SENDER_COUNTS_SET';
export const FETCH = 'SENDER_COUNTS_FETCH';
export const SUCCESS = 'SENDER_COUNTS_SUCCESS';
export const ERROR = 'SENDER_COUNTS_ERROR';

export function set( senderCounts ) {
	return {
		type: SET,
		payload: senderCounts,
	};
}

export function fetch( addresses ) {
	throw 'Not Implemented';
}
