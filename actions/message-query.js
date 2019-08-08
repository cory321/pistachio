export const SET = 'MESSAGE_QUERY_SET';

export function set( query ) {
	return {
		type: SET,
		payload: query,
	};
}
