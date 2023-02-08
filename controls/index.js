import apiFetch from '@wordpress/api-fetch';

export default {
	FETCH_FROM_API( action ) {
		return apiFetch( { path: action.path } );
	},
};
